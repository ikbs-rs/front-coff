import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicPrivilegediscountService } from "../../service/model/TicPrivilegediscountService";
import { TicDiscountService } from "../../service/model/TicDiscountService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicPrivilegediscount = (props) => {
console.log(props, "*-*-*-*-*-*-*-*-*-*-*-TicPrivilegediscount*-*-*-*-*-*-*-*-*-")
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticPrivilegediscount, setTicPrivilegediscount] = useState(props.ticPrivilegediscount);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicPrivilegediscountItem, setDdTicPrivilegediscountItem] = useState(null);
    const [ddTicPrivilegediscountItems, setDdTicPrivilegediscountItems] = useState(null);
    const [ticPrivilegediscountItem, setTicPrivilegediscountItem] = useState(null);
    const [ticPrivilegediscountItems, setTicPrivilegediscountItems] = useState(null);
    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticPrivilegediscount.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticPrivilegediscount.endda || DateFunction.currDate())))

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticDiscountService = new TicDiscountService();
                const data = await ticDiscountService.getTicDiscounts();

                setTicPrivilegediscountItems(data)
                console.log(props.ticPrivilegediscount.discount, "********data**********", data)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicPrivilegediscountItems(dataDD);
                setDdTicPrivilegediscountItem(dataDD.find((item) => item.code === props.ticPrivilegediscount.discount) || null);
                if (props.ticPrivilegediscount.discount) {
                    const foundItem = data.find((item) => item.id === props.ticPrivilegediscount.discount);
                    setTicPrivilegediscountItem(foundItem || null);
                    ticPrivilegediscount.cdiscount = foundItem.code
                    ticPrivilegediscount.ndiscount = foundItem.textx
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
            ticPrivilegediscount.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticPrivilegediscount.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticPrivilegediscountService = new TicPrivilegediscountService();
            const data = await ticPrivilegediscountService.postTicPrivilegediscount(ticPrivilegediscount);
            ticPrivilegediscount.id = data
            props.handleDialogClose({ obj: ticPrivilegediscount, privilegediscountTip: props.privilegediscountTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegediscount ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticPrivilegediscount.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticPrivilegediscount.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticPrivilegediscountService = new TicPrivilegediscountService();

            await ticPrivilegediscountService.putTicPrivilegediscount(ticPrivilegediscount);
            props.handleDialogClose({ obj: ticPrivilegediscount, privilegediscountTip: props.privilegediscountTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegediscount ",
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
            const ticPrivilegediscountService = new TicPrivilegediscountService();
            await ticPrivilegediscountService.deleteTicPrivilegediscount(ticPrivilegediscount);
            props.handleDialogClose({ obj: ticPrivilegediscount, privilegediscountTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicPrivilegediscount ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicPrivilegediscountItem(e.value);
            const foundItem = ticPrivilegediscountItems.find((item) => item.id === val);
            setTicPrivilegediscountItem(foundItem || null);
            ticPrivilegediscount.ndiscount = e.value.name
            ticPrivilegediscount.cdiscount = foundItem.code
        } else if (type === "Calendar") {
            //const dateVal = DateFunction.dateGetValue(e.value)
            //console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "begda":
                    setBegda(e.value)
                    //ticPrivilegediscount.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case "endda":
                    setEndda(e.value)
                    //ticPrivilegediscount.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        //console.log(ticPrivilegediscount, "*****************ticPrivilegediscount******************")
        let _ticPrivilegediscount = { ...ticPrivilegediscount };
        _ticPrivilegediscount[`${name}`] = val;
        console.log(ticPrivilegediscount, "*****************_ticPrivilegediscount******************")
        setTicPrivilegediscount(_ticPrivilegediscount);
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
                            <label htmlFor="discount">{translations[selectedLanguage].discount} *</label>
                            <Dropdown id="discount" autoFocus
                                value={ddTicPrivilegediscountItem}
                                options={ddTicPrivilegediscountItems}
                                onChange={(e) => onInputChange(e, "options", 'discount')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticPrivilegediscount.discount })}
                            />
                            {submitted && !ticPrivilegediscount.discount && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="value">{translations[selectedLanguage].Value}</label>
                            <InputText id="value" 
                                value={ticPrivilegediscount.value} onChange={(e) => onInputChange(e, "text", 'value')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticPrivilegediscount.value })}
                            />
                            {submitted && !ticPrivilegediscount.value && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.privilegediscountTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.privilegediscountTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.privilegediscountTip !== 'CREATE') ? (
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
                inTicPrivilegediscount="delete"
                item={ticPrivilegediscount.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicPrivilegediscount;
