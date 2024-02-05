import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicEventlinkService } from "../../service/model/TicEventlinkService";
import { TicEventService } from "../../service/model/TicEventService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';

const TicEventlink = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticEventlink, setTicEventlink] = useState(props.ticEventlink);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicEventlinkItem, setDdTicEventlinkItem] = useState(null);
    const [ddTicEventlinkItems, setDdTicEventlinkItems] = useState(null);
    const [ticEventlinkItem, setTicEventlinkItem] = useState(null);
    const [ticEventlinkItems, setTicEventlinkItems] = useState(null);

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticEventService = new TicEventService();
                const data = await ticEventService.getTicEvents();

                setTicEventlinkItems(data)
                //console.log("******************", ticEventlinkItem)

                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicEventlinkItems(dataDD);
                setDdTicEventlinkItem(dataDD.find((item) => item.code === props.ticEventlink.event1) || null);
                if (props.ticEventlink.event1) {
                    const foundItem = data.find((item) => item.id === props.ticEventlink.event1);
                    setTicEventlinkItem(foundItem || null);
                    ticEventlink.begda = foundItem.begda
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
            setSubmitted(true);

            const ticEventlinkService = new TicEventlinkService();
            const data = await ticEventlinkService.postTicEventlink(ticEventlink);
            ticEventlink.id = data
            props.handleDialogClose({ obj: ticEventlink, eventlinkTip: props.eventlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            const ticEventlinkService = new TicEventlinkService();

            await ticEventlinkService.putTicEventlink(ticEventlink);
            props.handleDialogClose({ obj: ticEventlink, eventlinkTip: props.eventlinkTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventlink ",
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
            const ticEventlinkService = new TicEventlinkService();
            await ticEventlinkService.deleteTicEventlink(ticEventlink);
            props.handleDialogClose({ obj: ticEventlink, eventlinkTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "TicEventlink ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const   onInputChange = (e, type, name, a) => {
        let val = ''

        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            setDdTicEventlinkItem(e.value);
            const foundItem = ticEventlinkItems.find((item) => item.id === val);
            setTicEventlinkItem(foundItem || null);
            ticEventlink.text = e.value.name
            ticEventlink.code = foundItem.code
            ticEventlink.begda = foundItem.begda                        
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticEventlink = { ...ticEventlink };
        _ticEventlink[`${name}`] = val;

        setTicEventlink(_ticEventlink);
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
                            <label htmlFor="event1">{translations[selectedLanguage].Event} *</label>
                            <Dropdown id="event1"
                                value={ddTicEventlinkItem}
                                options={ddTicEventlinkItems}
                                onChange={(e) => onInputChange(e, "options", 'event1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticEventlink.event1 })}
                            />
                            {submitted && !ticEventlink.event1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-11">
                            <label htmlFor="value">{translations[selectedLanguage].Note} *</label>
                            <InputText
                                id="note"
                                value={ticEventlink.note} onChange={(e) => onInputChange(e, "text", 'note')}
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
                            {(props.eventlinkTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.eventlinkTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.eventlinkTip !== 'CREATE') ? (
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
                inTicEventlink="delete"
                item={ticEventlink.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default TicEventlink;
