import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicDocdeliveryService } from "../../service/model/TicDocdeliveryService";
import { TicDocService } from "../../service/model/TicDocService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicDocdelivery = (props) => {
    //console.log(props, "*******************TicDocdelivery***********************")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticDocdelivery, setTicDocdelivery] = useState(props.ticDocdelivery);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnSpedicijaItem, setDdCmnSpedicijaItem] = useState(null);
    const [ddCmnSpedicijaItems, setDdCmnSpedicijaItems] = useState(null);
    const [cmnSpedicijaItem, setCmnSpedicijaItem] = useState(null);
    const [cmnSpedicijaItems, setCmnSpedicijaItems] = useState(null);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [dat, setDate] = useState(new Date(DateFunction.formatJsDate(props.ticDocdelivery.dat || DateFunction.currDate())));
    const [datdelivery, setDatdelivery] = useState(new Date(DateFunction.formatJsDate(props.ticDocdelivery.datdelivery || DateFunction.currDate())));

    const statusItems = [
        { name: `${translations[selectedLanguage].ForDelivery}`, code: '0' },
        { name: `${translations[selectedLanguage].InDelivery}`, code: '1' },
        { name: `${translations[selectedLanguage].Paid}`, code: '2' },
        { name: `${translations[selectedLanguage].Canceled}`, code: '3' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticDocdelivery.status));
    }, []);

    useEffect(() => {
        setDropdownItems(statusItems);
    }, []);

    const findDropdownItemByCode = (code) => {
        return statusItems.find((item) => item.code === code) || null;
    };    

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDocService = new TicDocService();
                const data = await ticDocService.getTicListaByItem('docdelivery', 'listabytxt', 'cmn_spedicija_v', 'aa.code', 'SHP');

                setCmnSpedicijaItems(data)

                const dataDD = data.map(({ text, id }) => ({ name: text, code: id }));
                setDdCmnSpedicijaItems(dataDD);
                setDdCmnSpedicijaItem(dataDD.find((item) => item.code === props.ticDocdelivery.courier) || null);
                if (props.ticDocdelivery.courier) {
                    const foundItem = data.find((item) => item.id === props.ticDocdelivery.courier);
                    setCmnSpedicijaItem(foundItem || null);
                    //ticDocdelivery.begda = foundItem.begda
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
        props.setTicDocdeliveryVisible(false)
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticDocdelivery.dat = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(dat));
            ticDocdelivery.datdelivery = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(datdelivery));

            const ticDocdeliveryService = new TicDocdeliveryService();
            const data = await ticDocdeliveryService.postTicDocdelivery(ticDocdelivery);
            ticDocdelivery.id = data
            props.handleDialogClose({ obj: ticDocdelivery, docdeliveryTip: props.docdeliveryTip });
            props.setVisible(false);
            props.setTicDocdeliveryVisible(false)
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocdelivery ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            ticDocdelivery.dat = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(dat));
            ticDocdelivery.datdelivery = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(datdelivery));
            const ticDocdeliveryService = new TicDocdeliveryService();

            await ticDocdeliveryService.putTicDocdelivery(ticDocdelivery);
            props.handleDialogClose({ obj: ticDocdelivery, docdeliveryTip: props.docdeliveryTip });
            props.setVisible(false);
            props.setTicDocdeliveryVisible(false)
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocdelivery ",
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
            const ticDocdeliveryService = new TicDocdeliveryService();
            await ticDocdeliveryService.deleteTicDocdelivery(ticDocdelivery);
            props.handleDialogClose({ obj: ticDocdelivery, docdeliveryTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
            props.setTicDocdeliveryVisible(false)
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicDocdelivery ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "courier") {
                setDdCmnSpedicijaItem(e.value);
                const foundItem = cmnSpedicijaItems.find((item) => item.id === val);
                setCmnSpedicijaItem(foundItem || null);
                ticDocdelivery.text = e.value.name
                ticDocdelivery.code = foundItem.code
            } else {
                setDropdownItem(e.value);
            }
        } else if (type === "Calendar") {
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "dat":
                    setDate(e.value)
                    break;
                case "datdelivery":
                    setDatdelivery(e.value)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticDocdelivery = { ...ticDocdelivery };
        _ticDocdelivery[`${name}`] = val;

        setTicDocdelivery(_ticDocdelivery);
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
                            <label htmlFor="code">{translations[selectedLanguage].Transaction}</label>
                            <InputText id="code"
                                value={props.ticDocdelivery.doc}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="npar">{translations[selectedLanguage].npar}</label>
                            <InputText id="npar"
                                value={props.cmnPar.text || props.ticDocdelivery.npar}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="paymenttp">{translations[selectedLanguage].Courier} *</label>
                            <Dropdown id="courier"
                                value={ddCmnSpedicijaItem}
                                options={ddCmnSpedicijaItems}
                                onChange={(e) => onInputChange(e, "options", 'courier')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticDocdelivery.courier })}
                            />
                            {submitted && !ticDocdelivery.courier && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-8">
                            <label htmlFor="adress">{translations[selectedLanguage].adress} *</label>
                            <InputText
                                id="adress"
                                value={ticDocdelivery.adress || props.cmnPar.adress}
                                onChange={(e) => onInputChange(e, "text", 'adress')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="amount">{translations[selectedLanguage].Amount} *</label>
                            <InputText
                                id="amount"
                                value={ticDocdelivery.amount} onChange={(e) => onInputChange(e, "text", 'amount')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="dat">{translations[selectedLanguage].dat} *</label>
                            <Calendar
                                value={dat}
                                onChange={(e) => onInputChange(e, "Calendar", 'dat', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
                            />
                        </div>
                        <div className="field col-12 md:col-5">
                            <label htmlFor="datdelivery">{translations[selectedLanguage].datdelivery} *</label>
                            <Calendar
                                value={datdelivery}
                                onChange={(e) => onInputChange(e, "Calendar", 'datdelivery', this)}
                                showIcon
                                dateFormat="dd.mm.yy"
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
                            className={classNames({ 'p-invalid': submitted && !ticDocdelivery.status })}
                        />
                        {submitted && !ticDocdelivery.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                    </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <label htmlFor="note">{translations[selectedLanguage].note} *</label>
                            <InputText
                                id="note"
                                value={ticDocdelivery.note} onChange={(e) => onInputChange(e, "text", 'note')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="parent">{translations[selectedLanguage].parent} *</label>
                            <InputText
                                id="parent"
                                value={ticDocdelivery.parent} onChange={(e) => onInputChange(e, "text", 'parent')}
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
                            {(props.docdeliveryTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.docdeliveryTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docdeliveryTip !== 'CREATE') ? (
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
                inTicDocdelivery="delete"
                item={ticDocdelivery.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicDocdelivery;
