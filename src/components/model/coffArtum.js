import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffArtumService } from '../../service/model/CoffArtumService';
import { TicCenaService } from '../../service/model/TicCenaService';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from '../../configs/translations';
import { Dropdown } from 'primereact/dropdown';
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";
import { Calendar } from 'primereact/calendar';
import DateFunction from '../../utilities/DateFunction';

const CoffArtum = (props) => {
    console.log(props, '===================CoffArtum======================');
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [coffArtum, setCoffArtum] = useState(props.coffArtum);
    const [submitted, setSubmitted] = useState(false);

    const [ddCmnUmItem, setDdCmnUmItem] = useState(null);
    const [ddCmnUmItems, setDdCmnUmItems] = useState(null);
    const [cmnUmItem, setCmnUmItem] = useState(null);
    const [cmnUmItems, setCmnUmItems] = useState(null);

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${env.CMN_BACK_URL}/cmn/x/um/?sl=${selectedLanguage}`;
                const tokenLocal = await Token.getTokensLS();
                const headers = {
                    Authorization: tokenLocal.token
                };

                const response = await axios.get(url, { headers });
                const data = response.data.items;
                setCmnUmItems(data)
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnUmItems(dataDD);
                setDdCmnUmItem(dataDD.find((item) => item.code === props.coffArtum.um) || null);
                if (props.coffArtum.um) {
                    const foundItem = data.find((item) => item.id === props.coffArtum.um);
                    setCmnUmItem(foundItem || null);
                    coffArtum.cum = foundItem.code
                    coffArtum.num = foundItem.textx
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
            const coffArtumService = new CoffArtumService();
            const data = await coffArtumService.postCoffArtum(coffArtum);
            coffArtum.id = data;
            props.handleDialogClose({ obj: coffArtum, artumTip: props.artumTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CoffArtum ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const coffArtumService = new CoffArtumService();

            await coffArtumService.putCoffArtum(coffArtum);
            props.handleDialogClose({ obj: coffArtum, artumTip: props.artumTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CoffArtum ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const showDeleteDialog = () => {
        setDeleteDialogVisible(true);
    };

    const handleDeleteClick = async () => {
        try {
            setSubmitted(true);
            const coffArtumService = new CoffArtumService();
            await coffArtumService.deleteCoffArtum(coffArtum);
            props.handleDialogClose({ obj: coffArtum, artumTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'CoffArtum ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = '';

        if (type === 'options') {
            val = (e.target && e.target.value && e.target.value.code) || '';
            let foundItem = {}
            if (type === 'options') {
                if (name == 'um') {
                    setDdCmnUmItem(e.value);
                    foundItem = cmnUmItems.find((item) => item.id === val);
                    setCmnUmItem(foundItem || null);
                    coffArtum.num = e.value.name
                    coffArtum.cum = foundItem.code
                }
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _coffArtum = { ...coffArtum };
        _coffArtum[`${name}`] = val;
        setCoffArtum(_coffArtum);
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
                            <InputText id="code" value={props.ticArt.code} disabled={true} />
                        </div>
                        <div className="field col-12 md:col-7">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={props.ticArt.text} disabled={true} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-7">
                            <label htmlFor="um">{translations[selectedLanguage].Um} *</label>
                            <Dropdown id="um"
                                value={ddCmnUmItem}
                                options={ddCmnUmItems}
                                onChange={(e) => onInputChange(e, "options", 'um')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !coffArtum.um })}
                            />
                            {submitted && !coffArtum.um && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="odnos">{translations[selectedLanguage].Value} *</label>
                            <InputText id="odnos" value={coffArtum.odnos} onChange={(e) => onInputChange(e, 'text', 'odnos')} required className={classNames({ 'p-invalid': submitted && !coffArtum.odnos })} />
                            {submitted && !coffArtum.odnos && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="proizvod">{translations[selectedLanguage].TipJM} *</label>
                            <InputText id="proizvod" value={coffArtum.proizvod} onChange={(e) => onInputChange(e, 'text', 'proizvod')} required className={classNames({ 'p-invalid': submitted && !coffArtum.proizvod })} />
                            {submitted && !coffArtum.proizvod && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                    </div>                    

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.artumTip === 'CREATE' ? <Button label={translations[selectedLanguage].Create} icon="pi pi-check" onClick={handleCreateClick} severity="success" outlined /> : null}
                            {props.artumTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Delete} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.artumTip !== 'CREATE' ? <Button label={translations[selectedLanguage].Save} icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inCoffArtum="delete" item={coffArtum.roll} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
        </div>
    );
};

export default CoffArtum;
