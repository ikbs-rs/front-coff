import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffDocService } from "../../service/model/CoffDocService";
import { CoffZapService } from "../../service/model/CoffZapService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import CoffDocsL from './coffDocsL';

const CoffDoc = (props) => {
    console.log(props, "!!@@@@@@@@@@@@@@@@@@@@@@@@@@ CoffDoc @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@!!")

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [coffDoc, setCoffDoc] = useState(props.coffDoc);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Isporuceno}`, code: '2' },
        { name: `${translations[selectedLanguage].Cekanje}`, code: '1' },
        { name: `${translations[selectedLanguage].Prijem}`, code: '0' }
    ];


    const [ddCoffZapItem, setDdCoffZapItem] = useState(null);
    const [ddCoffZapItems, setDdCoffZapItems] = useState(null);
    const [coffZapItem, setCoffZapItem] = useState(null);
    const [coffZapItems, setCoffZapItems] = useState(null);
    const [coffDocVisible, setCoffDocVisible] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const coffZapService = new CoffZapService();
                const data = await coffZapService.getCoffZaps();

                setCoffZapItems(data)
                console.log(data, "************ coffZapService ************ 11***")
                const dataDD = data.map(({ zap, id }) => ({ name: zap, code: id }));
                console.log(data, "************ coffZapService ************", dataDD)
                setDdCoffZapItems(dataDD);
                setDdCoffZapItem(dataDD.find((item) => item.code === props.coffDoc.potpisnik) || null);

                if (props.coffDoc.potpisnik && props.coffDoc.potpisnik != 'null') {
                    const foundItem = data.find((item) => item.id === props.coffDoc.potpisnik);
                    console.log(props.coffDoc.potpisnik, "---------------foundItem-----------------", foundItem)
                    setCoffZapItem(foundItem || null);
                    coffZapItem.potpisnik = foundItem?.id
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.coffDoc.status));
    }, []);

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };


    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setCoffDocVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            coffDoc.vreme = DateFunction.formatDatetime(DateFunction.currDatetime())
            coffDoc.ndoctp = props.coffDoc.ndoctp
            const coffDocService = new CoffDocService();
            const data = await coffDocService.postCoffDoc(coffDoc);
            coffDoc.id = data
            props.handleDialogClose({ obj: coffDoc, docTip: props.docTip });
            props.setCoffDocVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            coffDoc.vreme = DateFunction.formatDatetime(DateFunction.currDatetime())
            const coffDocService = new CoffDocService();
            await coffDocService.putCoffDoc(coffDoc);
            props.handleDialogClose({ obj: coffDoc, docTip: props.docTip });
            props.setCoffDocVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const coffDocService = new CoffDocService();
            await coffDocService.deleteCoffDoc(coffDoc);
            props.handleDialogClose({ obj: coffDoc, docTip: 'DELETE' });
            props.setCoffDocVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "options") {
            if (name == "potpisnik") {
                setDdCoffZapItem(e.value);
                const foundItem = coffZapItems.find((item) => item.id === val);
                setCoffZapItem(foundItem || null);
                // ticEventatt.ntp = e.value.name
                // ticEventatt.ctp = foundItem.code
            } else {
                setDropdownItem(e.value);
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _coffDoc = { ...coffDoc };
        _coffDoc[`${name}`] = val;
        if (name === `textx`) _coffDoc[`text`] = val

        setCoffDoc(_coffDoc);
    };
    const handleDialogClose = (newObj) => {
        const localObj = { newObj };
    }
    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="potpisnik">{translations[selectedLanguage].potpisnik} *</label>
                            <Dropdown id="potpisnik"
                                value={ddCoffZapItem}
                                options={ddCoffZapItems}
                                onChange={(e) => onInputChange(e, "options", 'potpisnik')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffDoc.potpisnik })}
                            />
                            {submitted && !coffDoc.potpisnik && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="mesto">{translations[selectedLanguage].Mesto}</label>
                            <InputText
                                id="mesto"
                                value={coffDoc.mesto} onChange={(e) => onInputChange(e, "text", 'mesto')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffDoc.mesto })}
                            />
                            {submitted && !coffDoc.mesto && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-10">
                            <label htmlFor="napomena">{translations[selectedLanguage].napomena}</label>
                            <InputText
                                id="napomena"
                                value={coffDoc.napomena} onChange={(e) => onInputChange(e, "text", 'napomena')}
                            />
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="status">{translations[selectedLanguage].Status}</label>
                            <Dropdown id="status"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'status')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-instatus': submitted && !coffDoc.status })}
                            />
                            {submitted && !coffDoc.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? (
                            <Button
                                label={translations[selectedLanguage].Cancel}
                                icon="pi pi-times"
                                className="p-button-outlined p-button-secondary"
                                onClick={handleCancelClick}
                                outlined
                            />
                        ) : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.docTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.docTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Save}
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
                stVisible
                {(props.stVisible) ? (
                    <div className="col-lg-12 details order-1 order-lg-1">
                        < CoffDocsL
                            parameter={"inputTextValue"}
                            coffDoc={coffDoc}
                            handleDialogClose={handleDialogClose}
                            setCoffDocVisible={setCoffDocVisible}
                            dialog={true}
                            datarefresh={props.dataTab}
                        // onDataUpdate={handleDataUpdate} 
                        />
                    </div>
                ) : null}
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={coffDoc.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CoffDoc;
