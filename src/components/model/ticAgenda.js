import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicAgendaService } from "../../service/model/TicAgendaService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import InputMask from 'react-input-mask';
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const TicAgenda = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticAgenda, setTicAgenda] = useState(props.ticAgenda);
    const [submitted, setSubmitted] = useState(false);
    const [ddTpItem, setDdTpItem] = useState(null);
    const [ddTpItems, setDdTpItems] = useState(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticAgenda.valid));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.TIC_BACK_URL}/tic/x/agendatp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTpItems(dataDD);
                setDdTpItem(dataDD.find((item) => item.code === props.ticAgenda.tg) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
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
            ticAgenda.begtm = DateFunction.convertTimeToDBFormat(ticAgenda.begtm)
            ticAgenda.endtm = DateFunction.convertTimeToDBFormat(ticAgenda.endtm)
            const ticAgendaService = new TicAgendaService();
            const data = await ticAgendaService.postTicAgenda(ticAgenda);
            ticAgenda.id = data
            props.handleDialogClose({ obj: ticAgenda, agendaTip: props.agendaTip });
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
            console.log("Preeeeeeee", ticAgenda.begtm)
            ticAgenda.begtm = DateFunction.convertTimeToDBFormat(ticAgenda.begtm)
            ticAgenda.endtm = DateFunction.convertTimeToDBFormat(ticAgenda.endtm)
            console.log("Posleeeeeeeeee", ticAgenda.begtm)
            const ticAgendaService = new TicAgendaService();
            await ticAgendaService.putTicAgenda(ticAgenda);
            props.handleDialogClose({ obj: ticAgenda, agendaTip: props.agendaTip });
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
            const ticAgendaService = new TicAgendaService();
            await ticAgendaService.deleteTicAgenda(ticAgenda);
            props.handleDialogClose({ obj: ticAgenda, agendaTip: 'DELETE' });
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

    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "options") {
            if (name == "tg") {
                setDdTpItem(e.value);
                ticAgenda.ctp = e.value.code
                ticAgenda.ntp = e.value.name
            } else {
                setDropdownItem(e.value);
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticAgenda = { ...ticAgenda };
        _ticAgenda[`${name}`] = val;
        if (name === `textx`) _ticAgenda[`text`] = val

        setTicAgenda(_ticAgenda);
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
                        <div className="field col-12 md:col-7">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={ticAgenda.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticAgenda.code })}
                            />
                            {submitted && !ticAgenda.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="textx">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={ticAgenda.textx} onChange={(e) => onInputChange(e, "text", 'textx')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticAgenda.textx })}
                            />
                            {submitted && !ticAgenda.textx && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="tg">{translations[selectedLanguage].AgendaTp} *</label>
                            <Dropdown id="tg"
                                value={ddTpItem}
                                options={ddTpItems}
                                onChange={(e) => onInputChange(e, "options", 'tg')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticAgenda.tg })}
                            />
                            {submitted && !ticAgenda.tg && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="begtm">{translations[selectedLanguage].BegTM}</label>
                            <InputText
                                id="begtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticAgenda.begtm)} onChange={(e) => onInputChange(e, "text", 'begtm')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticAgenda.begtm })}
                            />
                            {submitted && !ticAgenda.begtm && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="endtm">{translations[selectedLanguage].EndTM}</label>
                            <InputText
                                id="endtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticAgenda.endtm)} onChange={(e) => onInputChange(e, "text", 'endtm')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticAgenda.endtm })}
                            />
                            {submitted && !ticAgenda.endtm && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticAgenda.valid })}
                            />
                            {submitted && !ticAgenda.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.agendaTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.agendaTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.agendaTip !== 'CREATE') ? (
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
                item={ticAgenda.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicAgenda;
