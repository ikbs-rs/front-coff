import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnParattsService } from "../../../service/model/cmn/CmnParattsService";
import { CmnParattService } from "../../../service/model/cmn/CmnParattService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../../dialog/DeleteDialog';
import { translations } from "../../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../../utilities/DateFunction"

const CmnParatts = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnParatts, setCmnParatts] = useState(props.cmnParatts);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnParattsItem, setDdCmnParattsItem] = useState(null);
    const [ddCmnParattsItems, setDdCmnParattsItems] = useState(null);
    const [cmnParattsItem, setCmnParattsItem] = useState(null);
    const [cmnParattsItems, setCmnParattsItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnParatts.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnParatts.endda || '99991231')))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnParattService = new CmnParattService();
                const data = await cmnParattService.getCmnParatts();

                setCmnParattsItems(data)
                //console.log("******************", cmnParattsItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnParattsItems(dataDD);
                setDdCmnParattsItem(dataDD.find((item) => item.code === props.cmnParatts.att) || null);
                if (props.cmnParatts.att) {
                    const foundItem = data.find((item) => item.id === props.cmnParatts.att);
                    setCmnParattsItem(foundItem || null);
                    cmnParatts.ctp = foundItem.code
                    cmnParatts.ntp = foundItem.textx
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
            cmnParatts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnParatts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnParattsService = new CmnParattsService();
            const data = await cmnParattsService.postCmnParatts(cmnParatts);
            cmnParatts.id = data
            props.handleDialogClose({ obj: cmnParatts, parattsTip: props.parattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnParatts ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnParatts.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnParatts.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const cmnParattsService = new CmnParattsService();

            await cmnParattsService.putCmnParatts(cmnParatts);
            props.handleDialogClose({ obj: cmnParatts, parattsTip: props.parattsTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnParatts ",
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
            const cmnParattsService = new CmnParattsService();
            await cmnParattsService.deleteCmnParatts(cmnParatts);
            props.handleDialogClose({ obj: cmnParatts, parattsTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnParatts ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnParattsItem(e.value);
            const foundItem = cmnParattsItems.find((item) => item.id === val);
            setCmnParattsItem(foundItem || null);
            cmnParatts.ntp = e.value.name
            cmnParatts.ctp = foundItem.code
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)

            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnParatts.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnParatts.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnParatts = { ...cmnParatts };
        _cmnParatts[`${name}`] = val;
        setCmnParatts(_cmnParatts);
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
                                value={props.cmnPar.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.cmnPar.text}
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
                                value={ddCmnParattsItem}
                                options={ddCmnParattsItems}
                                onChange={(e) => onInputChange(e, "options", 'att')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnParatts.att })}
                            />
                            {submitted && !cmnParatts.att && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="text">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="text"
                                value={cmnParatts.text} onChange={(e) => onInputChange(e, "text", 'text')}
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
                            {(props.parattsTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.parattsTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.parattsTip !== 'CREATE') ? (
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
                inCmnParatts="delete"
                item={cmnParatts.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnParatts;
