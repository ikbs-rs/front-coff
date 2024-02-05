import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnLoclinkService } from "../../../service/model/cmn/CmnLoclinkService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../../dialog/DeleteDialog';
import { translations } from "../../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
//import { CmnLoclinkService } from "../../service/model/CmnObjattService"
import { InputSwitch } from "primereact/inputswitch";
import env from "../../../configs/env"
import axios from 'axios';
import Token from "../../../utilities/Token";
import { Calendar } from "primereact/calendar";
import DateFunction from "../../../utilities/DateFunction.js"
import { ColorPicker } from 'primereact/colorpicker';

const CmnLoclink = (props) => {
    console.log(props, "********************CmnLoclink********************")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnLoclink, setCmnLoclink] = useState(props.cmnLoclink);
    const [submitted, setSubmitted] = useState(false);
    const [cmnLoctpItem, setCmnLoctp1Item] = useState(null);
    const [cmnLoctp1Items, setCmnLoctp1Items] = useState(null);
    const [cmnLoc1Item, setCmnLoc1Item] = useState(null);
    const [cmnLoc1Items, setCmnLoc1Items] = useState(null);
    const [ddLocTp1Item, setDdLocTp1Item] = useState(props.cmnLoctpId);
    const [ddLocTp1Items, setDdLocTp1Items] = useState(null);
    const [ddLoc1Item, setDdLoc1Item] = useState(null);
    const [ddLoc1Items, setDdLoc1Items] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnLoclink.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnLoclink.endda || '99991231')))
    const [onoff, setOnoff] = useState(props.cmnLoclink.onoff == 1);
    const [hijerarhija, setHijerarhija] = useState(props.cmnLoclink.hijerarhija == 1);

    const calendarRef = useRef(null);
    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/loctp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;

                const loctpID = props.cmnLoclink.loctp1 == null ? props.cmnLoctpId : props.cmnLoclink.loctp1
                setCmnLoctp1Items(data);
                const _cmnLoctp1 = data.find((item) => item.id === loctpID) || null
                console.log(_cmnLoctp1,"####################################################################################", data)
                setCmnLoctp1Item(_cmnLoctp1);

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdLocTp1Items(dataDD);
                setDdLocTp1Item(dataDD.find((item) => item.code === loctpID) || null);
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
                //const tp = cmnLoclink.loctp1 || -1
                const tp = cmnLoclink.loctp1 == null ? props.cmnLoctpId : cmnLoclink.loctp1
                const url = `${env.CMN_BACK_URL}/cmn/x/loc/getall/tp/${tp}/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };
                const response = await axios.get(url, { headers });
                const data = response.data.item;
                setCmnLoc1Items(data);
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdLoc1Items(dataDD);
                setDdLoc1Item(dataDD.find((item) => item.code === props.cmnLoclink.loc1) || null);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [cmnLoclink.loctp1, props.cmnLoctpId]);
    // Autocomplit>

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            setSubmitted(true);
            cmnLoclink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLoclink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const cmnLoclinkService = new CmnLoclinkService();
            const data = await cmnLoclinkService.postCmnLoclink(cmnLoclink);
            cmnLoclink.id = data
            props.handleDialogClose({ obj: cmnLoclink, loclinkTip: props.loclinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLoclink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            setSubmitted(true);
            cmnLoclink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLoclink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const cmnLoclinkService = new CmnLoclinkService();
            const data = await cmnLoclinkService.postCmnLoclink(cmnLoclink);
            cmnLoclink.id = data;

            // Očisti cmnLoclink.id i cmnLoclink.loc1
            const newCmnLoclink = { ...cmnLoclink, id: null, loc1: null };
            setDdLoc1Item(null)

            props.handleDialogClose({ obj: newCmnLoclink, loclinkTip: props.loclinkTip });
            // Ne postavljaj setVisible(false) kako bi ostao otvoren za dodavanje novog unosa
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLoclink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {


            cmnLoclink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLoclink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnLoclinkService = new CmnLoclinkService();

            await cmnLoclinkService.putCmnLoclink(cmnLoclink);
            props.handleDialogClose({ obj: cmnLoclink, loclinkTip: props.loclinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLoclink ",
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
            const cmnLoclinkService = new CmnLoclinkService();
            await cmnLoclinkService.deleteCmnLoclink(cmnLoclink);
            props.handleDialogClose({ obj: cmnLoclink, loclinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLoclink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            let foundItem = null
            val = (e.target && e.target.value && e.target.value.code) || '';
            switch (name) {
                case "loctp1":
                    setDdLocTp1Item(e.value);
                    foundItem = cmnLoctp1Items.find((item) => item.id === val);
                    setCmnLoctp1Item(foundItem || null);
                    cmnLoclink.cloctp1 = foundItem.code
                    cmnLoclink.nloctp1 = e.value.name
                    break;
                case "loc1":
                    setDdLoc1Item(e.value);
                    foundItem = cmnLoc1Items.find((item) => item.id === val);
                    setCmnLoc1Item(foundItem || null);
                    cmnLoclink.cloc1 = foundItem.code
                    cmnLoclink.nloc1 = e.value.name
                    cmnLoclink.cloctp1 = cmnLoclink.cloctp1||props.loctpCode
                    cmnLoclink.nloctp1 = cmnLoclink.nloctp1||cmnLoctpItem.text
                    
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
                    cmnLoclink.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    cmnLoclink.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else if (type === "inputSwitch") {
            val = (e.target && e.target.value) ? 1 : 0
            switch (name) {
                case "onoff":
                    setOnoff(e.value)
                    break;
                case "hijerarhija":
                    setHijerarhija(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnLoclink = { ...cmnLoclink };
        _cmnLoclink[`${name}`] = val;
        console.log(_cmnLoclink, "--------------------------------------------------------")
        setCmnLoclink(_cmnLoclink);
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
                                value={props.cmnLoc.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="textx"
                                value={props.cmnLoc.textx}
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
                            <label htmlFor="loctp1">{translations[selectedLanguage].LoctpText} *</label>
                            <Dropdown id="loctp1"
                                value={ddLocTp1Item}
                                options={ddLocTp1Items}
                                onChange={(e) => onInputChange(e, "options", 'loctp1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLoclink.loctp1 })}
                            />
                            {submitted && !cmnLoclink.loctp1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="loc1">{translations[selectedLanguage].LocText} *</label>
                            <Dropdown id="loc1"
                                value={ddLoc1Item}
                                options={ddLoc1Items}
                                onChange={(e) => onInputChange(e, "options", 'loc1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLoclink.loc1 })}
                            />
                            {submitted && !cmnLoclink.loc1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].On_off}</label>
                                <InputSwitch inputId="onoff" checked={onoff} onChange={(e) => onInputChange(e, "inputSwitch", 'onoff')} />
                            </div>
                        </div>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roll">{translations[selectedLanguage].Hijerarhija}</label>
                                <InputSwitch inputId="hijerarhija" checked={hijerarhija} onChange={(e) => onInputChange(e, "inputSwitch", 'hijerarhija')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="val">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="val"
                                value={cmnLoclink.val} onChange={(e) => onInputChange(e, "text", 'val')}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-7">
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
                            <div className="field col-12 md:col-7">
                                <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                                <Calendar
                                    value={endda}
                                    onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                    showIcon
                                    dateFormat="dd.mm.yy"
                                />
                            </div>
                        </div>
                        <div className="field col-12 md:col-1">
                        <div className="flex-2 flex flex-column align-items-left">
                            <label htmlFor="color">{translations[selectedLanguage].color}</label>
                            <ColorPicker format="hex" id="color" value={cmnLoclink.color} onChange={(e) => onInputChange(e, 'text', 'color')} />
                        </div>

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
                            {(props.loclinkTip === 'CREATE') ? (
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
                            {(props.loclinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.loclinkTip !== 'CREATE') ? (
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
                inCmnLoclink="delete"
                item={cmnLoclink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnLoclink;
