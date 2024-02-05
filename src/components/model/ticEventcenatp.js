import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventcenatpService } from "../../service/model/TicEventcenatpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const TicEventcenatp = (props) => {
    
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventcenatp, setTicEventcenatp] = useState(props.ticEventcenatp);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicEventcenatpItem, setDdTicEventcenatpItem] = useState(null);
    const [ddTicEventcenatpItems, setDdTicEventcenatpItems] = useState(null);
    const [ticEventcenatpItem, setTicEventcenatpItem] = useState(null);
    const [ticEventcenatpItems, setTicEventcenatpItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEventcenatp.begda || props.ticEvent.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEventcenatp.endda || props.ticEvent.endda)))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.TIC_BACK_URL}/tic/x/cenatp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setTicEventcenatpItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventcenatpItems(dataDD);
                setDdTicEventcenatpItem(dataDD.find((item) => item.code === props.ticEventcenatp.cenatp) || null);
                if (props.ticEventcenatp.cenatp) {
                    const foundItem = data.find((item) => item.id === props.ticEventcenatp.cenatp);
                    setTicEventcenatpItem(foundItem || null);
                    ticEventcenatp.ccenatp = foundItem.code
                    ticEventcenatp.ncenatp = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticEventcenatp.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventcenatp.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventcenatpService = new TicEventcenatpService();
            const data = await ticEventcenatpService.postTicEventcenatp(ticEventcenatp);
            ticEventcenatp.id = data
            props.handleDialogClose({ obj: ticEventcenatp, eventcenatpTip: props.eventcenatpTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventcenatp ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEventcenatp.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventcenatp.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const ticEventcenatpService = new TicEventcenatpService();

            await ticEventcenatpService.putTicEventcenatp(ticEventcenatp);
            props.handleDialogClose({ obj: ticEventcenatp, eventcenatpTip: props.eventcenatpTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventcenatp ",
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
            const ticEventcenatpService = new TicEventcenatpService();
            await ticEventcenatpService.deleteTicEventcenatp(ticEventcenatp);
            props.handleDialogClose({ obj: ticEventcenatp, eventcenatpTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventcenatp ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicEventcenatpItem(e.value);
            const foundItem = ticEventcenatpItems.find((item) => item.id === val);
            setTicEventcenatpItem(foundItem || null);
            ticEventcenatp.ncenatp = e.value.name
            ticEventcenatp.ccenatp = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    break;
                case "endda":
                    setEndda(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticEventcenatp = { ...ticEventcenatp };
        _ticEventcenatp[`${name}`] = val;
        setTicEventcenatp(_ticEventcenatp);
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
                            <InputText id="code"
                                value={props.ticEvent.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.ticEvent.text}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="cenatp">{translations[selectedLanguage].Cenatp} *</label>
                            <Dropdown id="cenatp"
                                value={ddTicEventcenatpItem}
                                options={ddTicEventcenatpItems}
                                onChange={(e) => onInputChange(e, "options", 'cenatp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventcenatp.cenatp })}
                            />
                            {submitted && !ticEventcenatp.cenatp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />

                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
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
                            {(props.eventcenatpTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.eventcenatpTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventcenatpTip !== 'CREATE') ? (
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
                inTicEventcenatp="delete"
                item={ticEventcenatp.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventcenatp;
