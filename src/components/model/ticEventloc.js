import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventlocService } from "../../service/model/TicEventlocService";
import { TicEventService } from "../../service/model/TicEventService";
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

const TicEventloc = (props) => {
    
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventloc, setTicEventloc] = useState(props.ticEventloc);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicEventlocItem, setDdTicEventlocItem] = useState(null);
    const [ddTicEventlocItems, setDdTicEventlocItems] = useState(null);
    const [ticEventlocItem, setTicEventlocItem] = useState(null);
    const [ticEventlocItems, setTicEventlocItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEventloc.begda || props.ticEvent.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEventloc.endda || props.ticEvent.endda)))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // const url = `${env.CMN_BACK_URL}/cmn/x/loc/?sl=${selectedLanguage}`;
                // const tokenLocal = await Token.getTokensLS();
                // const headers = {
                //     Authorization: tokenLocal.token
                // };
                // const response = await axios.get(url, { headers });
                // const data = response.data.items;
                const ticEventService = new TicEventService();
                const data = await ticEventService.getCmnObjXcsDDLista(props.ticEvent);                
                setTicEventlocItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventlocItems(dataDD);
                setDdTicEventlocItem(dataDD.find((item) => item.code === props.ticEventloc.loc) || null);
                if (props.ticEventloc.loc) {
                    const foundItem = data.find((item) => item.id === props.ticEventloc.loc);
                    setTicEventlocItem(foundItem || null);
                    ticEventloc.cloc = foundItem.code
                    ticEventloc.nloc = foundItem.textx
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
            ticEventloc.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventloc.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventlocService = new TicEventlocService();
            const data = await ticEventlocService.postTicEventloc(ticEventloc);
            ticEventloc.id = data
            props.handleDialogClose({ obj: ticEventloc, eventlocTip: props.eventlocTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventloc ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEventloc.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventloc.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const ticEventlocService = new TicEventlocService();

            await ticEventlocService.putTicEventloc(ticEventloc);
            props.handleDialogClose({ obj: ticEventloc, eventlocTip: props.eventlocTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventloc ",
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
            const ticEventlocService = new TicEventlocService();
            await ticEventlocService.deleteTicEventloc(ticEventloc);
            props.handleDialogClose({ obj: ticEventloc, eventlocTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventloc ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicEventlocItem(e.value);
            const foundItem = ticEventlocItems.find((item) => item.id === val);
            setTicEventlocItem(foundItem || null);
            ticEventloc.nloc = e.value.name
            ticEventloc.cloc = foundItem.code
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
        let _ticEventloc = { ...ticEventloc };
        _ticEventloc[`${name}`] = val;
        setTicEventloc(_ticEventloc);
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
                            <label htmlFor="loc">{translations[selectedLanguage].Location} *</label>
                            <Dropdown id="loc"
                                value={ddTicEventlocItem}
                                options={ddTicEventlocItems}
                                onChange={(e) => onInputChange(e, "options", 'loc')}
                                required                            
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventloc.loc })}
                            />
                            {submitted && !ticEventloc.loc && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.eventlocTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.eventlocTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventlocTip !== 'CREATE') ? (
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
                inTicEventloc="delete"
                item={ticEventloc.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventloc;
