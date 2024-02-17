import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { KkDocService } from "../../service/model/KkDocService";
import { TicFunctionService } from "../../service/model/TicFunctionService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import CmnParL from './remoteComponentContainer';
import env from "../../configs/env"

const KkDoc = (props) => {
    console.log("***********************************", `${env.DOMEN}?endpoint=parlend&sl=sr_cyr`, "***********************************", props)
    const objName = "tic_docs"
    const objDelivery = "tic_docdelivery"
    const domen = env.DOMEN
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const emptyTicEvents = EmptyEntities[objName]
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


    async function fetchPar() {
        try {
            const ticDocService = new KkDocService();
            const data = await ticDocService.getCmnParById(ticDoc.usr);
            console.log(ticDoc.usr, "*-*-*************getCmnParById*************-*", data)
            return data;
        } catch (error) {
            console.error(error);
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

    const handleParLClick = async () => {
        try {
            setCmnParLDialog()
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
            const ticDocService = new KkDocService();
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
            const ticDocService = new KkDocService();
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
            const ticDocService = new KkDocService();
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

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticDocService = new KkDocService();
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
            if  (type === "Calendar") {
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
    // <--- Dialog
    const setCmnParLDialog = () => {
        setCmnParLVisible(true)
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
                    </div>
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
                        <div className="field col-12 md:col-2">
                            <label htmlFor="tm">{translations[selectedLanguage].tm}</label>
                            <InputText
                                id="tm"
                                value={tm}
                                disabled={true}
                            />
                        </div>

                        <div className="field col-12 md:col-12">
                            <label htmlFor="napomena">{translations[selectedLanguage].napomena}</label>
                            <InputText
                                id="napomena"
                                value={ticDoc.napomena} onChange={(e) => onInputChange(e, "text", 'napomena')}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
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
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={ticDoc.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
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
        </div>
    );
};

export default KkDoc;
