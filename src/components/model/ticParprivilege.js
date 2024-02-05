import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicParprivilegeService } from "../../service/model/TicParprivilegeService";
import { CmnParService } from "../../service/model/cmn/CmnParService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicParprivilege = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticParprivilege, setTicParprivilege] = useState(props.ticParprivilege);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicPrivilege, setDdTicPrivilege] = useState(null);
    const [ddTicPrivileges, setDdTicPrivileges] = useState(null);
    const [ticPrivilegeItem, setTicPrivilegeItem] = useState(null);
    const [ticPrivilegeItems, setTicPrivilegeItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticParprivilege.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticParprivilege.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticParprivilegeService = new TicParprivilegeService();
                const data = await ticParprivilegeService.getTicPrivileges();

                setTicPrivilegeItems(data)
                //console.log("******************", ticPrivilegeItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicPrivileges(dataDD);
                setDdTicPrivilege(dataDD.find((item) => item.code === props.ticParprivilege.privilege) || null);
                if (props.ticParprivilege.privilege) {
                    const foundItem = data.find((item) => item.id === props.ticParprivilege.privilege);
                    setTicPrivilegeItem(foundItem || null);
                    ticParprivilege.cprivilege = foundItem.code
                    ticParprivilege.nprivilege = foundItem.textx
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
            ticParprivilege.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticParprivilege.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticParprivilegeService = new TicParprivilegeService();
            const data = await ticParprivilegeService.postTicParprivilege(ticParprivilege);
            ticParprivilege.id = data
            props.handleDialogClose({ obj: ticParprivilege, parprivilegeTip: props.parprivilegeTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicParprivilege ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticParprivilege.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticParprivilege.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const ticParprivilegeService = new TicParprivilegeService();

            await ticParprivilegeService.putTicParprivilege(ticParprivilege);
            props.handleDialogClose({ obj: ticParprivilege, parprivilegeTip: props.parprivilegeTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicParprivilege ",
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
            const ticParprivilegeService = new TicParprivilegeService();
            await ticParprivilegeService.deleteTicParprivilege(ticParprivilege);
            props.handleDialogClose({ obj: ticParprivilege, parprivilegeTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicParprivilege ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicPrivilege(e.value);
            const foundItem = ticPrivilegeItems.find((item) => item.id === val);
            setTicPrivilegeItem(foundItem || null);
            ticParprivilege.nprivilege = e.value.name
            ticParprivilege.cprivilege = foundItem.code
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //ticParprivilege.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //ticParprivilege.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticParprivilege = { ...ticParprivilege };
        _ticParprivilege[`${name}`] = val;
        setTicParprivilege(_ticParprivilege);
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
                            <label htmlFor="privilege">{translations[selectedLanguage].Privilege} *</label>
                            <Dropdown id="privilege"
                                value={ddTicPrivilege}
                                options={ddTicPrivileges}
                                onChange={(e) => onInputChange(e, "options", 'privilege')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticParprivilege.privilege })}
                            />
                            {submitted && !ticParprivilege.privilege && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="maxprc">{translations[selectedLanguage].maxprc}</label>
                            <InputText
                                id="maxprc"
                                value={ticParprivilege.maxprc} onChange={(e) => onInputChange(e, "text", 'maxprc')}
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="maxval">{translations[selectedLanguage].maxval}</label>
                            <InputText
                                id="maxval"
                                value={ticParprivilege.maxval} onChange={(e) => onInputChange(e, "text", 'maxval')}
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
                            {(props.parprivilegeTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.parprivilegeTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.parprivilegeTip !== 'CREATE') ? (
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
                inTicParprivilege="delete"
                item={ticParprivilege.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicParprivilege;
