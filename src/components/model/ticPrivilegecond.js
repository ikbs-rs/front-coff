import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicPrivilegecondService } from "../../service/model/TicPrivilegecondService";
import { TicCondtpService } from "../../service/model/TicCondtpService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicPrivilegecond = (props) => {
console.log(props, "*-*-*-*-*-*-*-*-*-*-*-TicPrivilegecond*-*-*-*-*-*-*-*-*-")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticPrivilegecond, setTicPrivilegecond] = useState(props.ticPrivilegecond);
    const [submitted, setSubmitted] = useState(false);

    const [ddTicBegcondtpItem, setDdTicBegcondtpItem] = useState(null);
    const [ddTicBegcondtpItems, setDdTicBegcondtpItems] = useState(null);
    const [ticBegcondtpItem, setTicBegcondtpItem] = useState(null);
    const [ticBegcondtpItems, setTicBegcondtpItems] = useState(null);
    const [ddTicEndcondtpItem, setDdTicEndcondtpItem] = useState(null);
    const [ddTicEndcondtpItems, setDdTicEndcondtpItems] = useState(null);
    const [ticEndcondtpItem, setTicEndcondtpItem] = useState(null);
    const [ticEndcondtpItems, setTicEndcondtpItems] = useState(null);
    
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticPrivilegecond.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticPrivilegecond.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticCondtpService = new TicCondtpService();
                const data = await ticCondtpService.getTicCondtps();

                setTicBegcondtpItems(data)
                console.log(props.ticPrivilegecond.begcondtp, "********data**********", data)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicBegcondtpItems(dataDD);
                setDdTicBegcondtpItem(dataDD.find((item) => item.code === props.ticPrivilegecond.begcondtp) || null);
                if (props.ticPrivilegecond.begcondtp) {
                    const foundItem = data.find((item) => item.id === props.ticPrivilegecond.begcondtp);
                    setTicBegcondtpItem(foundItem || null);
                    ticPrivilegecond.cbegcondtp = foundItem.code
                    ticPrivilegecond.nbegcondtp = foundItem.textx
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
                const ticCondtpService = new TicCondtpService();
                const data = await ticCondtpService.getTicCondtps();

                setTicEndcondtpItems(data)
                console.log(props.ticPrivilegecond.endcondtp, "********data**********", data)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEndcondtpItems(dataDD);
                setDdTicEndcondtpItem(dataDD.find((item) => item.code === props.ticPrivilegecond.endcondtp) || null);
                if (props.ticPrivilegecond.endcondtp) {
                    const foundItem = data.find((item) => item.id === props.ticPrivilegecond.endcondtp);
                    setTicEndcondtpItem(foundItem || null);
                    ticPrivilegecond.cendcondtp = foundItem.code
                    ticPrivilegecond.nendcondtp = foundItem.textx
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
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticPrivilegecond.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticPrivilegecond.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticPrivilegecondService = new TicPrivilegecondService();
            const data = await ticPrivilegecondService.postTicPrivilegecond(ticPrivilegecond);
            ticPrivilegecond.id = data
            props.handleDialogClose({ obj: ticPrivilegecond, privilegecondTip: props.privilegecondTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegecond ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticPrivilegecond.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticPrivilegecond.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticPrivilegecondService = new TicPrivilegecondService();

            await ticPrivilegecondService.putTicPrivilegecond(ticPrivilegecond);
            props.handleDialogClose({ obj: ticPrivilegecond, privilegecondTip: props.privilegecondTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegecond ",
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
            const ticPrivilegecondService = new TicPrivilegecondService();
            await ticPrivilegecondService.deleteTicPrivilegecond(ticPrivilegecond);
            props.handleDialogClose({ obj: ticPrivilegecond, privilegecondTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegecond ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''
        let foundItem = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            switch (name) {
                case "begcondtp":            
                    setDdTicBegcondtpItem(e.value);
                    foundItem = ticBegcondtpItems.find((item) => item.id === val);
                    setTicBegcondtpItem(foundItem || null);
                    ticPrivilegecond.nbegcondtp = e.value.name
                    ticPrivilegecond.cbegcondtp = foundItem.code
                    break;
                case "endcondtp":            
                    setDdTicEndcondtpItem(e.value);
                    foundItem = ticEndcondtpItems.find((item) => item.id === val);
                    setTicEndcondtpItem(foundItem || null);
                    ticPrivilegecond.nendcondtp = e.value.name
                    ticPrivilegecond.cendcondtp = foundItem.code
                    break;                    
            default:
                console.error("Pogresan naziv polja")
        }            
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            //console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //ticPrivilegecond.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //ticPrivilegecond.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        //console.log(ticPrivilegecond, "*****************ticPrivilegecond******************")
        let _ticPrivilegecond = { ...ticPrivilegecond };
        _ticPrivilegecond[`${name}`] = val;
        console.log(ticPrivilegecond, "*****************_ticPrivilegecond******************")
        setTicPrivilegecond(_ticPrivilegecond);
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
                            <InputText id="code"
                                value={props.ticPrivilege.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.ticPrivilege.text}
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="begcondtp">{translations[selectedLanguage].Nbegcond} *</label>
                            <Dropdown id="begcondtp" autoFocus
                                value={ddTicBegcondtpItem}
                                options={ddTicBegcondtpItems}
                                onChange={(e) => onInputChange(e, "options", 'begcondtp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticPrivilegecond.begcondtp })}
                            />
                            {submitted && !ticPrivilegecond.begcondtp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="begvalue">{translations[selectedLanguage].Begvalue}</label>
                            <InputText id="begvalue" 
                                value={ticPrivilegecond.begvalue} onChange={(e) => onInputChange(e, "text", 'begvalue')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticPrivilegecond.begvalue })}
                            />
                            {submitted && !ticPrivilegecond.begvalue && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-7">
                            <label htmlFor="endcondtp">{translations[selectedLanguage].Nendcond} *</label>
                            <Dropdown id="endcondtp" autoFocus
                                value={ddTicEndcondtpItem}
                                options={ddTicEndcondtpItems}
                                onChange={(e) => onInputChange(e, "options", 'endcondtp')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticPrivilegecond.endcondtp })}
                            />
                            {submitted && !ticPrivilegecond.endcondtp && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="endvalue">{translations[selectedLanguage].Endvalue}</label>
                            <InputText id="endvalue" 
                                value={ticPrivilegecond.endvalue} onChange={(e) => onInputChange(e, "text", 'endvalue')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticPrivilegecond.endvalue })}
                            />
                            {submitted && !ticPrivilegecond.endvalue && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>                    
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
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
                        <div className="field col-12 md:col-5">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar
                                value={endda}
                                onChange={(e) => onInputChange(e, "Calendar", 'endda')}
                                showIcon
                                dateFormat="dd.mm.yy"
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
                            {(props.privilegecondTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.privilegecondTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.privilegecondTip !== 'CREATE') ? (
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
                inTicPrivilegecond="delete"
                item={ticPrivilegecond.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicPrivilegecond;
