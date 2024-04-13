import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffZapService } from "../../service/model/CoffZapService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { SapDataService } from "../../service/model/SapDataService";

const CoffZap = (props) => {
    console.log(props, "@@@@@@@@@@@@@@@@@@@@@@ CoffZap @@@@@@@@@@@@@@@@@@@@@@@@@@@")

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [coffZap, setCoffZap] = useState(props.coffZap);
    const [submitted, setSubmitted] = useState(false);

    const [ddZapDDItem, setDdZapDDItem] = useState(null);
    const [ddZapDDItems, setDdZapDDItems] = useState(null);
    const [zapDDItem, setZapDDItem] = useState(null);
    const [zapDDItems, setZapDDItems] = useState(null);

    const [ddObjDDItem, setDdObjDDItem] = useState(null);
    const [ddObjDDItems, setDdObjDDItems] = useState(null);
    const [objDDItem, setObjDDItem] = useState(null);
    const [objDDItems, setObjDDItems] = useState(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];
    let i = 0
    useEffect(() => {
        async function fetchData() {
            try {
                const zapDDService = new SapDataService();
                const data = await zapDDService.getLista('zap');

                setZapDDItems(data)
                const dataDD = data.map(({ N2ZAP, ZAP }) => ({ name: N2ZAP, code: ZAP }));

                setDdZapDDItems(dataDD);
                const foundDD = await dataDD.find((item) => item.code == props.coffZap.zap)

                await setDdZapDDItem(foundDD);
                if (props.coffZap.zap) {
                    const foundItem = await data.find((item) => item.ZAP == props.coffZap.zap);

                    setZapDDItem(foundItem || null);
                    coffZap.IME = foundItem.IME
                    coffZap.PREZIME = foundItem.PREZIME
                    coffZap.NRM = foundItem.NRM
                    coffZap.nzap = foundItem.N2ZAP
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const cmnObjService = new CoffZapService();
                    const data = await cmnObjService.getListObjaLL("COFF");
                    const objIdLocal = props.coffZap.obj||-1 

                    setObjDDItems(data);
                    const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));

                    setDdObjDDItems(dataDD);
                    const foundDD = await dataDD.find((item) => item.code == objIdLocal)
                    console.log(data, "***", objIdLocal, "**********************  OBJ **************************", foundDD)
                    await setDdObjDDItem(foundDD);
                    if (props.coffZap.obj) {
                        const foundItem = await data.find((item) => item.id == objIdLocal);
    
                        setObjDDItem(foundItem || null);
                        coffZap.nobj = foundItem.text
                    }                    
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.coffZap.valid));
    }, []);

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const coffZapService = new CoffZapService();
            const data = await coffZapService.postCoffZap(coffZap);
            coffZap.id = data
            props.handleDialogClose({ obj: coffZap, zapTip: props.zapTip });
            props.setVisible(false);
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
            const coffZapService = new CoffZapService();
            await coffZapService.putCoffZap(coffZap);
            props.handleDialogClose({ obj: coffZap, zapTip: props.zapTip });
            props.setVisible(false);
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
            const coffZapService = new CoffZapService();
            await coffZapService.deleteCoffZap(coffZap);
            props.handleDialogClose({ obj: coffZap, zapTip: 'DELETE' });
            props.setVisible(false);
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

    const onInputChange = async (e, type, name) => {
        let val = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "zap") {
                setDdZapDDItem(e.value);
                const foundItem = await zapDDItems.find((item) => item.ZAP === val);
                console.log(foundItem, "@#@#@#@#@#@#@#@#@# onInputChange @#@#@#@#@#", val, "@#@#@#@#@#@#@#", zapDDItems)
                setZapDDItem(foundItem || null);
                coffZap.IME = foundItem?.IME
                coffZap.PREZIME = foundItem?.PREZIME
                coffZap.NRM = foundItem?.NRM
                coffZap.nzap = foundItem?.N2ZAP
            } else if (name == "obj") {
                setDdObjDDItem(e.value);
                const foundItem = await objDDItems.find((item) => item.id === val);
                console.log(foundItem, "@#@#@#@#@#@#@#@#@# onInputChange @#@#@#@#@#", val, "@#@#@#@#@#@#@#", zapDDItems)
                setZapDDItem(foundItem || null);
                coffZap.nobj = foundItem?.text
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _coffZap = { ...coffZap };
        _coffZap[`${name}`] = val;
        if (name === `text`) _coffZap[`text`] = val

        setCoffZap(_coffZap);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-10">
                            <label htmlFor="zap">{translations[selectedLanguage].Zap} *</label>
                            <Dropdown id="zap"
                                value={ddZapDDItem}
                                options={ddZapDDItems}
                                onChange={(e) => onInputChange(e, "options", 'zap')}
                                required
                                showClear
                                filter
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffZap.zap })}
                            />
                            {submitted && !coffZap.zap && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-7">
                            <label htmlFor="pravilnik">{translations[selectedLanguage].Pravilnik}</label>
                            <InputText id="pravilnik" autoFocus
                                value={coffZap.pravilnik} onChange={(e) => onInputChange(e, "text", 'pravilnik')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffZap.pravilnik })}
                            />
                            {submitted && !coffZap.pravilnik && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="oblast">{translations[selectedLanguage].Oblast}</label>
                            <InputText
                                id="oblast"
                                value={coffZap.oblast} onChange={(e) => onInputChange(e, "text", 'oblast')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffZap.oblast })}
                            />
                            {submitted && !coffZap.oblast && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="mtroska">{translations[selectedLanguage].Mtroska}</label>
                            <InputText
                                id="mtroska"
                                value={coffZap.mtroska} onChange={(e) => onInputChange(e, "text", 'mtroska')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffZap.mtroska })}
                            />
                            {submitted && !coffZap.mtroska && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-10">
                            <label htmlFor="obj">{translations[selectedLanguage].Obj} *</label>
                            <Dropdown id="obj"
                                value={ddObjDDItem}
                                options={ddObjDDItems}
                                onChange={(e) => onInputChange(e, "options", 'obj')}
                                required
                                showClear
                                filter
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffZap.obj })}
                            />
                            {submitted && !coffZap.obj && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.zapTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.zapTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.zapTip !== 'CREATE') ? (
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
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={coffZap.N2ZAP}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CoffZap;
