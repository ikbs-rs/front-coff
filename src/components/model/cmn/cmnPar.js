import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnParService } from "../../../service/model/cmn/CmnParService";
import { CmnPartpService } from "../../../service/model/cmn/CmnPartpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../../dialog/DeleteDialog';
import { translations } from "../../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../../utilities/DateFunction";
import env from '../../../configs/env';

const CmnPar = (props) => {
    //console.log(props, "*-*-*-*-*-*-*-*****CmnPar-*-*-*-*-*-*-*-*-*-*-*-*-*-*")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnPar, setCmnPar] = useState(props.cmnPar);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnParItem, setDdCmnParItem] = useState(null);
    const [ddCmnParItems, setDdCmnParItems] = useState(null);
    const [cmnParItem, setCmnParItem] = useState(null);
    const [cmnParItems, setCmnParItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnPar.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate('99991231' || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnPartpService = new CmnPartpService();
                const data = await cmnPartpService.getCmnPartps();

                setCmnParItems(data)
                //console.log("******************", cmnParItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnParItems(dataDD);
                setDdCmnParItem(dataDD.find((item) => item.code === props.cmnPar.tp) || null);
                if (props.cmnPar.tp) {
                    const foundItem = data.find((item) => item.id === props.cmnPar.tp);
                    setCmnParItem(foundItem || null);
                    cmnPar.ctp = foundItem.code
                    cmnPar.ntp = foundItem.textx
                }

            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

    // const handleCancelClick = () => {
    //     props.setVisible(false);
    // };
    const handleCancelClick = () => {
        if (props.remote) {
            const dataToSend = { type: 'dataFromIframe', visible: false };
            sendToParent(dataToSend);
        } else {
            props.setVisible(false);
        }
    };
    const sendToParent = (data) => {
        const parentOrigin = `${env.DOMEN}`; // Promenite ovo na stvarni izvor roditeljskog dokumenta
        window.parent.postMessage(data, parentOrigin);
    }
    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            cmnPar.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnPar.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnParService = new CmnParService();
            const data = await cmnParService.postCmnPar(cmnPar);
            cmnPar.id = data
            if (cmnPar.code === null || cmnPar.code === "") {
                cmnPar.code = cmnPar.id;
            }
            props.handleDialogClose({ obj: cmnPar, parTip: props.parTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnPar.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnPar.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnParService = new CmnParService();

            await cmnParService.putCmnPar(cmnPar);
            props.handleDialogClose({ obj: cmnPar, parTip: props.parTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
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
            const cmnParService = new CmnParService();
            await cmnParService.deleteCmnPar(cmnPar);
            props.handleDialogClose({ obj: cmnPar, parTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnPar ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnParItem(e.value);
            const foundItem = cmnParItems.find((item) => item.id === val);
            setCmnParItem(foundItem || null);
            cmnPar.ntp = e.value.name
            cmnPar.ctp = foundItem.code
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnPar.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
            console.log(val, "*******************", e.target)
        }
        let _cmnPar = { ...cmnPar };
        _cmnPar[`${name}`] = val;
        setCmnPar(_cmnPar);
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
                                value={cmnPar.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnPar.code })}
                            />
                            {submitted && !cmnPar.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={cmnPar.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !cmnPar.text })}
                            />
                            {submitted && !cmnPar.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddCmnParItem}
                                options={ddCmnParItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnPar.tp })}
                            />
                            {submitted && !cmnPar.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>


                        <div className="field col-12 md:col-8">
                            <label htmlFor="short">{translations[selectedLanguage].short}</label>
                            <InputText
                                id="short"
                                value={cmnPar.short} onChange={(e) => onInputChange(e, "text", 'short')}
                            />
                        </div>

                        <div className="field col-12 md:col-7">
                            <label htmlFor="address">{translations[selectedLanguage].address}</label>
                            <InputText
                                id="address"
                                value={cmnPar.address} onChange={(e) => onInputChange(e, "text", 'address')}
                            />

                        </div>

                        <div className="field col-12 md:col-5">
                            <label htmlFor="place">{translations[selectedLanguage].place}</label>
                            <InputText
                                id="place"
                                value={cmnPar.place} onChange={(e) => onInputChange(e, "text", 'place')}
                            />
                        </div>


                        <div className="field col-12 md:col-4">
                            <label htmlFor="postcode">{translations[selectedLanguage].postcode}</label>
                            <InputText
                                id="postcode"
                                value={cmnPar.postcode} onChange={(e) => onInputChange(e, "text", 'postcode')}
                            />
                        </div>
                        <div className="field col-12 md:col-8">
                            <label htmlFor="tel">{translations[selectedLanguage].tel}</label>
                            <InputText
                                id="tel"
                                value={cmnPar.tel} onChange={(e) => onInputChange(e, "text", 'tel')}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="activity">{translations[selectedLanguage].activity}</label>
                            <InputText
                                id="activity"
                                value={cmnPar.activity} onChange={(e) => onInputChange(e, "text", 'activity')}
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="pib">{translations[selectedLanguage].pib}</label>
                            <InputText
                                id="pib"
                                value={cmnPar.pib} onChange={(e) => onInputChange(e, "text", 'pib')}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="idnum">{translations[selectedLanguage].idnum}</label>
                            <InputText
                                id="idnum"
                                value={cmnPar.idnum} onChange={(e) => onInputChange(e, "text", 'idnum')}
                            />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="pdvnum">{translations[selectedLanguage].pdvnum}</label>
                            <InputText
                                id="pdvnum"
                                value={cmnPar.pdvnum} onChange={(e) => onInputChange(e, "text", 'pdvnum')}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar
                                value={begda}
                                onChange={(e) => onInputChange(e, "Calendar", 'begda', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="endda">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">

                        <Button
                            label={translations[selectedLanguage].Cancel}
                            icon="pi pi-times"
                            className="p-button-outlined p-button-secondary"
                            onClick={handleCancelClick}
                            outlined
                        />

                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.parTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.parTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.parTip !== 'CREATE') ? (
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
                inCmnPar="delete"
                item={cmnPar.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnPar;
