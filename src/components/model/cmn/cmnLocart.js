import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
//import { CmnLocartService } from "../../service/model/CmnLocartService";
import { CmnArtlocService } from "../../../service/model/cmn/CmnArtlocService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../../dialog/DeleteDialog';
import { translations } from "../../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../../utilities/DateFunction"

const CmnLocart = (props) => {
    console.log("Props", props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnLocart, setCmnLocart] = useState(props.cmnLocart);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnLocartItem, setDdCmnLocartItem] = useState(null);
    const [ddCmnLocartItems, setDdCmnLocartItems] = useState(null);
    const [cmnLocartItem, setCmnLocartItem] = useState(null);
    const [cmnLocartItems, setCmnLocartItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnLocart.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnLocart.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnArtlocService = new CmnArtlocService();
                const data = await cmnArtlocService.getTicArt();

                setCmnLocartItems(data)
                //console.log("******************", cmnLocartItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnLocartItems(dataDD);
                setDdCmnLocartItem(dataDD.find((item) => item.code === props.cmnLocart.art) || null);
                if (props.cmnLocart.art) {
                    const foundItem = data.find((item) => item.id === props.cmnLocart.art);
                    setCmnLocartItem(foundItem || null);
                    cmnLocart.cart = foundItem.code
                    cmnLocart.nart = foundItem.textx
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
            cmnLocart.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLocart.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnLocartService = new CmnArtlocService();
            const data = await cmnLocartService.postCmnArtloc(cmnLocart);
            cmnLocart.id = data
            props.handleDialogClose({ obj: cmnLocart, locartTip: props.locartTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocart ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnLocart.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnLocart.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const cmnLocartService = new CmnArtlocService();

            await cmnLocartService.putCmnArtloc(cmnLocart);
            props.handleDialogClose({ obj: cmnLocart, locartTip: props.locartTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocart ",
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
            const cmnLocartService = new CmnArtlocService();
            await cmnLocartService.deleteCmnArtloc(cmnLocart);
            props.handleDialogClose({ obj: cmnLocart, locartTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnLocart ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnLocartItem(e.value);
            const foundItem = cmnLocartItems.find((item) => item.id === val);
            setCmnLocartItem(foundItem || null);
            cmnLocart.nart = e.value.name
            cmnLocart.cart = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnLocart.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnLocart.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        console.log(cmnLocart, "*****************cmnLocart******************")
        let _cmnLocart = { ...cmnLocart };
        _cmnLocart[`${name}`] = val;
        console.log(cmnLocart, "*****************_cmnLocart******************")
        setCmnLocart(_cmnLocart);
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
                                value={props.cmnLoc.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.cmnLoc.text}
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
                            <label htmlFor="art">{translations[selectedLanguage].art} *</label>
                            <Dropdown id="art"
                                value={ddCmnLocartItem}
                                options={ddCmnLocartItems}
                                onChange={(e) => onInputChange(e, "options", 'art')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnLocart.art })}
                            />
                            {submitted && !cmnLocart.art && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.locartTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.locartTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.locartTip !== 'CREATE') ? (
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
                inCmnLocart="delete"
                item={cmnLocart.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnLocart;
