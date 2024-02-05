import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicPrivilegeService } from "../../service/model/TicPrivilegeService";
import { TicPrivilegetpService } from "../../service/model/TicPrivilegetpService";
import { TicDiscounttpService } from "../../service/model/TicDiscounttpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';

const TicPrivilege = (props) => {
console.log("*******************", props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticPrivilege, setTicPrivilege] = useState(props.ticPrivilege);
    const [submitted, setSubmitted] = useState(false);

    const [ddTicPrivilegetpItem, setDdTicPrivilegetpItem] = useState(null);
    const [ddTicPrivilegetpItems, setDdTicPrivilegetpItems] = useState(null);
    const [ticPrivilegetpItem, setTicPrivilegetpItem] = useState(null);
    const [ticPrivilegetpItems, setTicPrivilegetpItems] = useState(null);
    
    const [ddTicDiscounttpItem, setDdTicDiscounttpItem] = useState(null);
    const [ddTicDiscounttpItems, setDdTicDiscounttpItems] = useState(null);
    const [ticDiscounttpItem, setTicDiscounttpItem] = useState(null);
    const [ticDiscounttpItems, setTicDiscounttpItems] = useState(null);

    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [dropdownUslovItem, setDropdownUslovItem] = useState(null);
    const [dropdownUslovItems, setDropdownUslovItems] = useState(null);
    const [dropdownDomenItem, setDropdownDomenItem] = useState(null);
    const [dropdownDomenItems, setDropdownDomenItems] = useState(null);

    const calendarRef = useRef(null);

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];
    const domens = [
        { name: `${translations[selectedLanguage].All}`, code: '0' },
        { name: `${translations[selectedLanguage].Prodact}`, code: '1' },
        { name: `${translations[selectedLanguage].Service}`, code: '2' }
    ];
    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.ticPrivilege.valid));
    }, []);

    useEffect(() => {
        setDropdownUslovItem(findDropdownItemByCode(props.ticPrivilege.uslov));
    }, []);

    useEffect(() => {
        setDropdownDomenItem(findDropdownDomenByCode(props.ticPrivilege.domen));
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticPrivilegetpService = new TicPrivilegetpService();
                const data = await ticPrivilegetpService.getTicPrivilegetps();

                setTicPrivilegetpItems(data)
                //console.log("******************", ticPrivilegetpItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicPrivilegetpItems(dataDD);
                setDdTicPrivilegetpItem(dataDD.find((item) => item.code === props.ticPrivilege.tp) || null);
                if (props.ticPrivilege.tp) {
                    const foundItem = data.find((item) => item.id === props.ticPrivilege.tp);
                    setTicPrivilegetpItem(foundItem || null);
                    ticPrivilege.ctp = foundItem.code
                    ticPrivilege.ntp = foundItem.textx
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
                const ticDiscounttpService = new TicDiscounttpService();
                const data = await ticDiscounttpService.getTicDiscounttps();

                setTicDiscounttpItems(data)
                //console.log("******************", ticPrivilegetpItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicDiscounttpItems(dataDD);
                setDdTicDiscounttpItem(dataDD.find((item) => item.code === props.ticPrivilege.popust) || null);
                if (props.ticPrivilege.popust) {
                    const foundItem = data.find((item) => item.id === props.ticPrivilege.popust);
                    setTicDiscounttpItem(foundItem || null);
                    //ticPrivilege.ctp = foundItem.code
                    ticPrivilege.ntp = foundItem.textx
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

    const findDropdownDomenByCode = (code) => {
        return domens.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    useEffect(() => {
        setDropdownUslovItems(items);
    }, []);

    useEffect(() => {
        setDropdownDomenItems(domens);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const ticPrivilegeService = new TicPrivilegeService();
            const data = await ticPrivilegeService.postTicPrivilege(ticPrivilege);
            ticPrivilege.id = data
            props.handleDialogClose({ obj: ticPrivilege, privilegeTip: props.privilegeTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilege ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticPrivilegeService = new TicPrivilegeService();

            await ticPrivilegeService.putTicPrivilege(ticPrivilege);
            props.handleDialogClose({ obj: ticPrivilege, privilegeTip: props.privilegeTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilege ",
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
            const ticPrivilegeService = new TicPrivilegeService();
            await ticPrivilegeService.deleteTicPrivilege(ticPrivilege);
            props.handleDialogClose({ obj: ticPrivilege, privilegeTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilege ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "tp") {
                setDdTicPrivilegetpItem(e.value);
                const foundItem = ticPrivilegetpItems.find((item) => item.id === val);
                setTicPrivilegetpItem(foundItem || null);
                ticPrivilege.ntp = e.value.name
                ticPrivilege.ctp = foundItem.code
            } else if (name == "popust") {
                setDdTicDiscounttpItem(e.value);
                const foundItem = ticDiscounttpItems.find((item) => item.id === val);
                setTicDiscounttpItem(foundItem || null);
                ticPrivilege.npopust = e.value.name
                ticPrivilege.cpopust = foundItem.code
            } else if (name == "uslov") {
                setDropdownUslovItem(e.value);
            } else if (name == "domen") {
                setDropdownDomenItem(e.value);
            }  else {
                setDropdownItem(e.value);
            }

        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticPrivilege = { ...ticPrivilege };
        _ticPrivilege[`${name}`] = val;
        setTicPrivilege(_ticPrivilege);
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
                                value={ticPrivilege.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticPrivilege.code })}
                            />
                            {submitted && !ticPrivilege.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={ticPrivilege.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticPrivilege.text })}
                            />
                            {submitted && !ticPrivilege.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="tp">{translations[selectedLanguage].Type} *</label>
                            <Dropdown id="tp"
                                value={ddTicPrivilegetpItem}
                                options={ddTicPrivilegetpItems}
                                onChange={(e) => onInputChange(e, "options", 'tp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticPrivilege.tp })}
                            />
                            {submitted && !ticPrivilege.tp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="popust">{translations[selectedLanguage].popust} *</label>
                            <Dropdown id="popust"
                                value={ddTicDiscounttpItem}
                                options={ddTicDiscounttpItems}
                                onChange={(e) => onInputChange(e, "options", 'popust')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticPrivilege.popust })}
                            />
                            {submitted && !ticPrivilege.popust && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="limitirano">{translations[selectedLanguage].Vrednost}</label>
                            <InputText id="limitirano"
                                value={ticPrivilege.vrednost} onChange={(e) => onInputChange(e, "text", 'vrednost')}
                            />
                        </div>                        
                        <div className="field col-12 md:col-6">
                            <label htmlFor="limitirano">{translations[selectedLanguage].Limit}</label>
                            <InputText id="limitirano"
                                value={ticPrivilege.limitirano} onChange={(e) => onInputChange(e, "text", 'limitirano')}
                            />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="domen">{translations[selectedLanguage].domen}</label>
                            <Dropdown id="domen"
                                value={dropdownDomenItem}
                                options={dropdownDomenItems}
                                onChange={(e) => onInputChange(e, "options", 'domen')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticPrivilege.domen })}
                            />
                            {submitted && !ticPrivilege.domen && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>                    
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="uslov">{translations[selectedLanguage].uslov}</label>
                            <Dropdown id="uslov"
                                value={dropdownUslovItem}
                                options={dropdownUslovItems}
                                onChange={(e) => onInputChange(e, "options", 'uslov')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticPrivilege.uslov })}
                            />
                            {submitted && !ticPrivilege.uslov && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                                className={classNames({ 'p-invalid': submitted && !ticPrivilege.valid })}
                            />
                            {submitted && !ticPrivilege.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.privilegeTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.privilegeTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.privilegeTip !== 'CREATE') ? (
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
                inTicPrivilege="delete"
                item={ticPrivilege.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicPrivilege;
