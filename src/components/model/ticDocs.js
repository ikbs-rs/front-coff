import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicDocsService } from '../../service/model/TicDocsService';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from '../../configs/translations';
import DateFunction from '../../utilities/DateFunction';
import InputMask from 'react-input-mask';
import env from '../../configs/env';
import axios from 'axios';
import Token from '../../utilities/Token';
import { Dialog } from 'primereact/dialog';
//import TicArtL from './ticArtL';
import TicEventartL from './ticEventartL';
import TicArtW from './remoteComponentContainer';
import TicEventProdajaL from './ticEventProdajaL';
import CmnParL from './remoteComponentContainer';
import CmnPar from './remoteComponentContainer';
import { TicDocService } from "../../service/model/TicDocService";

const TicDocs = (props) => {
    console.log(props, "000000000000000000000000000000000000000000000000000000000")
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [ticDoc, setTicDoc] = useState(props.ticDoc);
    const [ticDocs, setTicDocs] = useState(props.ticDocs);
    const [submitted, setSubmitted] = useState(false);
    const [ddTpItem, setDdTpItem] = useState(1);
    const [ddTpItems, setDdTpItems] = useState(null);
    const [ticArtLVisible, setTicEventartLVisible] = useState(false);
    const [ticArtRemoteLVisible, setTicArtRemoteLVisible] = useState(false);
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticArt, setTicArt] = useState(null);

    const [ticEvent, setTicEvent] = useState(props.ticEvent);
    const [ticEventProdajaLVisible, setTicEventProdajaLVisible] = useState(false);
    const [cmnParLVisible, setCmnParLVisible] = useState(false);
    const [cmnPar, setCmnPar] = useState(null);
    const [cmnParVisible, setCmnParVisible] = useState(false);

    const [cmnCurrItem, setCmnCurrItem] = useState(null);
    const [cmnCurrItems, setCmnCurrItems] = useState(null);
    const [ddCmnCurrItem, setDdCmnCurrItem] = useState(null);
    const [ddCmnCurrItems, setDdCmnCurrItems] = useState(null);


    const [ticProdajaLVisible, setTicProdajaLVisible] = useState(false);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticDocs.status));
    }, []);

    useEffect(() => {
        let _ticDocs = { ...ticDocs };
        _ticDocs.discount = ticDoc.parpopust;
        _ticDocs.curr = ticDoc.curr;
        setTicDocs(_ticDocs);;
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/tgp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTpItems(dataDD);
                setDdTpItem(dataDD.find((item) => item.code === props.ticDocs.tg) || null);
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
                const ticDocService = new TicDocService();
                const data = await ticDocService.getCmnCurrs();

                setCmnCurrItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnCurrItems(dataDD);
                setDdCmnCurrItem(dataDD.find((item) => item.code === props.ticDoc.curr) || null);
                const foundItem = data.find((item) => item.id === props.ticDoc.curr);
                setCmnCurrItem(foundItem || null);
                ticDocs.ccurr = props.ticDoc.curr
                ticDocs.ccurr = foundItem.code
                ticDocs.ncurr = foundItem.textx
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    // Dodajte sledeći useEffect blok iznad povratne vrednosti komponente (ispod svih drugih useEffect blokova)
    useEffect(() => {
        // Ažurirajte vrednost polja potrazuje kada se promeni output, price ili discount
        const calculatePotrazuje = () => {
            const newPotrazuje = ticDocs.output * ticDocs.price * (1 - ticDocs.discount * 0.01);
            setTicDocs((prevTicDocs) => ({ ...prevTicDocs, potrazuje: newPotrazuje }));
        };

        // Pratite promene u poljima output, price i discount
        calculatePotrazuje();
    }, [ticDocs.output, ticDocs.price, ticDocs.discount]);


    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleArtClick = async (e, destination) => {
        try {
            if (destination === 'local') setTicArtDialog();
            else setTicArtRemoteDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch ticArt data',
                life: 3000
            });
        }
    };

    const handleEventProdajaClick = async (e, destination) => {
        try {
            setTicEventProdajaLDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch ticArt data',
                life: 3000
            });
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

    const setCmnParDialog = () => {
        setCmnParVisible(true)
    }

    const setCmnParLDialog = () => {
        setCmnParLVisible(true)
    }

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticDocs.begtm = DateFunction.convertTimeToDBFormat(ticDocs.begtm);
            ticDocs.endtm = DateFunction.convertTimeToDBFormat(ticDocs.endtm);
            const ticDocsService = new TicDocsService();
            const data = await ticDocsService.postTicDocs(ticDocs);
            ticDocs.id = data;
            props.handleDialogClose({ obj: ticDocs, docsTip: props.docsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                //detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            console.log('Preeeeeeee', ticDocs.begtm);
            ticDocs.begtm = DateFunction.convertTimeToDBFormat(ticDocs.begtm);
            ticDocs.endtm = DateFunction.convertTimeToDBFormat(ticDocs.endtm);
            console.log('Posleeeeeeeeee', ticDocs.begtm);
            const ticDocsService = new TicDocsService();
            await ticDocsService.putTicDocs(ticDocs);
            props.handleDialogClose({ obj: ticDocs, docsTip: props.docsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                // detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const ticDocsService = new TicDocsService();
            await ticDocsService.deleteTicDocs(ticDocs);
            props.handleDialogClose({ obj: ticDocs, docsTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = '';
        if (type === 'options') {
            if (name == 'tg') {
                setDdTpItem(e.value);
                ticDocs.ctp = e.value.code;
                ticDocs.ntp = e.value.name;
            } else {
                setDropdownItem(e.value);
            }
            val = (e.target && e.target.value && e.target.value.code) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticDocs = { ...ticDocs };
        _ticDocs[`${name}`] = val;
        if (name === `textx`) _ticDocs[`text`] = val;

        setTicDocs(_ticDocs);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    const handleTicEventProdajaLDialogClose = (newObj) => {
        setTicEvent(newObj);
        ticDocs.event = newObj.id;
        ticDocs.nevent = newObj.text;
        ticDocs.cevent = newObj.code;
        setTicEventProdajaLVisible(false);
    };


    const handleCmnParLDialogClose = (newObj) => {
        if (newObj?.id) {
            setCmnPar(newObj);
            ticDocs.usr = newObj.id
            ticDocs.npar = newObj.text
            ticDocs.cpar = newObj.code
        }
        setCmnParLVisible(false)
    };

    const handleCmnParDialogClose = (newObj) => {
        setCmnPar(newObj);
        setCmnParVisible(false)
    };

    const setTicArtDialog = (destination) => {
        
        if (ticEvent && ticEvent.id !== undefined && ticEvent.id !== null) {
            setTicEventartLVisible(true);
        } else {
            toast.current.show({
                severity: 'error',
                summary: 'Action ',
                detail: `Морате прво изабрати догађај`,
                life: 5000
            });
        }
    };

    const setTicArtRemoteDialog = () => {
        setTicArtRemoteLVisible(true);
    };

    const setTicEventProdajaLDialog = (destination) => {
        setTicEventProdajaLVisible(true);
    };

    const handleTicArtLDialogClose = (newObj) => {
        console.log(newObj, "111111111111111111111111111111111111111111111111111111111111111")
        setTicArt(newObj);
        ticDocs.art = newObj.art;
        ticDocs.nart = newObj.nart;
        ticDocs.cart = newObj.cart;
        ticDocs.price = newObj.price;
        ticDocs.loc = newObj.loc1;
        //ticDocs.potrazuje = newObj.cena * ticDocs.output;
        setTicEventartLVisible(false);
    };
    /*
    const handleTicArtRemoteLDialogClose = (newObj) => {
        //const localObj = { newObj };
        setTicArt(newObj.obj);
        ticDocs.art = newObj.obj.id;
        ticDocs.nart = newObj.obj.text;
        ticDocs.cart = newObj.obj.code;
    };
    */
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="cevent">{translations[selectedLanguage].cevent}</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cevent" autoFocus value={ticDocs.cevent}
                                    onChange={(e) => onInputChange(e, 'text', 'cevent')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !ticDocs.cevent })}
                                />
                                <Button icon="pi pi-search" onClick={(e) => handleEventProdajaClick(e)} className="p-button" />
                                {/*<Button icon="pi pi-search" onClick={(e) => handleArtClick(e, 'remote')} className="p-button-success" />*/}
                            </div>
                            {submitted && !ticDocs.cevent && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="nevent">{translations[selectedLanguage].nevent}</label>
                            <InputText id="nevent" value={ticDocs.nevent}
                                onChange={(e) => onInputChange(e, 'text', 'nevent')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDocs.nevent })}
                            />
                            {submitted && !ticDocs.nevent && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="cart">{translations[selectedLanguage].cart}</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cart" value={ticDocs.cart}
                                    onChange={(e) => onInputChange(e, 'text', 'cart')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !ticDocs.cart })} />
                                <Button icon="pi pi-search" onClick={(e) => handleArtClick(e, 'local')} className="p-button" />
                                {/*<Button icon="pi pi-search" onClick={(e) => handleArtClick(e, 'remote')} className="p-button-success" />*/}
                            </div>
                            {submitted && !ticDocs.cart && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="nart">{translations[selectedLanguage].nart}</label>
                            <InputText id="nart" value={ticDocs.nart} onChange={(e) => onInputChange(e, 'text', 'nart')} required className={classNames({ 'p-invalid': submitted && !ticDocs.nart })} />
                            {submitted && !ticDocs.nart && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        {/* <div className="field col-12 md:col-5">
                            <label htmlFor="tg">{translations[selectedLanguage].tg} *</label>
                            <Dropdown
                                id="tg"
                                value={ddTpItem}
                                options={ddTpItems}
                                onChange={(e) => onInputChange(e, 'options', 'tg')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocs.tg })}
                            />
                            {submitted && !ticDocs.tg && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="curr">{translations[selectedLanguage].curr} *</label>
                            <Dropdown
                                id="curr"
                                value={ddCmnCurrItem}
                                options={ddCmnCurrItems}
                                onChange={(e) => onInputChange(e, 'options', 'curr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocs.curr })}
                            />
                            {submitted && !ticDocs.curr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>  */}
                        <div className="field col-12 md:col-3">
                            <label htmlFor="price">{translations[selectedLanguage].price} *</label>
                            <InputText
                                id="price"
                                value={ticDocs.price}
                                onChange={(e) => onInputChange(e, 'text', 'price')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDocs.price })}
                            />
                            {submitted && !ticDocs.price && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="output">{translations[selectedLanguage].output} *</label>
                            <InputText
                                id="output"
                                value={ticDocs.output}
                                onChange={(e) => onInputChange(e, 'text', 'output')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDocs.output })}
                            />
                            {submitted && !ticDocs.output && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="discount">{translations[selectedLanguage].discount} *</label>
                            <InputText
                                id="discount"
                                value={ticDocs.discount}
                                onChange={(e) => onInputChange(e, 'text', 'discount')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDocs.discount })}
                            />
                            {submitted && !ticDocs.discount && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="potrazuje">{translations[selectedLanguage].Left} *</label>
                            <InputText
                                id="potrazuje"
                                value={ticDocs.potrazuje}
                                onChange={(e) => onInputChange(e, 'text', 'potrazuje')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticDocs.potrazuje })}
                            />
                            {submitted && !ticDocs.potrazuje && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="cpar">{translations[selectedLanguage].cpar} *</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="cpar"
                                    value={ticDocs.cpar}
                                    onChange={(e) => onInputChange(e, "text", 'cpar')}
                                />
                                <Button icon="pi pi-search" onClick={handleParLClick} className="p-button" />
                                <Button icon="pi pi-search" onClick={handleParClick} className="p-button-success" />
                            </div>
                        </div>
                        <div className="field col-12 md:col-9">
                            <label htmlFor="npar">{translations[selectedLanguage].npar}</label>
                            <InputText
                                id="npar"
                                value={props.ticDocs.npar}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="begtm">{translations[selectedLanguage].BegTM}</label>
                            <InputText
                                id="begtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticDocs.begtm)}
                                onChange={(e) => onInputChange(e, 'text', 'begtm')}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="endtm">{translations[selectedLanguage].EndTM}</label>
                            <InputText
                                id="endtm"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticDocs.endtm)}
                                onChange={(e) => onInputChange(e, 'text', 'endtm')}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="status">{translations[selectedLanguage].Status}</label>
                            <Dropdown
                                id="status"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, 'options', 'status')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocs.status })}
                            />
                            {submitted && !ticDocs.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.docsTip === 'CREATE' ? <Button label={translations[selectedLanguage].Create} icon="pi pi-check" onClick={handleCreateClick} severity="success" outlined /> : null}
                            {props.docsTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.docsTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Save} icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inAction="delete" item={ticDocs.text} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
            <Dialog
                header={translations[selectedLanguage].ArtList}
                visible={ticArtLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setTicEventartLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticArtLVisible &&
                    <TicEventartL
                        parameter={'inputTextValue'}
                        ticDocs={ticDocs}
                        ticEvent={ticEvent}
                        onTaskComplete={handleTicArtLDialogClose}
                        setTicEventartLVisible={setTicEventartLVisible}
                        dialog={true}
                        lookUp={true}
                    />}
            </Dialog>
            {/** 
 * Dialog za izbor Dogadjaja EventProdajaL.js 
 * */}
            <Dialog
                header={translations[selectedLanguage].EventList}
                visible={ticEventProdajaLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setTicEventProdajaLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticEventProdajaLVisible &&
                    <TicEventProdajaL
                        parameter={'inputTextValue'}
                        ticDocs={ticDocs}
                        ticDoc={props.ticDoc}
                        onTaskComplete={handleTicEventProdajaLDialogClose}
                        setTicEventProdajaLVisible={setTicEventProdajaLVisible}
                        dialog={true}
                        lookUp={true}
                    />}
            </Dialog>
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
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, ticDoc: ticDoc, parentOrigin: `${env.DOMEN}` }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleCmnParLDialogClose}
                        originUrl={`${env.DOMEN}`}
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
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, ticDoc: ticDoc, parentOrigin: `${env.DOMEN}` }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleCmnParDialogClose}
                        originUrl={`${env.DOMEN}`}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default TicDocs;
