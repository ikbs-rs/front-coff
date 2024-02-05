import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicDocService } from "../../service/model/TicDocService";
import { TicDocdeliveryService } from "../../service/model/TicDocdeliveryService";
import { TicFunctionService } from "../../service/model/TicFunctionService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"
import TicDocsL from './ticDocsL';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
//import CmnParL from './cmnParL';
import CmnParL from './remoteComponentContainer';
import CmnPar from './remoteComponentContainer';
import TicDocpaymentL from './ticDocpaymentL';
import TicDocdelivery from './ticDocdelivery';
import env from "../../configs/env"

const TicDoc = (props) => {
    console.log("***********************************", `${env.DOMEN}?endpoint=parlend&sl=sr_cyr`, "***********************************", props)
    const objName = "tic_docs"
    const objDelivery = "tic_docdelivery"
    const domen = env.DOMEN
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvents = EmptyEntities[objName]
    const emptyTicDelivery = EmptyEntities[objDelivery]
    emptyTicDelivery.doc = props.ticDoc.id
    const [showMyComponent, setShowMyComponent] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticDoc, setTicDoc] = useState(props.ticDoc);
    const [ticDocs, setTicDocs] = useState(props.ticDocs);
    const [submitted, setSubmitted] = useState(false);
    const [visible, setVisible] = useState(false);

    const [ddCmnCurrItem, setDdCmnCurrItem] = useState(null);
    const [ddCmnCurrItems, setDdCmnCurrItems] = useState(null);
    const [cmnCurrItem, setCmnCurrItem] = useState(null);
    const [cmnCurrItems, setCmnCurrItems] = useState(null);
    const [cmnParLVisible, setCmnParLVisible] = useState(false);
    const [cmnPar, setCmnPar] = useState(null);
    const [cmnParVisible, setCmnParVisible] = useState(false);
    const [ticPaymentLVisible, setTicPaymentLVisible] = useState(false);
    const [ticPayment, setTicPayment] = useState(null);
    const [ticDocdeliveryVisible, setTicDocdeliveryVisible] = useState(false);
    const [ticDocdelivery, setTicDocdelivery] = useState(emptyTicDelivery);


    const [date, setDate] = useState(new Date(DateFunction.formatJsDate(props.ticDoc.date || DateFunction.currDate())));
    const [tm, setTm] = useState(DateFunction.formatDatetime(props.ticDoc.tm || DateFunction.currDatetime()));

    const [docTip, setDocTip] = useState(props.docTip);
    const [docdeliveryTip, setDocdeliveryTip] = useState(props.docTip);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Active}`, code: '1' },
        { name: `${translations[selectedLanguage].Inactive}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticDoc.status));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocService = new TicDocService();
                const data = await ticDocService.getCmnCurrs();

                setCmnCurrItems(data)
                //console.log("******************", cmnCurrItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnCurrItems(dataDD);
                setDdCmnCurrItem(dataDD.find((item) => item.code === props.ticDoc.curr) || null);
                if (props.ticDoc.curr) {
                    const foundItem = data.find((item) => item.id === props.ticDoc.curr);
                    setCmnCurrItem(foundItem || null);
                    ticDoc.ccurr = foundItem.code
                    ticDoc.ncurr = foundItem.textx
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
                //console.log(props.ticDoc, "999999999999999999999999999999999999999")
                let _ticDoc = { ...ticDoc }
                const ticFunctionService = new TicFunctionService();
                const data = await ticFunctionService.getParpopust(props.ticDoc.usr);
                _ticDoc.parpopust = data.value || 0

                setTicDoc(_ticDoc)
                //console.log(data.value, "Rezultat getParpopust", props.ticDoc.usr, " ********************:", _ticDoc);
                setShowMyComponent(true)
                // Ovde možete da obradite rezultat dobijen iz getParpopust funkcije
                //console.log(data, "Rezultat getParpopust:", ticDoc);
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);


    async function fetchPar() {
        try {
            const ticDocService = new TicDocService();
            const data = await ticDocService.getCmnParById(ticDoc.usr);
            console.log(ticDoc.usr, "*-*-*************getCmnParById*************-*", data)
            return data;
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }
    async function fetchDocdelivery() {
        try {
            const ticDocService = new TicDocService();
            const data = await ticDocService.getTicListaByItem('docdelivery', 'listabynum', 'tic_docdelivery_v', 'aa.doc', ticDoc.id);
            //console.log(ticDoc.usr, "*-*-*************getCmnParById*************-*", data)
            return data;
        } catch (error) {
            console.error(error);
            // Obrada greške ako je potrebna
        }
    }

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };
    }

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleParBlur = async (parValue) => {
        try {
            const ticFunctionService = new TicFunctionService();
            const data = await ticFunctionService.getParpopust(parValue);
            ticDoc.parpopust = data.value
            // Ovde možete da obradite rezultat dobijen iz getParpopust funkcije
            console.log("Rezultat getParpopust:", data);
        } catch (error) {
            console.error("Greška pri pozivanju getParpopust funkcije:", error);
        }
    };

    const handleParLClick = async () => {
        try {
            // const cmnParCode = ticDoc.cpar; // Pretpostavljamo da je ovde kod za cmnPar
            // const ticDocService = new TicDocService();
            // const cmnParData = await ticDocService.getCmnPar(cmnParCode);
            setCmnParLDialog()
            // setCmnPar(cmnParData);
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch cmnPar data",
                life: 3000,
            });
        }
    };

    const handleParClick = async () => {
        try {
            // const cmnParCode = ticDoc.cpar; // Pretpostavljamo da je ovde kod za cmnPar
            // const ticDocService = new TicDocService();
            // const cmnParData = await ticDocService.getCmnPar(cmnParCode);
            setCmnParDialog()
            // setCmnPar(cmnParData);
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch cmnPar data",
                life: 3000,
            });
        }
    };
    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticDoc.date = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(date));
            ticDoc.tm = DateFunction.formatDateTimeToDBFormat(tm);
            const ticDocService = new TicDocService();
            const data = await ticDocService.postTicDoc(ticDoc);
            ticDoc.id = data.id
            ticDoc.broj = data.broj
            setTicDoc({ ...ticDoc });
            props.handleDialogClose({ obj: ticDoc, docTip: props.docTip });
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

    const handleNextClick = async (event) => {
        try {
            setSubmitted(true);
            ticDoc.date = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(date));
            ticDoc.tm = DateFunction.formatDateTimeToDBFormat(tm);
            const ticDocService = new TicDocService();
            if (event == 'CREATE') {
                const data = await ticDocService.postTicDoc(ticDoc);
                ticDoc.id = data.id
                ticDoc.broj = data.broj
                setTicDoc({ ...ticDoc });                
                props.handleDialogClose({ obj: ticDoc, docTip: props.docTip });
            } else {
                await ticDocService.putTicDoc(ticDoc);
            }
            setDocTip('UPDATE');
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
            ticDoc.date = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(date));
            ticDoc.tm = DateFunction.formatDateTimeToDBFormat(tm);
            const ticDocService = new TicDocService();
            await ticDocService.putTicDoc(ticDoc);
            props.handleDialogClose({ obj: ticDoc, docTip: props.docTip });
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

    const handlePaymentClick = async (e) => {
        try {
            setTicPaymentLVisible(true);
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch cmnPar data",
                life: 3000,
            });
        }
    };

    const handleDocdeliveryClick = async (e) => {
        try {
            const rowPar = await fetchPar()
            setCmnPar(rowPar.item)
            const rowDocdelivery = await fetchDocdelivery()
            console.log(rowPar, "***************rowDocdelivery************rowPar****", rowDocdelivery)
            if (rowDocdelivery && rowDocdelivery.length > 0) {
                setDocdeliveryTip("UPDATE");
                setTicDocdelivery(rowDocdelivery[0])
            } else {
                setDocdeliveryTip("CREATE");
            }
            setTicDocdeliveryVisible(true);
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to fetch cmnPar data",
                life: 3000,
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticDocService = new TicDocService();
            await ticDocService.deleteTicDoc(ticDoc);
            props.handleDialogClose({ obj: ticDoc, docTip: 'DELETE' });
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
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "curr") {
                setDdCmnCurrItem(e.value);
                const foundItem = cmnCurrItems.find((item) => item.id === val);
                setCmnCurrItem(foundItem || null);
                ticDoc.ncurr = e.value.name
                ticDoc.ccurr = foundItem.code
            } else if (type === "Calendar") {
                const dateVal = DateFunction.dateGetValue(e.value)
                val = (e.target && e.target.value) || '';
                switch (name) {
                    case "date":
                        setDate(e.value)
                        ticDoc.date = DateFunction.formatDateToDBFormat(dateVal)
                        break;
                    default:
                        console.error("Pogresan naziv polja")
                }
            } else {
                setDropdownItem(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticDoc = { ...ticDoc };
        _ticDoc[`${name}`] = val;
        if (name === `textx`) _ticDoc[`text`] = val

        setTicDoc(_ticDoc);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };


    const handleCmnParLDialogClose = async (newObj) => {
        if (newObj?.id) {
            setCmnPar(newObj);
            let _ticDoc = { ...ticDoc }
            _ticDoc.usr = newObj.id
            _ticDoc.npar = newObj.text
            _ticDoc.cpar = newObj.code

            const ticFunctionService = new TicFunctionService();
            const data = await ticFunctionService.getParpopust(newObj.id);
            _ticDoc.parpopust = data.value || 0

            setTicDoc(_ticDoc)
            // Ovde možete da obradite rezultat dobijen iz getParpopust funkcije
            console.log("Rezultat getParpopust:", data);
        }
        setCmnParLVisible(false)
    };

    const handleCmnParDialogClose = (newObj) => {
        setCmnPar(newObj);
        setCmnParVisible(false)
    };
    const handleTicPaymentLDialogClose = (newObj) => {
        setTicPayment(newObj);
        setTicPaymentLVisible(false)
    };
    const handleTicDocdeliveryDialogClose = (newObj) => {
        setTicDocdelivery(newObj);
        setTicDocdeliveryVisible(false)
    };
    // <--- Dialog
    const setCmnParLDialog = () => {
        setCmnParLVisible(true)
    }

    const setCmnParDialog = () => {
        setCmnParVisible(true)
    }

    const setTicPaymentLDialog = () => {
        setTicPaymentLVisible(true)
    }
    const setTicDocdeliveryDialog = () => {
        setTicDocdeliveryVisible(true)
    }
    //  Dialog --->
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="text">{translations[selectedLanguage].docvr}</label>
                            <InputText
                                id="text"
                                value={props.ticDocvr.text}
                                disabled={true}
                            />
                        </div>
                        {/* <div className="field col-12 md:col-4">
                            <label htmlFor="ndocobj">{translations[selectedLanguage].ndocobj}</label>
                            <InputText
                                id="ndocobj"
                                value={props.ticDocobj.text}
                                disabled={true}
                            />
                        </div> */}
                        <div className="field col-12 md:col-1">
                            <label htmlFor="year">{translations[selectedLanguage].year} *</label>
                            <InputText id="year"
                                value={ticDoc.year} onChange={(e) => onInputChange(e, "text", 'year')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDoc.year })}
                            />
                            {submitted && !ticDoc.year && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="broj">{translations[selectedLanguage].broj} *</label>
                            <InputText id="broj"
                                value={ticDoc.broj} onChange={(e) => onInputChange(e, "text", 'broj')}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-1">
                            <label htmlFor="storno">{translations[selectedLanguage].storno}</label>
                            <InputText
                                id="text"
                                value={props.ticDoc.storno}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="date">{translations[selectedLanguage].date} *</label>
                            <Calendar
                                value={date}
                                onChange={(e) => onInputChange(e, "Calendar", 'date', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                    </div>
                    {/** 
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                */}
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="cpar">{translations[selectedLanguage].cpar} *</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cpar" autoFocus
                                    value={ticDoc.cpar} onChange={(e) => onInputChange(e, "text", 'cpar')}
                                    //onBlur={() => handleParBlur(ticDoc.par)}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !ticDoc.cpar })}
                                />
                                <Button icon="pi pi-search" onClick={handleParLClick} className="p-button" />
                                <Button icon="pi pi-search" onClick={handleParClick} className="p-button-success" />
                            </div>
                            {submitted && !ticDoc.cpar && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="npar">{translations[selectedLanguage].npar}</label>
                            <InputText
                                id="npar"
                                value={props.ticDoc.npar}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="curr">{translations[selectedLanguage].curr} *</label>
                            <Dropdown id="curr"
                                value={ddCmnCurrItem}
                                options={ddCmnCurrItems}
                                onChange={(e) => onInputChange(e, "options", 'curr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDoc.curr })}
                            />
                            {submitted && !ticDoc.curr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="currrate">{translations[selectedLanguage].currrate} *</label>
                            <InputText
                                id="currrate"
                                value={ticDoc.currrate} onChange={(e) => onInputChange(e, "text", 'currrate')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDoc.currrate })}
                            />
                            {submitted && !ticDoc.currrate && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="status">{translations[selectedLanguage].status} *</label>
                            <Dropdown id="status"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'status')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDoc.status })}
                            />
                            {submitted && !ticDoc.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="tm">{translations[selectedLanguage].tm}</label>
                            <InputText
                                id="tm"
                                value={tm}
                                disabled={true}
                            />
                        </div>

                        <div className="field col-12 md:col-12">
                            <label htmlFor="opis">{translations[selectedLanguage].opis}</label>
                            <InputText
                                id="opis"
                                value={ticDoc.opis} onChange={(e) => onInputChange(e, "text", 'opis')}
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
                            {(docTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(docTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(docTip !== 'CREATE') ? (
                                <>
                                    <Button
                                        label={translations[selectedLanguage].Save}
                                        icon="pi pi-check"
                                        onClick={handleSaveClick}
                                        severity="success"
                                        outlined
                                    />
                                    <Button
                                        label={translations[selectedLanguage].Payment}
                                        icon="pi pi-check"
                                        className="p-button-warning"
                                        onClick={handlePaymentClick}
                                        severity="success"
                                        outlined
                                    />
                                    <Button
                                        label={translations[selectedLanguage].Delivery}
                                        icon="pi pi-check"
                                        className="p-button-warning"
                                        onClick={handleDocdeliveryClick}
                                        severity="success"
                                        outlined
                                    />
                                </>
                            ) : null}
                            {(docTip == 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].CreateSt}
                                    icon="pi pi-check"
                                    onClick={() => handleNextClick('CREATE')}
                                    severity="success"
                                    outlined
                                />
                            ) : (
                                <Button
                                    label={translations[selectedLanguage].SaveSt}
                                    icon="pi pi-check"
                                    onClick={() => handleNextClick('UPDATE')}
                                    severity="success"
                                    outlined
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-grow-1">

                    {showMyComponent && (
                        <TicDocsL
                            parameter={"inputTextValue"}
                            ticDoc={ticDoc}
                            ticDocs={ticDocs}
                            //updateEventsTip={updateEventsTip}
                            ////handleDialogClose={handleDialogClose}
                            setVisible={true}
                            dialog={false}
                            docTip={props.docTip}
                        />
                    )}
                </div>

            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={ticDoc.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
            {/*
            <Dialog
                header={translations[selectedLanguage].ParList}
                visible={cmnParLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setCmnParLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnParLVisible && (
                    <CmnParL
                        parameter={"inputTextValue"}
                        cmnPar={cmnPar}
                        handleCmnParLDialogClose={handleCmnParLDialogClose}
                        setCmnParLVisible={setCmnParLVisible}
                        dialog={true}
                        lookUp={true}
                    />
                )}
            </Dialog>
            */}
            <Dialog
                header={translations[selectedLanguage].ParList}
                visible={cmnParLVisible}
                style={{ width: '90%', height: '1300px' }}
                onHide={() => {
                    setCmnParLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnParLVisible && (
                    <CmnParL
                        remoteUrl={`${env.CMN_URL}?endpoint=parlend&sl=sr_cyr`}
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, ticDoc: ticDoc, parentOrigin: `${domen}` }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleCmnParLDialogClose}
                        originUrl={`${domen}`}
                    />
                )}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].Par}
                visible={cmnParVisible}
                style={{ width: '90%', height: '1100px' }}
                onHide={() => {
                    setCmnParVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {cmnParVisible && (
                    <CmnPar
                        remoteUrl={`${env.CMN_URL}?endpoint=parend&objid=${ticDoc.usr}&sl=sr_cyr`}
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, ticDoc: ticDoc, parentOrigin: `${domen}` }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleCmnParDialogClose}
                        originUrl={`${domen}`}
                    />
                )}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].PaymentList}
                visible={ticPaymentLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicPaymentLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticPaymentLVisible && (
                    <TicDocpaymentL
                        parameter={"inputTextValue"}
                        ticDoc={ticDoc}
                        handleTicPaymentLDialogClose={handleTicPaymentLDialogClose}
                        setTicPaymentLVisible={setTicPaymentLVisible}
                        dialog={true}
                        lookUp={true}
                    />
                )}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].Docdelivery}
                visible={ticDocdeliveryVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicDocdeliveryVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticDocdeliveryVisible && (
                    <TicDocdelivery
                        parameter={"inputTextValue"}
                        ticDoc={ticDoc}
                        cmnPar={cmnPar}
                        docdeliveryTip={docdeliveryTip}
                        ticDocdelivery={ticDocdelivery}
                        handleDialogClose={handleDialogClose}
                        handleTicDocdeliveryDialogClose={handleTicDocdeliveryDialogClose}
                        setTicDocdeliveryVisible={setTicDocdeliveryVisible}
                        dialog={true}
                        lookUp={true}
                        setVisible={setVisible}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default TicDoc;
