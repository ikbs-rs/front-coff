import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventagendaService } from "../../service/model/TicEventagendaService";
import { TicAgendaService } from "../../service/model/TicAgendaService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from "primereact/calendar";
import DateFunction from "../../utilities/DateFunction"

const TicEventagenda = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventagenda, setTicEventagenda] = useState(props.ticEventagenda);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicEventagendaItem, setDdTicEventagendaItem] = useState(null);
    const [ddTicEventagendaItems, setDdTicEventagendaItems] = useState(null);
    const [ticEventagendaItem, setTicEventagendaItem] = useState(null);
    const [ticEventagendaItems, setTicEventagendaItems] = useState(null);
    const [date, setDate] = useState(new Date(DateFunction.formatJsDate(props.ticEventagenda.date || props.ticEvent.begda)));

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticAgendaService = new TicAgendaService();
                const data = await ticAgendaService.getTicAgendas();

                setTicEventagendaItems(data)
                //console.log("******************", ticEventagendaItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventagendaItems(dataDD);
                setDdTicEventagendaItem(dataDD.find((item) => item.code === props.ticEventagenda.agenda) || null);
                    const foundItem = data.find((item) => item.id === props.ticEventagenda.agenda);
                    setTicEventagendaItem(foundItem || null);
                    ticEventagenda.code = foundItem.code
                    ticEventagenda.text = foundItem.textx

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
            ticEventagenda.date = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(date));
            //ticEventagenda.begtm = DateFunction.convertTimeToDBFormat(ticEventagenda.begtm)
            const ticEventagendaService = new TicEventagendaService();
            const data = await ticEventagendaService.postTicEventagenda(ticEventagenda);
            ticEventagenda.id = data
            props.handleDialogClose({ obj: ticEventagenda, eventagendaTip: props.eventagendaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventagenda ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticEventagenda.date = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(date));
            const ticEventagendaService = new TicEventagendaService();
            await ticEventagendaService.putTicEventagenda(ticEventagenda);
            props.handleDialogClose({ obj: ticEventagenda, eventagendaTip: props.eventagendaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventagenda ",
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
            const ticEventagendaService = new TicEventagendaService();
            await ticEventagendaService.deleteTicEventagenda(ticEventagenda);
            props.handleDialogClose({ obj: ticEventagenda, eventagendaTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventagenda ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicEventagendaItem(e.value);
            const foundItem = ticEventagendaItems.find((item) => item.id === val);
            setTicEventagendaItem(foundItem || null);
            ticEventagenda.text = e.value.name
            ticEventagenda.code = foundItem.code
            ticEventagenda.begtm = foundItem.begtm
            ticEventagenda.endtm = foundItem.endtm
        } else if (type === "Calendar") {
            const dateVal = DateFunction.dateGetValue(e.value)
            console.log(dateVal, "***********************************")
            val = (e.target && e.target.value) || '';
            switch (name) {
                case "date":
                    setDate(e.value)
                    //ticEventagenda.date = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticEventagenda = { ...ticEventagenda };
        _ticEventagenda[`${name}`] = val;

        setTicEventagenda(_ticEventagenda);
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
                                value={props.ticEvent.code}
                                disabled={true}
                            />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={props.ticEvent.text}
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
                            <label htmlFor="agenda">{translations[selectedLanguage].Agenda} *</label>
                            <Dropdown id="agenda"
                                value={ddTicEventagendaItem}
                                options={ddTicEventagendaItems}
                                onChange={(e) => onInputChange(e, "options", 'agenda')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventagenda.agenda })}
                            />
                            {submitted && !ticEventagenda.agenda && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="date">{translations[selectedLanguage].Date} *</label>
                            <Calendar
                                value={date}
                                onChange={(e) => onInputChange(e, "Calendar", 'date', this)}
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
                            {(props.eventagendaTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.eventagendaTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventagendaTip !== 'CREATE') ? (
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
                inTicEventagenda="delete"
                item={ticEventagenda.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventagenda;
