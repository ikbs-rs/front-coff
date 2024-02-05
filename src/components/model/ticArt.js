import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicArtService } from "../../service/model/TicArtService";
import { TicArttpService } from "../../service/model/TicArttpService";
import { TicArtgrpService } from "../../service/model/TicArtgrpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";
import { ColorPicker } from 'primereact/colorpicker';

const TicArt = (props) => {
console.log(props, "*********************************props**************************************************")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticArt, setTicArt] = useState(props.ticArt);
    const [submitted, setSubmitted] = useState(false);

    const [ddTicArttpItem, setDdTicArttpItem] = useState(null);
    const [ddTicArttpItems, setDdTicArttpItems] = useState(null);
    const [ticArttpItem, setTicArttpItem] = useState(null);
    const [ticArttpItems, setTicArttpItems] = useState(null);

    const [ddTicArtgrpItem, setDdTicArtgrpItem] = useState(null);
    const [ddTicArtgrpItems, setDdTicArtgrpItems] = useState(null);
    const [ticArtgrpItem, setTicArtgrpItem] = useState(null);
    const [ticArtgrpItems, setTicArtgrpItems] = useState(null);

    const [ddCmnUmItem, setDdCmnUmItem] = useState(null);
    const [ddCmnUmItems, setDdCmnUmItems] = useState(null);
    const [cmnUmItem, setCmnUmItem] = useState(null);
    const [cmnUmItems, setCmnUmItems] = useState(null);

    const [ddTicEventItem, setDdTicEventItem] = useState(null);
    const [ddTicEventItems, setDdTicEventItems] = useState(null);
    const [ticEventItem, setTicEventItem] = useState(null);
    const [ticEventItems, setTicEventItems] = useState(null);

    const [ddCmnTgpItem, setDdCmnTgpItem] = useState(null);
    const [ddCmnTgpItems, setDdCmnTgpItems] = useState(null);
    const [cmnTgpItem, setCmnTgpItem] = useState(null);
    const [cmnTgpItems, setCmnTgpItems] = useState(null);

    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);

    const [ddAmountItem, setDdAmountItem] = useState(null);
    const [ddAmountItems, setDdAmountItems] = useState(null);

    const [ddCombiningItem, setDdCombiningItem] = useState(null);
    const [ddCombiningItems, setDdCombiningItems] = useState(null);
    
    const calendarRef = useRef(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticArt.valid));
    }, []);

    useEffect(() => {
        setDdAmountItem(findDdAmountItemByCode(props.ticArt.amount));
    }, []);

    useEffect(() => {
        setDdCombiningItem(findDdCombiningItemByCode(props.ticArt.combining));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticArtgrpService = new TicArtgrpService();
                const data = await ticArtgrpService.getTicArtgrps();

                setTicArtgrpItems(data)
                //console.log("******************", ticArttpItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicArtgrpItems(dataDD);
                setDdTicArtgrpItem(dataDD.find((item) => item.code === props.ticArt.grp) || null);
                if (props.ticArt.grp) {
                    const foundItem = data.find((item) => item.id === props.ticArt.grp);
                    setTicArtgrpItem(foundItem || null);
                    ticArt.cgrp = foundItem.code
                    ticArt.ngrp = foundItem.textx
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
                const ticArttpService = new TicArttpService();
                const data = await ticArttpService.getTicArttps();

                setTicArttpItems(data)
                //console.log("******************", cmnUmItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicArttpItems(dataDD);
                setDdTicArttpItem(dataDD.find((item) => item.code === props.ticArt.tp) || null);
                if (props.ticArt.tp) {
                    const foundItem = data.find((item) => item.id === props.ticArt.tp);
                    setTicArttpItem(foundItem || null);
                    ticArt.ctp = foundItem.code
                    ticArt.ntp = foundItem.textx
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
                const url = `${env.CMN_BACK_URL}/cmn/x/um/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setCmnUmItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnUmItems(dataDD);
                setDdCmnUmItem(dataDD.find((item) => item.code === props.ticArt.um) || null);
                if (props.ticArt.um) {
                    const foundItem = data.find((item) => item.id === props.ticArt.um);
                    setCmnUmItem(foundItem || null);
                    ticArt.cum = foundItem.code
                    ticArt.num = foundItem.textx
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
                const url = `${env.TIC_BACK_URL}/tic/x/event/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setTicEventItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventItems(dataDD);
                let targetEvent = props.ticArt.event ? props.ticArt.event : props.ticEventId;
                setDdTicEventItem(dataDD.find((item) => item.code === targetEvent) || null);
                //setDdTicEventItem(dataDD.find((item) => item.code === props.ticArt.event  || item.code === props.ticEventId));
                if (props.ticArt.event || props.ticEventId) {
                    const foundItem = data.find((item) => item.id === targetEvent) || null;
                    setTicEventItem(foundItem || null);
                    ticArt.cevent = foundItem.code
                    ticArt.nevent = foundItem.textx
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
                const url = `${env.CMN_BACK_URL}/cmn/x/tgp/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setCmnTgpItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnTgpItems(dataDD);
                setDdCmnTgpItem(dataDD.find((item) => item.code === props.ticArt.tgp) || null);
                if (props.ticArt.um) {
                    const foundItem = data.find((item) => item.id === props.ticArt.tgp);
                    setCmnTgpItem(foundItem || null);
                    ticArt.ctgp = foundItem.code
                    ticArt.ntgp = foundItem.textx
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    // Autocomplit>

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    const findDdAmountItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    const findDdCombiningItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    useEffect(() => {
        setDdAmountItems(items);
    }, []);

    useEffect(() => {
        setDdCombiningItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const ticArtService = new TicArtService();
            const data = await ticArtService.postTicArt(ticArt);
            ticArt.id = data
            props.handleDialogClose({ obj: ticArt, artTip: props.artTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicArt ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticArtService = new TicArtService();

            await ticArtService.putTicArt(ticArt);
            props.handleDialogClose({ obj: ticArt, artTip: props.artTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicArt ",
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
            const ticArtService = new TicArtService();
            await ticArtService.deleteTicArt(ticArt);
            props.handleDialogClose({ obj: ticArt, artTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicArt ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            let foundItem = {}
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "tp") {
                setDdTicArttpItem(e.value);
                foundItem = ticArttpItems.find((item) => item.id === val);
                setTicArttpItem(foundItem || null);
                ticArt.ntp = e.value.name
                ticArt.ctp = foundItem.code
            } else if (name == "grp") {
                setDdTicArtgrpItem(e.value);
                foundItem = ticArtgrpItems.find((item) => item.id === val);
                setTicArtgrpItem(foundItem || null);
                ticArt.ngrp = e.value.name
                ticArt.cgrp = foundItem.code
            } else if (name == "um") {
                setDdCmnUmItem(e.value);
                foundItem = cmnUmItems.find((item) => item.id === val);
                setCmnUmItem(foundItem || null);
                ticArt.num = e.value.name
                ticArt.cum = foundItem.code
            } else if (name == "event") {
                setDdTicEventItem(e.value);
                foundItem = ticEventItems.find((item) => item.id === val);
                setTicEventItem(foundItem || null);
                ticArt.nevent = e.value.name
                ticArt.cevent = foundItem.code
            } else if (name == "tgp") {
                setDdCmnTgpItem(e.value);
                foundItem = cmnTgpItems.find((item) => item.id === val);
                setCmnTgpItem(foundItem || null);
                ticArt.ntgp = e.value.name
                ticArt.ctgp = foundItem.code
            } else if (name == "amount") {
                setDdAmountItem(e.value);
            } else if (name == "combining") {
                setDdCombiningItem(e.value);
            } else {
                setDropdownItem(e.value);
            }

        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticArt = { ...ticArt };
        _ticArt[`${name}`] = val;
        setTicArt(_ticArt);
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
                                value={ticArt.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticArt.code })}
                            />
                            {submitted && !ticArt.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={ticArt.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticArt.text })}
                            />
                            {submitted && !ticArt.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddTicArttpItem}
                                options={ddTicArttpItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArt.tp })}
                            />
                            {submitted && !ticArt.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="grp">{translations[selectedLanguage].Group} *</label>
                            <Dropdown id="grp"
                                value={ddTicArtgrpItem}
                                options={ddTicArtgrpItems}
                                onChange={(e) => onInputChange(e, "options", 'grp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArt.grp })}
                            />
                            {submitted && !ticArt.grp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="event">{translations[selectedLanguage].Event} *</label>
                            <Dropdown id="event"
                                value={ddTicEventItem}
                                options={ddTicEventItems}
                                onChange={(e) => onInputChange(e, "options", 'event')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArt.event })}
                            />
                            {submitted && !ticArt.event && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="um">{translations[selectedLanguage].Um} *</label>
                            <Dropdown id="um"
                                value={ddCmnUmItem}
                                options={ddCmnUmItems}
                                onChange={(e) => onInputChange(e, "options", 'um')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArt.um })}
                            />
                            {submitted && !ticArt.um && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tgp">{translations[selectedLanguage].Tgp} *</label>
                            <Dropdown id="tgp"
                                value={ddCmnTgpItem}
                                options={ddCmnTgpItems}
                                onChange={(e) => onInputChange(e, "options", 'tgp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArt.tgp })}
                            />
                            {submitted && !ticArt.tgp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-1">
                            <div className="flex-2 flex flex-column align-items-left">
                                <label htmlFor="color">{translations[selectedLanguage].color}</label>
                                <ColorPicker format="hex" id="color" value={ticArt.color} onChange={(e) => onInputChange(e, 'text', 'color')} />
                            </div>

                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="amount">{translations[selectedLanguage].amount}</label>
                            <Dropdown id="amount"
                                value={ddAmountItem}
                                options={ddAmountItems}
                                onChange={(e) => onInputChange(e, "options", 'amount')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArt.amount })}
                            />
                            {submitted && !ticArt.amount && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="combining">{translations[selectedLanguage].combining}</label>
                            <Dropdown id="combining"
                                value={ddCombiningItem}
                                options={ddCombiningItems}
                                onChange={(e) => onInputChange(e, "options", 'combining')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArt.combining })}
                            />
                            {submitted && !ticArt.combining && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>                    
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArt.valid })}
                            />
                            {submitted && !ticArt.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.artTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.artTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.artTip !== 'CREATE') ? (
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
                inTicArt="delete"
                item={ticArt.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicArt;
