import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffDocsService } from "../../service/model/CoffDocsService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker } from 'primereact/colorpicker';

const Order = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    
    const toast = useRef(null);
    // const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    // const [ticCena, setCoffDocs] = useState(props.ticCena);
    // const [submitted, setSubmitted] = useState(false);

    // const [dropdownItem, setDropdownItem] = useState(null);
    // const [dropdownItems, setDropdownItems] = useState(null);

    // const calendarRef = useRef(null);

    // const items = [
    //     { name: `${translations[selectedLanguage].Yes}`, code: '1' },
    //     { name: `${translations[selectedLanguage].No}`, code: '0' }
    // ];

    // useEffect(() => {
    //     setDropdownItem(findDropdownItemByCode(props.ticCena.valid));
    // }, []);



    // const findDropdownItemByCode = (code) => {
    //     return items.find((item) => item.code === code) || null;
    // };

    // useEffect(() => {
    //     setDropdownItems(items);
    // }, []);

    // const handleCancelClick = () => {
    //     props.setVisible(false);
    // };

    // const handleCreateClick = async () => {
    //     try {
    //         setSubmitted(true);
    //         const ticCenaService = new CoffDocsService();
    //         const data = await ticCenaService.postCoffDocs(ticCena);
    //         ticCena.id = data
    //         props.handleDialogClose({ obj: ticCena, cenaTip: props.cenaTip, refresh: true});
    //         props.setVisible(false);
    //     } catch (err) {
    //         toast.current.show({
    //             severity: "error",
    //             summary: "CoffDocs ",
    //             detail: `${err.response.data.error}`,
    //             life: 5000,
    //         });
    //     }
    // };

    // const handleSaveClick = async () => {
    //     try {
    //         setSubmitted(true);
    //         const ticCenaService = new CoffDocsService();

    //         await ticCenaService.putCoffDocs(ticCena);
    //         props.handleDialogClose({ obj: ticCena, cenaTip: props.cenaTip });
    //         props.setVisible(false);
    //     } catch (err) {
    //         toast.current.show({
    //             severity: "error",
    //             summary: "CoffDocs ",
    //             detail: `${err.response.data.error}`,
    //             life: 5000,
    //         });
    //     }
    // };

    // const showDeleteDialog = () => {
    //     setDeleteDialogVisible(true);
    // };

    // const handleDeleteClick = async () => {
    //     try {
    //         setSubmitted(true);
    //         const ticCenaService = new CoffDocsService();
    //         await ticCenaService.deleteCoffDocs(ticCena);
    //         props.handleDialogClose({ obj: ticCena, cenaTip: 'DELETE' });
    //         props.setVisible(false);
    //         hideDeleteDialog();
    //     } catch (err) {
    //         toast.current.show({
    //             severity: "error",
    //             summary: "CoffDocs ",
    //             detail: `${err.response.data.error}`,
    //             life: 5000,
    //         });
    //     }
    // };

    // const onInputChange = (e, type, name, a) => {
    //     let val = ''

    //     if (type === "options") {
    //         val = (e.target && e.target.value && e.target.value.code) || '';
    //         if (name == "tp") {
    //         } else {
    //             setDropdownItem(e.value);
    //         }

    //     } else {
    //         val = (e.target && e.target.value) || '';
    //     }
    //     let _ticCena = { ...ticCena };
    //     _ticCena[`${name}`] = val;
    //     setCoffDocs(_ticCena);
    // };

    // const hideDeleteDialog = () => {
    //     setDeleteDialogVisible(false);
    // };

    return (
        <div className="grid">
            <Toast ref={toast} />
            {/* <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" autoFocus
                                value={ticCena.code} onChange={(e) => onInputChange(e, "text", 'code')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticCena.code })}
                            />
                            {submitted && !ticCena.code && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-12">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText
                                id="text"
                                value={ticCena.text} onChange={(e) => onInputChange(e, "text", 'text')}
                                required
                                className={classNames({ 'p-invalid': submitted && !ticCena.text })}
                            />
                            {submitted && !ticCena.text && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="field col-12 md:col-1">
                        <div className="flex-2 flex flex-column align-items-left">
                            <label htmlFor="color">{translations[selectedLanguage].color}</label>
                            <ColorPicker format="hex" id="color" value={ticCena.color} onChange={(e) => onInputChange(e, 'text', 'color')} />
                        </div>

                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="valid">{translations[selectedLanguage].Valid}</label>
                            <Dropdown id="valid"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'valid')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticCena.valid })}
                            />
                            {submitted && !ticCena.valid && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.cenaTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.cenaTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.cenaTip !== 'CREATE') ? (
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
                inCoffDocs="delete"
                item={ticCena.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            /> */}
        </div>
    );
};

export default Order;
