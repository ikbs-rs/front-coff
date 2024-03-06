import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffDocService } from "../../service/model/CoffDocService";
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
import CoffDocsL from './coffDocsorderL';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
//import CmnParL from './cmnParL';
import CmnParL from './remoteComponentContainer';
import CmnPar from './remoteComponentContainer';
import env from "../../configs/env"

const CoffDocorder = (props) => {
    console.log("**********************************************************************", props)
    const objName = "tic_docs"

    const domen = env.DOMEN
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvents = EmptyEntities[objName]
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [coffDoc, setCoffDoc] = useState('');
    const [coffDocs, setCoffDocs] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [visible, setVisible] = useState(false);


    const [cmnParLVisible, setCmnParLVisible] = useState(false);
    const [cmnPar, setCmnPar] = useState(null);
    const [cmnParVisible, setCmnParVisible] = useState(false);

    //const [date, setDate] = useState(new Date(DateFunction.formatJsDate(props.coffDoc.date || DateFunction.currDate())));
    const [vreme, setVreme] = useState(DateFunction.formatDatetime( DateFunction.currDatetime()));

    const [docTip, setDocTip] = useState('CREATE');

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Active}`, code: '1' },
        { name: `${translations[selectedLanguage].Inactive}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(coffDoc.status));
    }, []);



    async function fetchPar() {
        try {
            const coffDocService = new CoffDocService();
            const data = await coffDocService.getCmnParById(coffDoc.usr);
            console.log(coffDoc.usr, "*-*-*************getCmnParById*************-*", data)
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
            coffDoc.parpopust = data.value
            // Ovde možete da obradite rezultat dobijen iz getParpopust funkcije
            console.log("Rezultat getParpopust:", data);
        } catch (error) {
            console.error("Greška pri pozivanju getParpopust funkcije:", error);
        }
    };

    const handleParLClick = async () => {
        try {
            // const cmnParCode = coffDoc.cpar; // Pretpostavljamo da je ovde kod za cmnPar
            // const coffDocService = new CoffDocService();
            // const cmnParData = await coffDocService.getCmnPar(cmnParCode);
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
            // const cmnParCode = coffDoc.cpar; // Pretpostavljamo da je ovde kod za cmnPar
            // const coffDocService = new CoffDocService();
            // const cmnParData = await coffDocService.getCmnPar(cmnParCode);
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
            coffDoc.vreme = DateFunction.formatDateTimeToDBFormat(vreme);
            const coffDocService = new CoffDocService();
            const data = await coffDocService.postCoffDoc(coffDoc);
            coffDoc.id = data.id
            coffDoc.broj = data.broj
            setCoffDoc({ ...coffDoc });
            props.handleDialogClose({ obj: coffDoc, docTip: props.docTip });
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
            coffDoc.vreme = DateFunction.formatDateTimeToDBFormat(vreme);
            const coffDocService = new CoffDocService();
            if (event == 'CREATE') {
                const data = await coffDocService.postCoffDoc(coffDoc);
                coffDoc.id = data.id
                coffDoc.broj = data.broj
                setCoffDoc({ ...coffDoc });                
                props.handleDialogClose({ obj: coffDoc, docTip: props.docTip });
            } else {
                await coffDocService.putCoffDoc(coffDoc);
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
            coffDoc.vreme = DateFunction.formatDateTimeToDBFormat(vreme);
            const coffDocService = new CoffDocService();
            await coffDocService.putCoffDoc(coffDoc);
            props.handleDialogClose({ obj: coffDoc, docTip: props.docTip });
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
            const coffDocService = new CoffDocService();
            await coffDocService.deleteCoffDoc(coffDoc);
            props.handleDialogClose({ obj: coffDoc, docTip: 'DELETE' });
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
            if  (type === "Calendar") {
                const dateVal = DateFunction.dateGetValue(e.value)
                val = (e.target && e.target.value) || '';
                switch (name) {
                    case "date":
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

        let _coffDoc = { ...coffDoc };
        _coffDoc[`${name}`] = val;
        if (name === `textx`) _coffDoc[`text`] = val

        setCoffDoc(_coffDoc);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };


    const handleCmnParLDialogClose = async (newObj) => {
        if (newObj?.id) {
            setCmnPar(newObj);
            let _coffDoc = { ...coffDoc }
            _coffDoc.usr = newObj.id
            _coffDoc.npar = newObj.text
            _coffDoc.cpar = newObj.code

            const ticFunctionService = new TicFunctionService();
            const data = await ticFunctionService.getParpopust(newObj.id);
            _coffDoc.parpopust = data.value || 0

            setCoffDoc(_coffDoc)
            // Ovde možete da obradite rezultat dobijen iz getParpopust funkcije
            console.log("Rezultat getParpopust:", data);
        }
        setCmnParLVisible(false)
    };

    const handleCmnParDialogClose = (newObj) => {
        setCmnPar(newObj);
        setCmnParVisible(false)
    };
    // <--- Dialog
    const setCmnParLDialog = () => {
        setCmnParLVisible(true)
    }

    const setCmnParDialog = () => {
        setCmnParVisible(true)
    }
    //  Dialog --->
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">

                    <div className="p-fluid formgrid grid">
                        {/* <div className="field col-12 md:col-4">
                            <label htmlFor="cpar">{translations[selectedLanguage].cpar} *</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cpar" autoFocus
                                    value={coffDoc.cpar} onChange={(e) => onInputChange(e, "text", 'cpar')}
                                    //onBlur={() => handleParBlur(coffDoc.par)}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !coffDoc.cpar })}
                                />
                                <Button icon="pi pi-search" onClick={handleParLClick} className="p-button" />
                                <Button icon="pi pi-search" onClick={handleParClick} className="p-button-success" />
                            </div>
                            {submitted && !coffDoc.cpar && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div> */}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="npar">{translations[selectedLanguage].npar}</label>
                            <InputText
                                id="npar"
                                value={coffDoc.npar}
                                disabled={true}
                            />
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
                                className={classNames({ 'p-invalid': submitted && !coffDoc.status })}
                            />
                            {submitted && !coffDoc.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        {/* <div className="field col-12 md:col-2">
                            <label htmlFor="vreme">{translations[selectedLanguage].vreme}</label>
                            <InputText
                                id="vreme"
                                value={vreme}
                                disabled={true}
                            />
                        </div> */}

                        <div className="field col-12 md:col-12">
                            <label htmlFor="opis">{translations[selectedLanguage].opis}</label>
                            <InputText
                                id="opis"
                                value={coffDoc.opis} onChange={(e) => onInputChange(e, "text", 'opis')}
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
                        {/* <div className="flex flex-wrap gap-1">
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
                        </div> */}
                    </div>
                </div>

                    {showMyComponent && (
                        <CoffDocsL
                            parameter={"inputTextValue"}
                            coffDoc={coffDoc}
                            coffDocs={coffDocs}
                            //updateEventsTip={updateEventsTip}
                            ////handleDialogClose={handleDialogClose}
                            setVisible={true}
                            dialog={false}
                            docTip={props.docTip}
                        />
                    )}


            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={coffDoc.text}
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
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, coffDoc: coffDoc, parentOrigin: `${domen}` }} // Dodajte ostale parametre po potrebi
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
                        remoteUrl={`${env.CMN_URL}?endpoint=parend&objid=${coffDoc.usr}&sl=sr_cyr`}
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, coffDoc: coffDoc, parentOrigin: `${domen}` }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleCmnParDialogClose}
                        originUrl={`${domen}`}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default CoffDocorder;
