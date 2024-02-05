import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicArtlocService } from "../../service/model/TicArtlocService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicArtloc = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticArtloc, setTicArtloc] = useState(props.ticArtloc);
    const [submitted, setSubmitted] = useState(false);
    const [ddCmnLoc, setDdCmnLocItem] = useState(null);
    const [ddCmnLocs, setDdCmnLocItems] = useState(null);
    const [cmnLocItem, setCmnLocItem] = useState(null);
    const [cmnLocItems, setCmnLocItems] = useState(null);   
    
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticArtloc.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticArtloc.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {               
                const ticArtlocService = new TicArtlocService();
                const data = await ticArtlocService.getCmnLocs();
                setCmnLocItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnLocItems(dataDD);
                setDdCmnLocItem(dataDD.find((item) => item.code === props.ticArtloc.loc) || null);
                if (props.ticArtloc.loc) {
                    const foundItem = data.find((item) => item.id === props.ticArtloc.loc);
                    setCmnLocItem(foundItem || null);
                    ticArtloc.cloc = foundItem.code
                    ticArtloc.nloc = foundItem.textx
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
            ticArtloc.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticArtloc.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticArtlocService = new TicArtlocService();
            const data = await ticArtlocService.postTicArtloc(ticArtloc);
            ticArtloc.id = data
            props.handleDialogClose({ obj: ticArtloc, artlocTip: props.artlocTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicArtloc ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticArtloc.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticArtloc.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const ticArtlocService = new TicArtlocService();

            await ticArtlocService.putTicArtloc(ticArtloc);
            props.handleDialogClose({ obj: ticArtloc, artlocTip: props.artlocTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicArtloc ",
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
            const ticArtlocService = new TicArtlocService();
            await ticArtlocService.deleteTicArtloc(ticArtloc);
            props.handleDialogClose({ obj: ticArtloc, artlocTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicArtloc ",
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
                if (name == "loc") {
                    setDdCmnLocItem(e.value);
                    const foundItem = cmnLocItems.find((item) => item.id === val);
                    setCmnLocItem(foundItem || null);
                    ticArtloc.nloc = e.value.name
                    ticArtloc.cloc = foundItem.code
                }
            }                
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            //console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //ticArtloc.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //ticArtloc.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticArtloc = { ...ticArtloc };
        _ticArtloc[`${name}`] = val;
        setTicArtloc(_ticArtloc);
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
                                value={props.ticArt.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.ticArt.text}
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
                            <label htmlFor="loc">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="loc"
                                value={ddCmnLoc}
                                options={ddCmnLocs}
                                onChange={(e) => onInputChange(e, "options", 'loc')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArtloc.loc })}
                            />
                            {submitted && !ticArtloc.loc && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.artlocTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.artlocTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.artlocTip !== 'CREATE') ? (
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
                inTicArtloc="delete"
                item={ticArtloc.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicArtloc;
