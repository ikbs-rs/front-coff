import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventobjService } from "../../service/model/TicEventobjService";
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
import { ColorPicker } from 'primereact/colorpicker';
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const TicEventobj = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventobj, setTicEventobj] = useState(props.ticEventobj);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicEventobjItem, setDdTicEventobjItem] = useState(null);
    const [ddTicEventobjItems, setDdTicEventobjItems] = useState(null);
    const [ticEventobjItem, setTicEventobjItem] = useState(null);
    const [ticEventobjItems, setTicEventobjItems] = useState(null);

    const [ddTicEventobjtpItem, setDdTicEventobjtpItem] = useState(null);
    const [ddTicEventobjtpItems, setDdTicEventobjtpItems] = useState(null);
    const [ticEventobjtpItem, setTicEventobjtpItem] = useState(null);
    const [ticEventobjtpItems, setTicEventobjtpItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEventobj.begda || props.ticEvent.begda)));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEventobj.endda || props.ticEvent.endda)));
    ticEventobj.endtm = ticEventobj.endtm || props.ticEvent.endtm
    ticEventobj.begtm = ticEventobj.begtm || props.ticEvent.begtm

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventobjService = new TicEventobjService();
                const data = await ticEventobjService.getCmnTpLista('objtp');
                setTicEventobjtpItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventobjtpItems(dataDD);
                setDdTicEventobjtpItem(dataDD.find((item) => item.code === props.ticEventobj.objtp) || null);
                if (props.ticEventobj.objtp) {
                    const foundItem = data.find((item) => item.id === props.ticEventobj.objtp);
                    setTicEventobjtpItem(foundItem || null);
                    ticEventobj.cobjtp = foundItem.code
                    ticEventobj.nobjtp = foundItem.textx
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
                const tp = ticEventobj.objtp || -1
                const ticEventobjService = new TicEventobjService();
                const data = await ticEventobjService.getCmnLista('obj', tp);
                setTicEventobjItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventobjItems(dataDD);
                setDdTicEventobjItem(dataDD.find((item) => item.code === props.ticEventobj.obj) || null);
                if (props.ticEventobj.obj) {
                    const foundItem = data.find((item) => item.id === props.ticEventobj.obj);
                    setTicEventobjItem(foundItem || null);
                    ticEventobj.cobj = foundItem.code
                    ticEventobj.nobj = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [ticEventobj.objtp]);
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticEventobj.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventobj.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEventobj.begtm = DateFunction.convertTimeToDBFormat(ticEventobj.begtm)
            ticEventobj.endtm = DateFunction.convertTimeToDBFormat(ticEventobj.endtm)
            const ticEventobjService = new TicEventobjService();
            const data = await ticEventobjService.postTicEventobj(ticEventobj);
            ticEventobj.id = data
            props.handleDialogClose({ obj: ticEventobj, eventobjTip: props.eventobjTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventobj ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            ticEventobj.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventobj.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEventobj.begtm = DateFunction.convertTimeToDBFormat(ticEventobj.begtm)
            ticEventobj.endtm = DateFunction.convertTimeToDBFormat(ticEventobj.endtm)
            const ticEventobjService = new TicEventobjService();
            const newTicEventobj = { ...ticEventobj, id: null};
            const data = await ticEventobjService.postTicEventobj(newTicEventobj);
            ticEventobj.id = data
            props.handleDialogClose({ obj: ticEventobj, eventobjTip: props.eventobjTip });
            //props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventobj ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEventobj.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventobj.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            ticEventobj.begtm = DateFunction.convertTimeToDBFormat(ticEventobj.begtm)
            ticEventobj.endtm = DateFunction.convertTimeToDBFormat(ticEventobj.endtm)
            const ticEventobjService = new TicEventobjService();

            await ticEventobjService.putTicEventobj(ticEventobj);
            props.handleDialogClose({ obj: ticEventobj, eventobjTip: props.eventobjTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventobj ",
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
            const ticEventobjService = new TicEventobjService();
            await ticEventobjService.deleteTicEventobj(ticEventobj);
            props.handleDialogClose({ obj: ticEventobj, eventobjTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventobj ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        let foundItem = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            switch (name) {
                case "objtp":
                    setDdTicEventobjtpItem(e.value);
                    foundItem = ticEventobjtpItems.find((item) => item.id === val);
                    setTicEventobjtpItem(foundItem || null);
                    ticEventobj.cobjtp = foundItem.code
                    ticEventobj.nobjtp = e.value.name
                    break;
                case "obj":
                    setDdTicEventobjItem(e.value);
                    foundItem = ticEventobjItems.find((item) => item.id === val);
                    setTicEventobjItem(foundItem || null);
                    ticEventobj.cobj = foundItem.code
                    ticEventobj.nobj = e.value.name
                    break;
                default:
                    console.error("Pogresan naziv options polja")
            }
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
        let _ticEventobj = { ...ticEventobj };
        _ticEventobj[`${name}`] = val;
        setTicEventobj(_ticEventobj);
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
                            <label htmlFor="objtp">{translations[selectedLanguage].Objtp} *</label>
                            <Dropdown id="objtp"
                                value={ddTicEventobjtpItem}
                                options={ddTicEventobjtpItems}
                                onChange={(e) => onInputChange(e, "options", 'objtp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventobj.objtp })}
                            />
                            {submitted && !ticEventobj.objtp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="obj">{translations[selectedLanguage].Obj} *</label>
                            <Dropdown id="obj"
                                value={ddTicEventobjItem}
                                options={ddTicEventobjItems}
                                onChange={(e) => onInputChange(e, "options", 'obj')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventobj.obj })}
                            />
                            {submitted && !ticEventobj.obj && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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

                        <div className="field col-12 md:col-2">
                            <label htmlFor="begtm">{translations[selectedLanguage].BegTM}</label>
                            <InputText
                                id="begtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEventobj.begtm)} onChange={(e) => onInputChange(e, "text", 'begtm')}
                            // required
                            // className={classNames({ 'p-invalid': submitted && !ticEventobj.begtm })}
                            />
                            {/* {submitted && !ticEventobj.begtm && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>} */}
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


                        <div className="field col-12 md:col-2">
                            <label htmlFor="endtm">{translations[selectedLanguage].EndTM}</label>
                            <InputText
                                id="endtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEventobj.endtm)} onChange={(e) => onInputChange(e, "text", 'endtm')}
                            //required
                            //className={classNames({ 'p-invalid': submitted && !ticEventobj.endtm })}
                            />
                            {/* {submitted && !ticEventobj.endtm && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>} */}
                        </div>
                    </div>
                    <div className="field col-12 md:col-1">
                        <div className="flex-2 flex flex-column align-items-left">
                            <label htmlFor="color">{translations[selectedLanguage].color}</label>
                            <ColorPicker format="hex" id="color" value={ticEventobj.color} onChange={(e) => onInputChange(e, 'text', 'color')} />
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
                            {(props.eventobjTip === 'CREATE') ? (
                                <>
                                    <Button
                                        label={translations[selectedLanguage].Create}
                                        icon="pi pi-check"
                                        onClick={handleCreateClick}
                                        severity="success"
                                        outlined
                                    />
                                    <Button
                                        label={translations[selectedLanguage].CreateAndAddNew}
                                        icon="pi pi-plus"
                                        onClick={handleCreateAndAddNewClick}
                                        severity="success"
                                        outlined
                                    />
                                </>
                            ) : null}
                            {(props.eventobjTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventobjTip !== 'CREATE') ? (
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
                inTicEventobj="delete"
                item={ticEventobj.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventobj;
