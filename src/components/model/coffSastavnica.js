import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffSastavnicaService } from "../../service/model/CoffSastavnicaService";
import { TicArtService } from "../../service/model/TicArtService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { Dropdown } from 'primereact/dropdown';

import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";

const CoffSastavnica = (props) => {

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [coffSastavnica, setCoffSastavnica] = useState(props.coffSastavnica);
    const [submitted, setSubmitted] = useState(false);
    const [ddTicArt, setDdTicArtItem] = useState(null);
    const [ddTicArts, setDdTicArtItems] = useState(null);
    const [ticArtItem, setTicArtItem] = useState(null);
    const [ticArtItems, setTicArtItems] = useState(null);   

    const [ddCmnUmItem, setDdCmnUmItem] = useState(null);
    const [ddCmnUmItems, setDdCmnUmItems] = useState(null);
    const [cmnUmItem, setCmnUmItem] = useState(null);
    const [cmnUmItems, setCmnUmItems] = useState(null);


    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {               
                const ticArtService = new TicArtService();
                const data = await ticArtService.getTicArts();
                setTicArtItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicArtItems(dataDD);
                setDdTicArtItem(dataDD.find((item) => item.code === props.coffSastavnica.art1) || null);
                if (props.coffSastavnica.art1) {
                    const foundItem = data.find((item) => item.id === props.coffSastavnica.art1);
                    setTicArtItem(foundItem || null);
                    coffSastavnica.cart1 = foundItem.code
                    coffSastavnica.nart1 = foundItem.textx
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
            const coffSastavnicaService = new CoffSastavnicaService();
            const data = await coffSastavnicaService.postCoffSastavnica(coffSastavnica);
            coffSastavnica.id = data
            props.handleDialogClose({ obj: coffSastavnica, sastavnicaTip: props.sastavnicaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffSastavnica ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);          
            const coffSastavnicaService = new CoffSastavnicaService();

            await coffSastavnicaService.putCoffSastavnica(coffSastavnica);
            props.handleDialogClose({ obj: coffSastavnica, sastavnicaTip: props.sastavnicaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffSastavnica ",
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
            const coffSastavnicaService = new CoffSastavnicaService();
            await coffSastavnicaService.deleteCoffSastavnica(coffSastavnica);
            props.handleDialogClose({ obj: coffSastavnica, sastavnicaTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "CoffSastavnica ",
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
                if (name == "art1") {
                    setDdTicArtItem(e.value);
                    const foundItem = ticArtItems.find((item) => item.id === val);
                    console.log(foundItem, "foundItemfoundItemfoundItemfoundItemfoundItemfoundItemfoundItemfoundItemfoundItem")
                    setTicArtItem(foundItem || null);
                    coffSastavnica.nart1 = e.value.name
                    coffSastavnica.cart1 = foundItem.code
                }
            }                
        }  else {
            console.log(name, "foundItemfoundItemfoundItemfoundItemfoundItemfoundItemfoundItemfoundItemfoundItem", e.target.value)
            val = (e.target && e.target.value) || '';
        }
        let _coffSastavnica = { ...coffSastavnica };
        _coffSastavnica[`${name}`] = val;
        setCoffSastavnica(_coffSastavnica);
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
                            <label htmlFor="art1">{translations[selectedLanguage].Attribute} *</label>
                            <Dropdown id="art1"
                                value={ddTicArt}
                                options={ddTicArts}
                                onChange={(e) => onInputChange(e, "options", 'art1')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffSastavnica.art1 })}
                            />
                            {submitted && !coffSastavnica.art1 && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>                        
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="ration">{translations[selectedLanguage].ration} *</label>
                            <InputText
                                id="ration"
                                value={coffSastavnica.ration} onChange={(e) => onInputChange(e, "text", 'ration')}
                            />                            
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-8">
                            <label htmlFor="descript">{translations[selectedLanguage].Description} </label>
                            <InputText
                                id="descript" value={coffSastavnica.descript}
                                onChange={(e) => onInputChange(e, "text", 'descript')}
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
                            {(props.sastavnicaTip === 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.sastavnicaTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.sastavnicaTip !== 'CREATE') ? (
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
                inCoffSastavnica="delete"
                item={coffSastavnica.roll}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CoffSastavnica;
