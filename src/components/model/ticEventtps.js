import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventtpsService } from "../../service/model/TicEventtpsService";
import { TicEventattService } from "../../service/model/TicEventattService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicEventtps = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventtps, setTicEventtps] = useState(props.ticEventtps);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicEventatt, setDdTicEventattItem] = useState(null);
    const [ddTicEventatts, setDdTicEventattItems] = useState(null);
    const [ticEventtattItem, setTicEventattItem] = useState(null);
    const [ticEventtattItems, setTicEventattItems] = useState(null);   
    
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticEventtps.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticEventtps.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        
        async function fetchData() {
            
            try {               
                const ticEventattService = new TicEventattService();
                const data = await ticEventattService.getTicEventatts();

                setTicEventattItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventattItems(dataDD);
                setDdTicEventattItem(dataDD.find((item) => item.code === props.ticEventtps.att) || null);
                if (props.ticEventtps.att) {
                    const foundItem = data.find((item) => item.id === props.ticEventtps.att);
                    setTicEventattItem(foundItem || null);
                    ticEventtps.ctp = foundItem.code
                    ticEventtps.ntp = foundItem.textx
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
            ticEventtps.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventtps.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticEventtpsService = new TicEventtpsService();
            const data = await ticEventtpsService.postTicEventtps(ticEventtps);
            ticEventtps.id = data
            props.handleDialogClose({ obj: ticEventtps, eventtpsTip: props.eventtpsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventtps ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEventtps.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticEventtps.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const ticEventtpsService = new TicEventtpsService();

            await ticEventtpsService.putTicEventtps(ticEventtps);
            props.handleDialogClose({ obj: ticEventtps, eventtpsTip: props.eventtpsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventtps ",
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
            const ticEventtpsService = new TicEventtpsService();
            await ticEventtpsService.deleteTicEventtps(ticEventtps);
            props.handleDialogClose({ obj: ticEventtps, eventtpsTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventtps ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (type === "options") {
                if (name == "att") {
                    setDdTicEventattItem(e.value);
                    const foundItem = ticEventtattItems.find((item) => item.id === val);
                    setTicEventattItem(foundItem || null);
                    ticEventtps.natt = e.value.name
                    ticEventtps.catt = foundItem.code
                }
            }                
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            //console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //ticEventtps.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //ticEventtps.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticEventtps = { ...ticEventtps };
        _ticEventtps[`${name}`] = val;
        setTicEventtps(_ticEventtps);
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
                                value={props.ticEventtp.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.ticEventtp.text}
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
                            <label htmlFor="att">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="att"
                                value={ddTicEventatt}
                                options={ddTicEventatts}
                                onChange={(e) => onInputChange(e, "options", 'att')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventtps.att })}
                            />
                            {submitted && !ticEventtps.att && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                        
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="value">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="value"
                                value={ticEventtps.value} onChange={(e) => onInputChange(e, "text", 'value')}
                            />
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
                            {(props.eventtpsTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.eventtpsTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventtpsTip !== 'CREATE') ? (
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
                inTicEventtps="delete"
                item={ticEventtps.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventtps;
