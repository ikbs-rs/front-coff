import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicPrivilegelinkService } from "../../service/model/TicPrivilegelinkService";
import { TicPrivilegeService } from "../../service/model/TicPrivilegeService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicPrivilegelink = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticPrivilegelink, setTicPrivilegelink] = useState(props.ticPrivilegelink);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicPrivilegelinkItem, setDdTicPrivilegelinkItem] = useState(null);
    const [ddTicPrivilegelinkItems, setDdTicPrivilegelinkItems] = useState(null);
    const [ticPrivilegelinkItem, setTicPrivilegelinkItem] = useState(null);
    const [ticPrivilegelinkItems, setTicPrivilegelinkItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticPrivilegelink.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticPrivilegelink.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticPrivilegeService = new TicPrivilegeService();
                const data = await ticPrivilegeService.getTicPrivileges();

                setTicPrivilegelinkItems(data)
                console.log(props.ticPrivilegelink.privilege1, "********data**********", data)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicPrivilegelinkItems(dataDD);
                setDdTicPrivilegelinkItem(dataDD.find((item) => item.code === props.ticPrivilegelink.privilege1) || null);
                if (props.ticPrivilegelink.privilege1) {
                    const foundItem = data.find((item) => item.id === props.ticPrivilegelink.privilege1);
                    setTicPrivilegelinkItem(foundItem || null);
                    ticPrivilegelink.cprivilege = foundItem.code
                    ticPrivilegelink.nprivilege = foundItem.textx
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
            ticPrivilegelink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticPrivilegelink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticPrivilegelinkService = new TicPrivilegelinkService();
            const data = await ticPrivilegelinkService.postTicPrivilegelink(ticPrivilegelink);
            ticPrivilegelink.id = data
            props.handleDialogClose({ obj: ticPrivilegelink, privilegelinkTip: props.privilegelinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegelink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticPrivilegelink.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticPrivilegelink.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));            
            const ticPrivilegelinkService = new TicPrivilegelinkService();

            await ticPrivilegelinkService.putTicPrivilegelink(ticPrivilegelink);
            props.handleDialogClose({ obj: ticPrivilegelink, privilegelinkTip: props.privilegelinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegelink ",
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
            const ticPrivilegelinkService = new TicPrivilegelinkService();
            await ticPrivilegelinkService.deleteTicPrivilegelink(ticPrivilegelink);
            props.handleDialogClose({ obj: ticPrivilegelink, privilegelinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegelink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicPrivilegelinkItem(e.value);
            const foundItem = ticPrivilegelinkItems.find((item) => item.id === val);
            setTicPrivilegelinkItem(foundItem || null);
            ticPrivilegelink.nprivilege = e.value.name
            ticPrivilegelink.cprivilege = foundItem.code
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            //console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //ticPrivilegelink.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //ticPrivilegelink.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        console.log(ticPrivilegelink, "*****************ticPrivilegelink******************")
        let _ticPrivilegelink = { ...ticPrivilegelink };
        _ticPrivilegelink[`${name}`] = val;
        console.log(ticPrivilegelink, "*****************_ticPrivilegelink******************")
        setTicPrivilegelink(_ticPrivilegelink);
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
                            <label htmlFor="privilege1">{translations[selectedLanguage].privilege} *</label>
                            <Dropdown id="privilege1"
                                value={ddTicPrivilegelinkItem}
                                options={ddTicPrivilegelinkItems}
                                onChange={(e) => onInputChange(e, "options", 'privilege1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticPrivilegelink.privilege1 })}
                            />
                            {submitted && !ticPrivilegelink.privilege1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.privilegelinkTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.privilegelinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.privilegelinkTip !== 'CREATE') ? (
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
                inTicPrivilegelink="delete"
                item={ticPrivilegelink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicPrivilegelink;
