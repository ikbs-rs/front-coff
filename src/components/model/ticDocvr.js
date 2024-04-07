import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicDocvrService } from "../../service/model/TicDocvrService";
import { TicDoctpService } from "../../service/model/TicDoctpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';

const TicDocvr = (props) => {
console.log("#####################", props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticDocvr, setTicDocvr] = useState(props.ticDocvr);
    const [submitted, setSubmitted] = useState(false);

    const [ddTicDoctpItem, setDdTicDoctpItem] = useState(null);
    const [ddTicDoctpItems, setDdTicDoctpItems] = useState(null);
    const [ticDoctpItem, setTicDoctpItem] = useState(null);
    const [ticDoctpItems, setTicDoctpItems] = useState(null);

    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);

    const calendarRef = useRef(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticDocvr.valid));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDoctpService = new TicDoctpService();
                const data = await ticDoctpService.getTicDoctps();

                setTicDoctpItems(data)
                //console.log("******************", ticDoctpItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicDoctpItems(dataDD);
                setDdTicDoctpItem(dataDD.find((item) => item.code === props.ticDocvr.tp) || null);
                if (props.ticDocvr.tp) {
                    const foundItem = data.find((item) => item.id === props.ticDocvr.tp);
                    setTicDoctpItem(foundItem || null);
                    ticDocvr.ctp = foundItem.code
                    ticDocvr.ntp = foundItem.textx
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

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
            const ticDocvrService = new TicDocvrService();
            const data = await ticDocvrService.postTicDocvr(ticDocvr);
            ticDocvr.id = data
            props.handleDialogClose({ obj: ticDocvr, docvrTip: props.docvrTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocvr ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticDocvrService = new TicDocvrService();

            await ticDocvrService.putTicDocvr(ticDocvr);
            props.handleDialogClose({ obj: ticDocvr, docvrTip: props.docvrTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocvr ",
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
            const ticDocvrService = new TicDocvrService();
            await ticDocvrService.deleteTicDocvr(ticDocvr);
            props.handleDialogClose({ obj: ticDocvr, docvrTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocvr ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "tp") {
                setDdTicDoctpItem(e.value);
                const foundItem = ticDoctpItems.find((item) => item.id === val);
                setTicDoctpItem(foundItem || null);
                ticDocvr.ntp = e.value.name
                ticDocvr.ctp = foundItem.code
            } else {
                setDropdownItem(e.value);
            }

        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticDocvr = { ...ticDocvr };
        _ticDocvr[`${name}`] = val;
        setTicDocvr(_ticDocvr);
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
                        <div className="field col-12 md:col-5">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={ticDocvr.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDocvr.code })}
                            />
                            {submitted && !ticDocvr.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={ticDocvr.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDocvr.text })}
                            />
                            {submitted && !ticDocvr.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddTicDoctpItem}
                                options={ddTicDoctpItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocvr.tp })}
                            />
                            {submitted && !ticDocvr.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocvr.valid })}
                            />
                            {submitted && !ticDocvr.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.docvrTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.docvrTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docvrTip !== 'CREATE') ? (
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
                inTicDocvr="delete"
                item={ticDocvr.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicDocvr;
