import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffZaplinkService } from "../../service/model/CoffZaplinkService";
import { CoffZapService } from "../../service/model/CoffZapService";
import { SapDataService } from "../../service/model/SapDataService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction.js"
import CoffZapL from './coffZapL';
import { Dialog } from 'primereact/dialog';


const CoffZaplink = (props) => {
    console.log(props, "@@@@@********************CoffZaplink********************")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [coffZaplink, setCoffZaplink] = useState(props.coffZaplink);
    const [submitted, setSubmitted] = useState(false);
    const [coffZap1Item, setCoffZap1Item] = useState(null);
    const [coffZap1Items, setCoffZap1Items] = useState(null);
    const [ddZapItem, setDdZap1Item] = useState(null);
    const [ddZapItems, setDdZap1Items] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.coffZaplink.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.coffZaplink.endda || DateFunction.currDate())))
    const [dropdownItem, setDropdownItem] = useState(null);


    const [coffZapLVisible, setCoffZapLVisible] = useState(false);
    const [coffZapRemoteLVisible, setCoffZapRemoteLVisible] = useState(false);
    const [coffZap, setCoffZap] = useState(null);
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [coffZaps, setCoffZaps] = useState([]);

    const [ddZapDDItem, setDdZapDDItem] = useState(null);
    const [ddZapDDItems, setDdZapDDItems] = useState(null);
    const [zapDDItem, setZapDDItem] = useState(null);
    const [zapDDItems, setZapDDItems] = useState(null);

    const calendarRef = useRef(null);
    const toast = useRef(null);


    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             // const coffZapService = new CoffZapService();
    //             // const data = await coffZapService.getLista('/zap');
    //             const zapDDService = new SapDataService();
    //             const data = await zapDDService.getLista('zap');                
    //             setCoffZap1Items(data);
    //             const dataDD = data.map(({ NZAP, ZAP }) => ({ name: NZAP, code: ZAP }));
    //             setDdZap1Items(dataDD);
    //             setDdZap1Item(dataDD.find((item) => item.code === props.coffZaplink.zap1) || null);
    //         } catch (error) {
    //             console.error(error);
    //             // Obrada greške ako je potrebna
    //         }
    //     }
    //     fetchData();
    // }, []);
    // Autocomplit>

    useEffect(() => {
        async function fetchData() {
            try {
                const coffZapService = new CoffZapService();
                const data = await coffZapService.getLista('/zap');
console.log(data, "=======================================================CoffZapService========================================================")
                setZapDDItems(data)
                const dataDD = data.map(({ N2ZAP, id }) => ({ name: N2ZAP, code: id }));

                setDdZapDDItems(dataDD);
                const foundDD = await dataDD.find((item) => item.code == props.coffZaplink.zap1)

                await setDdZapDDItem(foundDD);
                if (props.coffZaplink.zap) {
                    const foundItem = await data.find((item) => item.ZAP == props.coffZaplink.zap);

                    setZapDDItem(foundItem || null);
                    coffZap.IME = foundItem.IME
                    coffZap.PREZIME = foundItem.PREZIME
                    coffZap.NRM = foundItem.NRM
                    coffZaplink.nzap = foundItem.N2ZAP
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);


    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            setSubmitted(true);
            coffZaplink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            coffZaplink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const coffZaplinkService = new CoffZaplinkService();
            const data = await coffZaplinkService.postCoffZaplink(coffZaplink);
            coffZaplink.id = data
            props.handleDialogClose({ obj: coffZaplink, zaplinkTip: props.zaplinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffZaplink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            setSubmitted(true);
            coffZaplink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            coffZaplink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));

            const coffZaplinkService = new CoffZaplinkService();
            const data = await coffZaplinkService.postCoffZaplink(coffZaplink);
            coffZaplink.id = data;

            // Očisti coffZaplink.id i coffZaplink.zap1
            const newCoffZaplink = { ...coffZaplink, id: null, zap1: null };
            setDdZap1Item(null)

            props.handleDialogClose({ obj: newCoffZaplink, zaplinkTip: props.zaplinkTip });
            // Ne postavljaj setVisible(false) kako bi ostao otvoren za dodavanje novog unosa
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffZaplink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {


            coffZaplink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            coffZaplink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const coffZaplinkService = new CoffZaplinkService();

            await coffZaplinkService.putCoffZaplink(coffZaplink);
            props.handleDialogClose({ obj: coffZaplink, zaplinkTip: props.zaplinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffZaplink ",
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
            const coffZaplinkService = new CoffZaplinkService();
            await coffZaplinkService.deleteCoffZaplink(coffZaplink);
            props.handleDialogClose({ obj: coffZaplink, zaplinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffZaplink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };
    /*********************************************************** */
    const setCoffZapRemoteDialog = () => {
        setCoffZapRemoteLVisible(true);
    };

    const setCoffzapDialog = (destination) => {
        setCoffZapLVisible(true);
    };

    const handleZapClick = async (e, destination) => {
        try {
            if (destination === 'local') setCoffzapDialog();
            else setCoffZapRemoteDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch coffZap data',
                life: 3000
            });
        }
    };

    const handleCoffZapLDialogClose = (newObj) => {
        console.log(newObj, "11111111111111111111111111111111qqq1111111111111111111111111111111", newObj)
        setCoffZap(newObj);
        let _coffZaplink = { ...coffZaplink }
        _coffZaplink.zap1 = newObj.id;
        _coffZaplink.nzap1 = newObj.text;
        _coffZaplink.czap1 = newObj.code;
        coffZaplink.zap1 = newObj.id;
        coffZaplink.nzap1 = newObj.text;
        coffZaplink.czap1 = newObj.code;
        //ticEventart.price = newObj.price;
        setCoffZaplink(_coffZaplink)
        //ticEventart.potrazuje = newObj.cena * ticEventart.output;
        setCoffZapLVisible(false);
    };
    /************************************************************ */
    const onInputChange = async (e, type, name, a) => {
        let val = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "zap1") {
                setDdZapDDItem(e.value);
                const foundItem = await zapDDItems.find((item) => item.ZAP === val);
                console.log(foundItem, "@#@#@#@#@#@#@#@#@# onInputChange @#@#@#@#@#", val, "@#@#@#@#@#@#@#", zapDDItems)
                setZapDDItem(foundItem || null);
                coffZaplink.nzap1 = foundItem?.NZAP
            } else {
                setDropdownItem(e.value);
            }
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    coffZaplink.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    coffZaplink.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _coffZaplink = { ...coffZaplink };
        _coffZaplink[`${name}`] = val;
        console.log(_coffZaplink, "--------------------------name------------------------------", name)
        setCoffZaplink(_coffZaplink);
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
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code"
                                value={props.user?.firstname}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.user?.lastname}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-10">
                            <label htmlFor="zap1">{translations[selectedLanguage].Zap} *</label>
                            <Dropdown id="zap1"
                                value={ddZapDDItem}
                                options={ddZapDDItems}
                                onChange={(e) => onInputChange(e, "options", 'zap1')}
                                required
                                showClear
                                filter
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffZaplink.zap1 })}
                            />
                            {submitted && !coffZaplink.zap1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        {/* <div className="field col-12 md:col-5">
                            <label htmlFor="czap1">{translations[selectedLanguage].czap}</label>
                            <div className="p-inputgroup flex-1">
                                <InputText id="czap1" value={coffZaplink.czap1}
                                    onChange={(e) => onInputChange(e, 'text', 'czap1')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !coffZaplink.czap1 })} />
                                <Button icon="pi pi-search" onClick={(e) => handleZapClick(e, 'local')} className="p-button" />
                            </div>
                            {submitted && !coffZaplink.czap1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="nzap1">{translations[selectedLanguage].nzap}</label>
                            <InputText id="nzap1"
                                value={coffZaplink.nzap1}
                                onChange={(e) => onInputChange(e, 'text', 'nzap1')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffZaplink.nzap1 })}
                            />
                            {submitted && !coffZaplink.nzap1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div> */}


                        
                        {/* 
                        <div className="field col-12 md:col-7">
                            <label htmlFor="zap1">{translations[selectedLanguage].ZapText} *</label>
                            <Dropdown id="zap1"
                                value={ddZapItem}
                                options={ddZapItems}
                                onChange={(e) => onInputChange(e, "options", 'zap1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffZaplink.zap1 })}
                            />
                            {submitted && !coffZaplink.zap1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div> 
*/}


                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="descript">{translations[selectedLanguage].Descript}</label>
                            <InputText
                                id="descript"
                                value={coffZaplink.descript} onChange={(e) => onInputChange(e, "text", 'descript')}
                            />
                        </div>
                    </div>
                    {/* <div className="flex flex-wrap gap-2"> */}
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
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
                        <div className="field col-12 md:col-4">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                    </div>
                    {/* </div> */}
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
                            {(props.zaplinkTip === 'CREATE') ? (
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
                            {(props.zaplinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.zaplinkTip !== 'CREATE') ? (
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
                inCoffZaplink="delete"
                item={coffZaplink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
            <Dialog
                header={translations[selectedLanguage].ZapList}
                visible={coffZapLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setCoffZapLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {coffZapLVisible &&
                    <CoffZapL
                        parameter={'inputTextValue'}
                        onTaskComplete={handleCoffZapLDialogClose}
                        setCoffZapLVisible={setCoffZapLVisible}
                        dialog={true}
                        lookUp={true}
                    />}
            </Dialog>
        </div>
    );
};

export default CoffZaplink;
