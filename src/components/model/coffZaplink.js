import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffZaplinkService } from "../../service/model/CoffZaplinkService";
import { CoffZapService } from "../../service/model/CoffZapService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction.js";
import { SapDataService } from "../../service/model/SapDataService";

const CoffZaplink = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const toast = useRef(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [ownerZap, setOwnerZap] = useState(props.coffZap || props.userZap || null);
    const selectedZapKey = ownerZap?.zap || ownerZap?.ZAP || props.user?.sapuser || null;
    const selectedZapCode = ownerZap?.zap || ownerZap?.ZAP || props.user?.sapuser || '';
    const selectedZapText =
        ownerZap?.nzap ||
        ownerZap?.N2ZAP ||
        [ownerZap?.IME, ownerZap?.PREZIME].filter(Boolean).join(' ');
    const selectedObjId = ownerZap?.obj ?? props.coffZap?.obj ?? null;
    const selectedObjText =
        ownerZap?.nobj ||
        ownerZap?.LOK ||
        ownerZap?.lok ||
        "";
    const [coffZaplink, setCoffZaplink] = useState({
        ...props.coffZaplink,
        zap1: `${props.coffZaplink?.zap1 ?? ''}`,
        zap2: props.coffZaplink?.zap2 || selectedZapKey,
        obj: props.coffZaplink?.obj ?? selectedObjId,
        nazap1: props.coffZaplink?.nazap1 || selectedZapText || '',
        nobj: props.coffZaplink?.nobj || selectedObjText || '',
        email: props.coffZaplink?.email || '',
        adkorisnik: props.coffZaplink?.adkorisnik || ''
    });
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.coffZaplink.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.coffZaplink.endda || DateFunction.currDate())));
    const [ddZapDDItems, setDdZapDDItems] = useState([]);
    const [zapDDItems, setZapDDItems] = useState([]);
    const [ddObjDDItems, setDdObjDDItems] = useState([]);
    const [objDDItems, setObjDDItems] = useState([]);

    const getZapText = (item) =>
        item?.N2ZAP ||
        item?.NZAP ||
        [item?.IME, item?.PREZIME].filter(Boolean).join(' ');

    const getZapEmail = (item) => item?.email || item?.EMAIL || '';

    const getZapAdkorisnik = (item) =>
        item?.adkorisnik ||
        item?.ADKORISNIK ||
        item?.ADKORISNK ||
        '';

    const getObjText = (objId, fallback = '') => {
        const foundItem = objDDItems.find((item) => `${item.id}` === `${objId}`);

        return foundItem?.text || fallback || '';
    };

    useEffect(() => {
        async function resolveOwnerZap() {
            try {
                if (props.coffZap?.zap || props.coffZap?.ZAP) {
                    setOwnerZap(props.coffZap);
                    return;
                }

                if (props.userZap?.zap || props.userZap?.ZAP) {
                    setOwnerZap(props.userZap);
                    return;
                }

                if (props.user?.sapuser) {
                    const coffZaplinkService = new CoffZaplinkService();
                    const data = await coffZaplinkService.getZapByUser(props.user.sapuser);
                    const nextOwnerZap = Array.isArray(data) ? data[0] : data;
                    setOwnerZap(nextOwnerZap || null);
                }
            } catch (error) {
                console.error(error);
            }
        }

        resolveOwnerZap();
    }, [props.coffZap, props.userZap, props.user]);

    useEffect(() => {
        const nextCoffZaplink = {
            ...props.coffZaplink,
            zap1: `${props.coffZaplink?.zap1 ?? ''}`,
            zap2: props.coffZaplink?.zap2 || selectedZapKey,
            obj: props.coffZaplink?.obj ?? selectedObjId,
            nazap1: props.coffZaplink?.nazap1 || selectedZapText || '',
            nobj: props.coffZaplink?.nobj || selectedObjText || '',
            email: props.coffZaplink?.email || '',
            adkorisnik: props.coffZaplink?.adkorisnik || ''
        };

        setCoffZaplink(nextCoffZaplink);
        setBegda(new Date(DateFunction.formatJsDate(nextCoffZaplink.begda || DateFunction.currDate())));
        setEndda(new Date(DateFunction.formatJsDate(nextCoffZaplink.endda || DateFunction.currDate())));
    }, [props.coffZaplink, selectedZapKey, selectedObjId, selectedObjText, selectedZapText]);

    useEffect(() => {
        const selectedItem = zapDDItems.find((item) => `${item.ZAP}` === `${coffZaplink?.zap1 ?? ''}`);
        const resolvedZapText = getZapText(selectedItem);
        const resolvedObj = coffZaplink?.obj ?? selectedObjId ?? null;
        const resolvedObjText = getObjText(resolvedObj, resolvedObj === selectedObjId ? selectedObjText : coffZaplink?.nobj || '');

        setCoffZaplink((prev) => ({
            ...prev,
            zap2: `${prev?.zap2 || selectedZapKey || ''}`,
            obj: resolvedObj,
            nzap1: prev?.nzap1 || resolvedZapText || '',
            nazap1: prev?.nazap1 || selectedZapText || '',
            nobj: prev?.nobj || resolvedObjText,
            email: prev?.email || getZapEmail(selectedItem) || '',
            adkorisnik: prev?.adkorisnik || getZapAdkorisnik(selectedItem) || '',
        }));
    }, [zapDDItems, objDDItems, selectedZapKey, selectedObjId, selectedObjText, selectedZapText]);

    useEffect(() => {
        async function fetchData() {
            try {
                const zapDDService = new SapDataService();
                const data = await zapDDService.getZapLista();

                setZapDDItems(data || []);
                setDdZapDDItems((data || []).map(({ N2ZAP, ZAP }) => ({
                    name: N2ZAP,
                    code: ZAP
                })));
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const coffZapService = new CoffZapService();
                const data = await coffZapService.getListObjaLL("COFF");

                setObjDDItems(data || []);
                setDdObjDDItems((data || []).map(({ text, id }) => ({ name: text, code: id })));
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const buildPayload = () => {
        const selectedItem = zapDDItems.find((item) => `${item.ZAP}` === `${coffZaplink?.zap1 ?? ''}`);
        const resolvedObj = coffZaplink.obj ?? selectedObjId ?? null;

        return {
            ...coffZaplink,
            zap1: `${coffZaplink.zap1 ?? ''}`,
            zap2: `${coffZaplink.zap2 || selectedZapKey || ''}`,
            obj: resolvedObj,
            nzap1: coffZaplink.nzap1 || getZapText(selectedItem) || '',
            nazap1: coffZaplink.nazap1 || selectedZapText || '',
            nobj: coffZaplink.nobj || getObjText(resolvedObj, selectedObjText),
            email: coffZaplink.email || getZapEmail(selectedItem) || '',
            adkorisnik: coffZaplink.adkorisnik || getZapAdkorisnik(selectedItem) || '',
            begda: DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda)),
            endda: DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda))
        };
    };

    const buildResetLink = () => ({
        ...props.coffZaplink,
        id: null,
        zap1: '',
        nzap1: '',
        czap1: '',
        descript: '',
        zap2: `${selectedZapKey || ''}`,
        obj: selectedObjId ?? null,
        nazap1: selectedZapText || '',
        nobj: selectedObjText || '',
        email: '',
        adkorisnik: '',
        begda: DateFunction.currDate(),
        endda: DateFunction.currDate()
    });

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const payload = buildPayload();
            const coffZaplinkService = new CoffZaplinkService();
            const data = await coffZaplinkService.postCoffZaplink(payload);
            const createdCoffZaplink = { ...payload, id: data };

            props.handleDialogClose({ obj: createdCoffZaplink, zaplinkTip: props.zaplinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffZaplink ",
                detail: `${err.response?.data?.error || err.message}`,
                life: 5000,
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            const payload = buildPayload();
            const coffZaplinkService = new CoffZaplinkService();
            const data = await coffZaplinkService.postCoffZaplink(payload);
            const createdCoffZaplink = { ...payload, id: data };

            props.handleDialogClose({ obj: createdCoffZaplink, zaplinkTip: props.zaplinkTip });

            const resetLink = buildResetLink();
            setCoffZaplink(resetLink);
            setBegda(new Date(DateFunction.formatJsDate(resetLink.begda)));
            setEndda(new Date(DateFunction.formatJsDate(resetLink.endda)));
            setSubmitted(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffZaplink ",
                detail: `${err.response?.data?.error || err.message}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const payload = buildPayload();
            const coffZaplinkService = new CoffZaplinkService();

            await coffZaplinkService.putCoffZaplink(payload);
            props.handleDialogClose({ obj: payload, zaplinkTip: props.zaplinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffZaplink ",
                detail: `${err.response?.data?.error || err.message}`,
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
                detail: `${err.response?.data?.error || err.message}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = '';
        const nextCoffZaplink = { ...coffZaplink };

        if (type === "options") {
            val = e.value ?? '';

            if (name === "zap1") {
                const foundItem = zapDDItems.find((item) => item.ZAP === val);
                const selectedOption = ddZapDDItems.find((item) => `${item.code}` === `${val}`);
                const zapText = selectedOption?.name || getZapText(foundItem);

                nextCoffZaplink.zap1 = `${val}`;
                nextCoffZaplink.nzap1 = zapText || '';
                nextCoffZaplink.czap1 = foundItem?.ZAP || '';
                nextCoffZaplink.email = getZapEmail(foundItem);
                nextCoffZaplink.adkorisnik = getZapAdkorisnik(foundItem);
            } else if (name === "obj") {
                const foundItem = objDDItems.find((item) => `${item.id}` === `${val}`);

                nextCoffZaplink.obj = val;
                nextCoffZaplink.nobj = foundItem?.text || '';
            }
        } else if (type === "Calendar") {
            if (name === "begda") {
                setBegda(e.value);
            }

            if (name === "endda") {
                setEndda(e.value);
            }
        } else {
            val = (e.target && e.target.value) || '';
            nextCoffZaplink[name] = val;
        }

        setCoffZaplink(nextCoffZaplink);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid glass-form glass-dialog-form">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card glass-card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" value={selectedZapCode} disabled />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={selectedZapText} disabled />
                        </div>
                        <div className="field col-12">
                            <label htmlFor="obj">{translations[selectedLanguage].Obj}</label>
                            <InputText id="obj" value={coffZaplink.nobj || selectedObjText} disabled />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card glass-card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-10">
                            <label htmlFor="zap1">{translations[selectedLanguage].Zap} *</label>
                            <Dropdown
                                id="zap1"
                                value={coffZaplink?.zap1 || null}
                                options={ddZapDDItems}
                                onChange={(e) => onInputChange(e, "options", 'zap1')}
                                required
                                filter
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffZaplink.zap1 })}
                            />
                            {submitted && !coffZaplink.zap1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12">
                            <label htmlFor="nzap1">{translations[selectedLanguage].Text}</label>
                            <InputText id="nzap1" value={coffZaplink.nzap1 || ''} disabled />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={coffZaplink.email || ''} disabled />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="adkorisnik">{translations[selectedLanguage].ADuser}</label>
                            <InputText id="adkorisnik" value={coffZaplink.adkorisnik || ''} disabled />
                        </div>
                        <div className="field col-12 md:col-10">
                            <label htmlFor="obj">{translations[selectedLanguage].Obj}</label>
                            <Dropdown
                                id="obj"
                                value={coffZaplink?.obj ?? null}
                                options={ddObjDDItems}
                                onChange={(e) => onInputChange(e, "options", 'obj')}
                                filter
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Select One"
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12">
                            <label htmlFor="descript">{translations[selectedLanguage].Descript}</label>
                            <InputText id="descript" value={coffZaplink.descript || ''} onChange={(e) => onInputChange(e, "text", 'descript')} />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar value={begda} onChange={(e) => onInputChange(e, "Calendar", 'begda')} showIcon dateFormat="dd.mm.yy" />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="endda">{translations[selectedLanguage].Endda} *</label>
                            <Calendar value={endda} onChange={(e) => onInputChange(e, "Calendar", 'endda')} showIcon dateFormat="dd.mm.yy" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.zaplinkTip === 'CREATE' ? (
                                <>
                                    <Button label={translations[selectedLanguage].Create} icon="pi pi-check" onClick={handleCreateClick} severity="success" outlined />
                                    <Button label={translations[selectedLanguage].CreateAndAddNew} icon="pi pi-plus" onClick={handleCreateAndAddNewClick} severity="success" outlined />
                                </>
                            ) : null}
                            {props.zaplinkTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.zaplinkTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Save} icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inCoffZaplink="delete" item={coffZaplink.nzap1 || selectedZapText} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
        </div>
    );
};

export default CoffZaplink;
