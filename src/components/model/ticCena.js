import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicCenaService } from "../../service/model/TicCenaService";
import { TicCenatpService } from "../../service/model/TicCenatpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker } from 'primereact/colorpicker';

const TicCena = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticCena, setTicCena] = useState(props.ticCena);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicCenatpItem, setDdTicCenatpItem] = useState(null);
    const [ddTicCenatpItems, setDdTicCenatpItems] = useState(null);
    const [ticCenatpItem, setTicCenatpItem] = useState(null);
    const [ticCenatpItems, setTicCenatpItems] = useState(null);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);

    const calendarRef = useRef(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticCena.valid));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticCenatpService = new TicCenatpService();
                const data = await ticCenatpService.getTicCenatps();

                setTicCenatpItems(data)
                //console.log("******************", ticCenatpItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicCenatpItems(dataDD);
                setDdTicCenatpItem(dataDD.find((item) => item.code === props.ticCena.tp) || null);
                if (props.ticCena.tp) {
                    const foundItem = data.find((item) => item.id === props.ticCena.tp);
                    setTicCenatpItem(foundItem || null);
                    ticCena.ctp = foundItem.code
                    ticCena.ntp = foundItem.textx
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
            const ticCenaService = new TicCenaService();
            const data = await ticCenaService.postTicCena(ticCena);
            ticCena.id = data
            props.handleDialogClose({ obj: ticCena, cenaTip: props.cenaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicCena ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticCenaService = new TicCenaService();

            await ticCenaService.putTicCena(ticCena);
            props.handleDialogClose({ obj: ticCena, cenaTip: props.cenaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicCena ",
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
            const ticCenaService = new TicCenaService();
            await ticCenaService.deleteTicCena(ticCena);
            props.handleDialogClose({ obj: ticCena, cenaTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicCena ",
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
                setDdTicCenatpItem(e.value);
                const foundItem = ticCenatpItems.find((item) => item.id === val);
                setTicCenatpItem(foundItem || null);
                ticCena.ntp = e.value.name
                ticCena.ctp = foundItem.code
            } else {
                setDropdownItem(e.value);
            }

        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticCena = { ...ticCena };
        _ticCena[`${name}`] = val;
        setTicCena(_ticCena);
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
                                value={ticCena.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticCena.code })}
                            />
                            {submitted && !ticCena.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={ticCena.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticCena.text })}
                            />
                            {submitted && !ticCena.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddTicCenatpItem}
                                options={ddTicCenatpItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticCena.tp })}
                            />
                            {submitted && !ticCena.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="field col-12 md:col-1">
                        <div className="flex-2 flex flex-column align-items-left">
                            <label htmlFor="color">{translations[selectedLanguage].color}</label>
                            <ColorPicker format="hex" id="color" value={ticCena.color} onChange={(e) => onInputChange(e, 'text', 'color')} />
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
                                className={classNames({ 'p-invalid': submitted && !ticCena.valid })}
                            />
                            {submitted && !ticCena.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.cenaTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.cenaTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.cenaTip !== 'CREATE') ? (
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
                inTicCena="delete"
                item={ticCena.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicCena;
