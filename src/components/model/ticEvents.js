import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventsService } from "../../service/model/TicEventsService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"
import InputMask from 'react-input-mask';
import { Checkbox } from "primereact/checkbox";


const TicEvents = (props) => {
  
    let i = 0
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEvents, setTicEvents] = useState(props.ticEvents);

    const [onlineChecked, setOnlineChecked] = useState();
    const [cashChecked, setCashChecked] = useState();
    const [deliveryChecked, setDeliveryChecked] = useState();
    const [presaleChecked, setPresaleChecked] = useState();
    const [submitted, setSubmitted] = useState(false);
    const [eventsTip, setEventsTip] = useState(props.eventsTip);
    //console.log(props.eventsTip,"####################.......#################### ", ticEvents )

    const toast = useRef(null);

    useEffect(() => {
            setTicEvents(props.ticEvents);
            setOnlineChecked(props.ticEvents.online_payment==1)
            setCashChecked(props.ticEvents.cash_payment==1)
            setDeliveryChecked(props.ticEvents.delivery_payment==1)
            setPresaleChecked(props.ticEvents.presale_enabled==1)
            //console.log(eventsTip, "*-*-*-*-2222222*-*-*-*", props.eventsTip)
      }, [props.ticEvents, eventsTip]);

    const handleCancelClick = () => {
        props.setVisible(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            ticEvents.id = props.ticEvent.id
            const ticEventsService = new TicEventsService();
            const data = await ticEventsService.postTicEvents(ticEvents);
            ticEvents.id = data.items
            //setEventsTip(true)
            props.updateEventsTip(true);
            //props.handleDialogClose({ obj: ticEvents, eventsTip: props.eventsTip });
            //props.setVisible(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: `${data.message}.`, life: 3000 });
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const ticEventsService = new TicEventsService();
            const data = await ticEventsService.putTicEvents(ticEvents);
            props.updateEventsTip(true);
            //props.handleDialogClose({ obj: ticEvents, eventsTip: props.eventsTip });
            //props.setVisible(false);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: `${data.message}.`, life: 3000 });
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
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
            const ticEventsService = new TicEventsService();
            const data = await ticEventsService.deleteTicEvents(ticEvents);
            props.updateEventsTip(false);
            ///props.handleDialogClose({ obj: ticEvents, eventsTip: 'DELETE' });
            //props.setVisible(false);
            hideDeleteDialog();
            toast.current.show({ severity: 'success', summary: 'Successful', detail: `${data.message}.`, life: 3000 });
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        let val = ''
        if (type === "checkbox") {
            val = e.checked ? 1: 0
            switch (name) {
                case "online_payment":
                    setOnlineChecked(e.checked)
                    ticEvents.online_payment = val
                    break;
                case "cash_payment":
                    setCashChecked(e.checked)
                    ticEvents.cash_payment = val
                    break;
                case "delivery_payment":
                    setDeliveryChecked(e.checked)
                    ticEvents.delivery_payment = val
                    break;
                case "presale_enabled":
                    setPresaleChecked(e.checked)
                    ticEvents.presale_enabled = val
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
        } else {
            val = (e.target && e.target.value) || '';
        }

        let _ticEvents = { ...ticEvents };
        _ticEvents[`${name}`] = val;
        if (name === `textx`) _ticEvents[`text`] = val

        setTicEvents(_ticEvents);
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
                        <div className="field col-6 md:col-2">
                            <label htmlFor="selection_duration">{translations[selectedLanguage].selection_duration}</label>
                            <InputText
                                id="selection_duration"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEvents.selection_duration)} onChange={(e) => onInputChange(e, "text", 'selection_duration')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvents.selection_duration })}
                            />
                            {submitted && !ticEvents.selection_duration && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-1"></div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="payment_duration">{translations[selectedLanguage].payment_duration}</label>
                            <InputText
                                id="payment_duration"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEvents.payment_duration)} onChange={(e) => onInputChange(e, "text", 'payment_duration')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvents.payment_duration })}
                            />
                            {submitted && !ticEvents.payment_duration && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-1"></div>
                        <div className="field col-12 md:col-2">
                            <label htmlFor="booking_duration">{translations[selectedLanguage].booking_duration}</label>
                            <InputText
                                id="booking_duration"
                                mask="99:99"
                                maskChar="0" // This will replace unfilled characters with '0'
                                placeholder="HH:mm"
                                value={DateFunction.convertTimeToDisplayFormat(ticEvents.booking_duration)} onChange={(e) => onInputChange(e, "text", 'booking_duration')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvents.booking_duration })}
                            />
                            {submitted && !ticEvents.booking_duration && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-1"></div>

                        <div className="field col-12 md:col-2">
                            <label htmlFor="max_ticket">{translations[selectedLanguage].max_ticket}</label>
                            <InputText id="max_ticket" 
                                value={ticEvents.max_ticket} onChange={(e) => onInputChange(e, "text", 'max_ticket')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticEvents.max_ticket })}
                            />
                            {submitted && !ticEvents.max_ticket && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-3">
                            <label className="flex justify-content-center" htmlFor="max_ticket">{translations[selectedLanguage].online_payment}</label>
                            <div className="flex justify-content-center">
                                <Checkbox
                                    onChange={(e) => onInputChange(e, "checkbox", 'online_payment')}
                                    checked={onlineChecked}
                                ></Checkbox>
                            </div>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="flex justify-content-center" htmlFor="max_ticket">{translations[selectedLanguage].cash_payment}</label>
                            <div className="flex justify-content-center">
                                <Checkbox
                                    onChange={(e) => onInputChange(e, "checkbox", 'cash_payment')}
                                    checked={cashChecked}
                                ></Checkbox>
                            </div>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="flex justify-content-center" htmlFor="max_ticket">{translations[selectedLanguage].delivery_payment}</label>
                            <div className="flex justify-content-center">
                                <Checkbox
                                    onChange={(e) => onInputChange(e, "checkbox", 'delivery_payment')}
                                    checked={deliveryChecked}
                                ></Checkbox>
                            </div>
                        </div>
                        <div className="field col-12 md:col-3">
                            <label className="flex justify-content-center" htmlFor="max_ticket">{translations[selectedLanguage].presale_enabled}</label>
                            <div className="flex justify-content-center">
                                <Checkbox
                                    onChange={(e) => onInputChange(e, "checkbox", 'presale_enabled')}
                                    checked={presaleChecked}
                                ></Checkbox>
                            </div>
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
                            {(!props.eventsTip) ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.eventsTip) ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventsTip) ? (
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
                inAction="delete"
                item={ticEvents.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEvents;
