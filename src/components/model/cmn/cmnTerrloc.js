import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
//import { CmnTerrlocService } from "../../service/model/CmnTerrlocService";
import { CmnTerrlocService } from "../../../service/model/cmn/CmnTerrlocService";
import { CmnTerrService } from "../../../service/model/cmn/CmnTerrService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../../dialog/DeleteDialog';
import { translations } from "../../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../../utilities/DateFunction"

const CmnTerrloc = (props) => {
    console.log("Props", props)
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [cmnTerrloc, setCmnTerrloc] = useState(props.cmnTerrloc);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnTerrlocItem, setDdCmnTerrlocItem] = useState(null);
    const [ddCmnTerrlocItems, setDdCmnTerrlocItems] = useState(null);
    const [cmnTerrlocItem, setCmnTerrlocItem] = useState(null);
    const [cmnTerrlocItems, setCmnTerrlocItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.cmnTerrloc.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.cmnTerrloc.endda || '99991231')))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnTerrService = new CmnTerrService();
                const data = await cmnTerrService.getCmnTerrs();

                setCmnTerrlocItems(data)
                //console.log("******************", cmnTerrlocItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnTerrlocItems(dataDD);
                setDdCmnTerrlocItem(dataDD.find((item) => item.code === props.cmnTerrloc.terr) || null);
                if (props.cmnTerrloc.terr) {
                    const foundItem = data.find((item) => item.id === props.cmnTerrloc.terr);
                    setCmnTerrlocItem(foundItem || null);
                    cmnTerrloc.cterr = foundItem.code
                    cmnTerrloc.nterr = foundItem.textx
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
            cmnTerrloc.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTerrloc.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const cmnTerrlocService = new CmnTerrlocService();
            const data = await cmnTerrlocService.postCmnTerrloc(cmnTerrloc);
            cmnTerrloc.id = data
            props.handleDialogClose({ obj: cmnTerrloc, terrlocTip: props.terrlocTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerrloc ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            cmnTerrloc.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            cmnTerrloc.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const cmnTerrlocService = new CmnTerrlocService();

            await cmnTerrlocService.putCmnTerrloc(cmnTerrloc);
            props.handleDialogClose({ obj: cmnTerrloc, terrlocTip: props.terrlocTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerrloc ",
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
            const cmnTerrlocService = new CmnTerrlocService();
            await cmnTerrlocService.deleteCmnTerrloc(cmnTerrloc);
            props.handleDialogClose({ obj: cmnTerrloc, terrlocTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CmnTerrloc ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdCmnTerrlocItem(e.value);
            const foundItem = cmnTerrlocItems.find((item) => item.id === val);
            setCmnTerrlocItem(foundItem || null);
            cmnTerrloc.nterr = e.value.name
            cmnTerrloc.cterr = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //cmnTerrloc.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //cmnTerrloc.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        console.log(cmnTerrloc, "*****************cmnTerrloc******************")
        let _cmnTerrloc = { ...cmnTerrloc };
        _cmnTerrloc[`${name}`] = val;
        console.log(cmnTerrloc, "*****************_cmnTerrloc******************")
        setCmnTerrloc(_cmnTerrloc);
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
                            <label htmlFor="terr">{translations[selectedLanguage].terr} *</label>
                            <Dropdown id="terr"
                                value={ddCmnTerrlocItem}
                                options={ddCmnTerrlocItems}
                                onChange={(e) => onInputChange(e, "options", 'terr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !cmnTerrloc.terr })}
                            />
                            {submitted && !cmnTerrloc.terr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.terrlocTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.terrlocTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.terrlocTip !== 'CREATE') ? (
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
                inCmnTerrloc="delete"
                item={cmnTerrloc.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CmnTerrloc;
