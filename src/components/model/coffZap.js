import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffZapService } from "../../service/model/CoffZapService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { SapDataService } from "../../service/model/SapDataService";

const CoffZap = (props) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [coffZap, setCoffZap] = useState({ ...props.coffZap });
    const [submitted, setSubmitted] = useState(false);
    const [ddZapDDItems, setDdZapDDItems] = useState([]);
    const [zapDDItems, setZapDDItems] = useState([]);
    const [ddObjDDItems, setDdObjDDItems] = useState([]);
    const [objDDItems, setObjDDItems] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        setCoffZap({ ...props.coffZap });
    }, [props.coffZap]);

    useEffect(() => {
        async function fetchData() {
            try {
                const zapDDService = new SapDataService();
                const data = await zapDDService.getZapLista();

                setZapDDItems(data || []);
                setDdZapDDItems((data || []).map(({ N2ZAP, ZAP }) => ({ name: N2ZAP, code: ZAP })));
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnObjService = new CoffZapService();
                const data = await cmnObjService.getListObjaLL("COFF");

                setObjDDItems(data || []);
                setDdObjDDItems((data || []).map(({ text, id }) => ({ name: text, code: id })));
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const buildPayload = () => ({
        id: coffZap.id ?? null,
        zap: `${coffZap.zap ?? ""}`,
        tp: coffZap.tp ?? 1,
        pravilnik: coffZap.pravilnik ?? "",
        oblast: coffZap.oblast ?? "",
        mtroska: coffZap.mtroska ?? "",
        nzap: coffZap.nzap ?? "",
        email: coffZap.email ?? "",
        adkorisnik: coffZap.adkorisnik ?? "",
        obj: coffZap.obj ?? null,
        valid: `${coffZap.valid ?? '1'}`,
    });

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const coffZapService = new CoffZapService();
            const payload = buildPayload();
            const data = await coffZapService.postCoffZap(payload);
            const createdCoffZap = { ...coffZap, ...payload, id: data };

            props.handleDialogClose({ obj: createdCoffZap, zapTip: props.zapTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response?.data?.error || err.message}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const coffZapService = new CoffZapService();
            const payload = buildPayload();
            await coffZapService.putCoffZap(payload);
            props.handleDialogClose({ obj: { ...coffZap, ...payload }, zapTip: props.zapTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
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
            const coffZapService = new CoffZapService();
            await coffZapService.deleteCoffZap(coffZap);
            props.handleDialogClose({ obj: coffZap, zapTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response?.data?.error || err.message}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = '';
        const nextCoffZap = { ...coffZap };

        if (type === "options") {
            val = e.value ?? '';

            if (name === "zap") {
                const foundItem = zapDDItems.find((item) => item.ZAP === val);

                nextCoffZap.zap = `${val}`;
                nextCoffZap.IME = foundItem?.IME || "";
                nextCoffZap.PREZIME = foundItem?.PREZIME || "";
                nextCoffZap.NRM = foundItem?.NRM || "";
                nextCoffZap.nzap = foundItem?.N2ZAP || "";
                nextCoffZap.email = foundItem?.email || foundItem?.EMAIL || "";
                nextCoffZap.adkorisnik = foundItem?.adkorisnik || foundItem?.ADKORISNIK || foundItem?.ADKORISNK || "";
            } else if (name === "obj") {
                const foundItem = objDDItems.find((item) => `${item.id}` === `${val}`);

                nextCoffZap.obj = val;
                nextCoffZap.nobj = foundItem?.text || "";
            }
        } else if (type === "checkbox") {
            val = e.checked ? '1' : '0';
            nextCoffZap.valid = val;
        } else {
            val = (e.target && e.target.value) || '';
            nextCoffZap[name] = val;
        }

        setCoffZap(nextCoffZap);
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
                        <div className="field col-12 md:col-10">
                            <label htmlFor="zap">{translations[selectedLanguage].Zap} *</label>
                            <Dropdown
                                id="zap"
                                value={coffZap?.zap || null}
                                options={ddZapDDItems}
                                onChange={(e) => onInputChange(e, "options", 'zap')}
                                required
                                filter
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffZap.zap })}
                            />
                            {submitted && !coffZap.zap && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-7">
                            <label htmlFor="pravilnik">{translations[selectedLanguage].Pravilnik}</label>
                            <InputText
                                id="pravilnik"
                                autoFocus
                                value={coffZap.pravilnik || ""}
                                onChange={(e) => onInputChange(e, "text", 'pravilnik')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffZap.pravilnik })}
                            />
                            {submitted && !coffZap.pravilnik && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="oblast">{translations[selectedLanguage].Oblast}</label>
                            <InputText
                                id="oblast"
                                value={coffZap.oblast || ""}
                                onChange={(e) => onInputChange(e, "text", 'oblast')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffZap.oblast })}
                            />
                            {submitted && !coffZap.oblast && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="mtroska">{translations[selectedLanguage].Mtroska}</label>
                            <InputText
                                id="mtroska"
                                value={coffZap.mtroska || ""}
                                onChange={(e) => onInputChange(e, "text", 'mtroska')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffZap.mtroska })}
                            />
                            {submitted && !coffZap.mtroska && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-10">
                            <label htmlFor="obj">{translations[selectedLanguage].Obj} *</label>
                            <Dropdown
                                id="obj"
                                value={coffZap?.obj ?? null}
                                options={ddObjDDItems}
                                onChange={(e) => onInputChange(e, "options", 'obj')}
                                required
                                filter
                                optionLabel="name"
                                optionValue="code"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffZap.obj })}
                            />
                            {submitted && !coffZap.obj && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={coffZap.email || ""}
                                disabled
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="adkorisnik">{translations[selectedLanguage].ADuser}</label>
                            <InputText
                                id="adkorisnik"
                                value={coffZap.adkorisnik || ""}
                                disabled
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <div className="flex align-items-center gap-2 pt-2">
                                <Checkbox
                                    inputId="valid"
                                    checked={`${coffZap.valid ?? '1'}` === '1'}
                                    onChange={(e) => onInputChange(e, "checkbox", "valid")}
                                />
                                <label htmlFor="valid">
                                    {`${coffZap.valid ?? '1'}` === '1'
                                        ? translations[selectedLanguage].Yes
                                        : translations[selectedLanguage].No}
                                </label>
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
                            {props.zapTip === 'CREATE' ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {props.zapTip !== 'CREATE' ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {props.zapTip !== 'CREATE' ? (
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
                inAction="delete"
                item={coffZap.nzap}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CoffZap;
