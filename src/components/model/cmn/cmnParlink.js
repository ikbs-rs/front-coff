import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CmnParlinkService } from "../../../service/model/cmn/CmnParlinkService";
import { CmnParService } from "../../../service/model/cmn/CmnParService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../../dialog/DeleteDialog';
import { translations } from "../../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../../utilities/DateFunction"

const CmnParlink = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnParlink, setCmnParlink] = useState(props.cmnParlink);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnParlinkItem, setDdCmnParlinkItem] = useState(null);
    const [ddCmnParlinkItems, setDdCmnParlinkItems] = useState(null);
    const [cmnParlinkItem, setCmnParlinkItem] = useState(null);
    const [cmnParlinkItems, setCmnParlinkItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnParlink.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnParlink.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnParService = new CmnParService();
                const data = await cmnParService.getCmnPars();

                setCmnParlinkItems(data)
                //console.log("******************", cmnParlinkItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnParlinkItems(dataDD);
                setDdCmnParlinkItem(dataDD.find((item) => item.code === props.cmnParlink.par1) || null);
                if (props.cmnParlink.par1) {
                    const foundItem = data.find((item) => item.id === props.cmnParlink.par1);
                    setCmnParlinkItem(foundItem || null);
                    cmnParlink.cpar1 = foundItem.code
                    cmnParlink.npar1 = foundItem.textx
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
            cmnParlink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnParlink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnParlinkService = new CmnParlinkService();
            const data = await cmnParlinkService.postCmnParlink(cmnParlink);
            cmnParlink.id = data
            props.handleDialogClose({ obj: cmnParlink, parlinkTip: props.parlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnParlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnParlink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnParlink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const cmnParlinkService = new CmnParlinkService();

            await cmnParlinkService.putCmnParlink(cmnParlink);
            props.handleDialogClose({ obj: cmnParlink, parlinkTip: props.parlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnParlink ",
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
            const cmnParlinkService = new CmnParlinkService();
            await cmnParlinkService.deleteCmnParlink(cmnParlink);
            props.handleDialogClose({ obj: cmnParlink, parlinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnParlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnParlinkItem(e.value);
            const foundItem = cmnParlinkItems.find((item) => item.id === val);
            setCmnParlinkItem(foundItem || null);
            cmnParlink.npar1 = e.value.name
            cmnParlink.cpar1 = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnParlink.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnParlink.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _cmnParlink = { ...cmnParlink };
        _cmnParlink[`${name}`] = val;
        setCmnParlink(_cmnParlink);
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
                            <label htmlFor="par1">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="par1"
                                value={ddCmnParlinkItem}
                                options={ddCmnParlinkItems}
                                onChange={(e) => onInputChange(e, "options", 'par1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnParlink.par1 })}
                            />
                            {submitted && !cmnParlink.par1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="text">{translations[selectedLanguage].Value}</label>
                            <InputText
                                id="text"
                                value={cmnParlink.text} onChange={(e) => onInputChange(e, "text", 'text')}
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
                            {(props.parlinkTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.parlinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.parlinkTip !== 'CREATE') ? (
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
                inCmnParlink="delete"
                item={cmnParlink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnParlink;
