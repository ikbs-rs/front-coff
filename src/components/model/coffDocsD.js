import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffDocsService } from "../../service/model/CoffDocsService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { SapDataService } from "../../service/model/SapDataService";
import { AutoComplete } from "primereact/autocomplete";
import { TicArtService } from '../../service/model/TicArtService';
import { CoffArtumService } from "../../service/model/CoffArtumService";
import env from "../../configs/env"
import axios from 'axios';
import Token from "../../utilities/Token";
import { Dialog } from 'primereact/dialog';
import TicArtL from './ticArtL';

const CoffDoc = (props) => {
    console.log(props, "@!!!@@@@@@@@@@@@@@@@@@@@@ CoffDoc @@@@@@@@@@@@@@@@@@@@@@@@@@!!!@")

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [coffDoc, setCoffDoc] = useState(props.coffDoc);
    const [submitted, setSubmitted] = useState(false);

    const [showMyComponent, setShowMyComponent] = useState(true);

    const [ddCmnUmItem, setDdCmnUmItem] = useState(null);
    const [ddCmnUmItems, setDdCmnUmItems] = useState(null);
    const [cmnUmItem, setCmnUmItem] = useState(null);
    const [cmnUmItems, setCmnUmItems] = useState(null);

    const [ddDocsDDItem, setDdDocsDDItem] = useState(null);
    const [ddDocsDDItems, setDdDocsDDItems] = useState(null);
    const [docsDDItem, setDocsDDItem] = useState(null);
    const [docsDDItems, setDocsDDItems] = useState(null);

    const [coffDocs, setCoffDocs] = useState(props.coffDocs);
    /************************AUTOCOMPLIT**************************** */
    const [ticArtLVisible, setTicArtLVisible] = useState(false);
    const [coffArtRemoteLVisible, setCoffArtRemoteLVisible] = useState(false);
    const [coffArt, setCoffArt] = useState(null);
    const [allArt, setAllArts] = useState([]);
    const [artValue, setArtValue] = useState(props.coffDocs?.cart || null);
    const [filteredArts, setFilteredArts] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [selectedArt, setSelectedArt] = useState(null);
    /************************AUTOCOMPLIT**************************** */

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("$$$$$$$$$$$$$$$$$$$$ coffArtumService $$$$$$$$$$$$$$$$$$$$$$", coffDocs?.art||props.coffDocs.art)
                const coffArtumService = new CoffArtumService();
                const data = await coffArtumService.getLista(coffDocs?.art||props.coffDocs.art);
                console.log(data, "*******$$$$$$$$$$$$$$$$$$$$ coffArtumService $$$$$$$$$$$$$$$$$$$$$$**************", coffDocs.art)
                setCmnUmItems(data)
                const dataDD = data.map(({ num, um }) => ({ name: num, code: um }));
                setDdCmnUmItems(dataDD);
                setDdCmnUmItem(dataDD.find((item) => item.code === props.coffDocs.um) || null);
                if (props.coffDocs.um) {
                    const foundItem = data.find((item) => item.id === props.coffDocs.um);
                    setCmnUmItem(foundItem || null);
                    coffDocs.cum = foundItem.code
                    coffDocs.num = foundItem.textx
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [coffDocs.art]);

    // useEffect(() => {
    //     setDropdownItem(findDropdownItemByCode(props.coffDoc.valid));
    // }, []);

    const findDropdownItemByCode = (code) => {
        return items.find((item) => item.code === code) || null;
    };

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
        props.setVisibleCoffDocsmenu(false)
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const coffDocsService = new CoffDocsService();
            const data = await coffDocsService.postCoffDocs(coffDocs);
            coffDocs.id = data
            props.handleDialogClose({ obj: coffDocs, docsTip: props.docsTip });
            props.setVisible(false);
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
            const coffDocsService = new CoffDocsService();
            await coffDocsService.putCoffDocs(coffDocs);
            props.handleDialogClose({ obj: coffDocs, docsTip: props.docsTip });
            props.setVisibleCoffDocsmenu(false)
            props.setVisible(false);
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
            const coffDocsService = new CoffDocsService();
            await coffDocsService.deleteCoffDocs(coffDocs);
            props.handleDialogClose({ obj: coffDocs, docsTip: 'DELETE' });
            props.setVisible(false);
            props.setVisibleCoffDocsmenu(false)
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response.data.error}`,
                life: 5000,
            });
        }
    };

    const onInputChange = async (e, type, name) => {
        let val = ''
        if (type === "options") {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (name == "um") {
                setDdCmnUmItem(e.value);
                const foundItem = cmnUmItems.find((item) => item.um === val);
                console.log(foundItem, "###########################-um-###########################setDebouncedSearch###", val)
                setCmnUmItem(foundItem || null);
                coffDocs.num = val
                coffDocs.num = e.value.name
                coffDocs.cum = foundItem.cum
            } else {
                setDropdownItem(e.value);
            }
        } else if (type === "auto") {
            console.log(e.target, "###########################-auto-###########################setDebouncedSearch###", e.target.value)
            let timeout = null
            switch (name) {
                case "art":
                    if (selectedArt === null) {
                        setArtValue(e.target.value.text || e.target.value);
                    } else {
                        setSelectedArt(null);
                        setArtValue(e.target.value.text || e.target.value.text);
                    }
                    coffDocs.art = e.target.value.id
                    coffDocs.nart = e.target.value.text
                    coffDocs.cart = e.target.value.code
                    // Postavite debouncedSearch nakon 1 sekunde neaktivnosti unosa
                    clearTimeout(searchTimeout);
                    timeout = setTimeout(() => {
                        setDebouncedSearch(e.target.value);
                    }, 400);
                    break;
                default:
                    console.error("Pogresan naziv polja")
            }
            setSearchTimeout(timeout);
            val = (e.target && e.target.value && e.target.value.id) || '';
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _coffDocs = { ...coffDocs };
        _coffDocs[`${name}`] = val;
        setCoffDocs(_coffDocs);

        // let _coffDocs = { ...coffDocs };
        // _coffDocs[`${name}`] = val;
        // if (name === `text`) _coffDocs[`text`] = val
        // console.log(_coffDocs, `############ ${name} ###############-auto-###########################___###`, _coffDocs)
        // setCoffDoc(_coffDocs);
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    /*************************AUTOCOMPLIT************************************ART************* */
    /**************** */
    useEffect(() => {
        async function fetchData() {
            const coffArtService = new TicArtService();
            const data = await coffArtService.getLista();
            setAllArts(data);
            //setParValue(data.find((item) => item.id === props.ticEvent.par) || null);
        }
        fetchData();
    }, []);
    /**************** */
    useEffect(() => {
        if (debouncedSearch && selectedArt === null) {
            // Filtrirajte podatke na osnovu trenutnog unosa
            console.log("debouncedLocSearch-=============================0", debouncedSearch, "=============================")
            const query = debouncedSearch.toLowerCase();
            console.log("debouncedLocSearch-=============================1", allArt, "=============================")
            const filtered = allArt.filter(
                (item) =>
                    item.text.toLowerCase().includes(query) ||
                    item.code.toLowerCase().includes(query) ||
                    item.id.toLowerCase().includes(query)
            );

            setSelectedArt(null);
            setFilteredArts(filtered);
        }
    }, [debouncedSearch, allArt]);
    /*** */

    useEffect(() => {
        // Samo kada je izabrani element `null`, izvršavamo `onChange`
        console.log(artValue, "*********************parValue*****************@@@@@@@@@***********")
        setArtValue(artValue);
    }, [artValue, selectedArt]);

    const handleSelect = (e) => {
        // Postavite izabrani element i automatski popunite polje za unos sa vrednošću "code"
        setSelectedArt(e.value.code);
        setArtValue(e.value.code);
    };
    /************************** */
    const handleArtClick = async (e, destination) => {
        try {
            if (destination === 'local') setCoffArtDialog();
            else setCoffArtRemoteDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch coffArt data',
                life: 3000
            });
        }
    };

    const setCoffArtRemoteDialog = () => {
        setCoffArtRemoteLVisible(true);
    };

    const setCoffArtDialog = (destination) => {
        setTicArtLVisible(true);
    };
    /************************** */
    const handleTicArtLDialogClose = (newObj) => {
        console.log(newObj, "11111111111111111111111111111111qqq1111111111111111111111111111111", newObj)
        setCoffArt(newObj);
        let _coffDocs = { ...coffDocs }
        _coffDocs.art = newObj.id;
        _coffDocs.nart = newObj.text;
        _coffDocs.cart = newObj.code;
        setArtValue(newObj.code)
        setDdCmnUmItem(newObj.um)
        _coffDocs.um = newObj.um;
        //coffDocs.price = newObj.price;
        //coffDocs.loc = newObj.loc1;
        setCoffDocs(_coffDocs)
        //coffDocs.potrazuje = newObj.cena * coffDocs.output;
        setTicArtLVisible(false);
    };
    /**************************AUTOCOMPLIT************************************************ */
    const itemTemplate = (item) => {
        return (
            <>
                <div>
                    {item.text}
                    {` `}
                    {item.code}
                </div>
                <div>
                    {item.id}
                </div>
            </>
        );
    };


    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-4">
                            <label htmlFor="art">{translations[selectedLanguage].Art} *</label>
                            <div className="p-inputgroup flex-1">
                                <AutoComplete
                                    value={artValue}
                                    suggestions={filteredArts}
                                    completeMethod={() => { }}
                                    onSelect={handleSelect}
                                    onChange={(e) => onInputChange(e, "auto", 'art')}
                                    itemTemplate={itemTemplate} // Koristite itemTemplate za prikazivanje objekata
                                    placeholder="Pretraži"
                                    className={classNames({ 'p-invalid': submitted && !coffDocs.cart })}
                                />
                                <Button icon="pi pi-search" onClick={(e) => handleArtClick(e, 'local')} className="p-button" />
                            </div>
                            {submitted && !coffDocs.cart && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-8">
                            <label htmlFor="nart">{translations[selectedLanguage].nart}</label>
                            <InputText id="nart"
                                value={coffDocs.nart}
                                onChange={(e) => onInputChange(e, 'text', 'nart')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffDocs.nart })}
                            />
                            {submitted && !coffDocs.nart && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

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
                                className={classNames({ 'p-invalid': submitted && !coffDocs.um })}
                            />
                            {submitted && !coffDocs.um && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        {(props.doctp !== '1') ? (
                            <div className="field col-12 md:col-6">
                                <label htmlFor="ulaz">{translations[selectedLanguage].Kol}</label>
                                <InputText
                                    id="ulaz"
                                    value={coffDocs.ulaz}
                                    onChange={(e) => onInputChange(e, "text", 'ulaz')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !coffDocs.ulaz })}
                                />
                                {submitted && !coffDocs.ulaz && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                            </div>) : (
                            <div className="field col-12 md:col-6">
                                <label htmlFor="izlaz">{translations[selectedLanguage].Kol} *</label>
                                <InputText id="izlaz"
                                    value={coffDocs.izlaz}
                                    onChange={(e) => onInputChange(e, 'text', 'izlaz')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !coffDocs.izlaz })} />
                                {submitted && !coffDocs.izlaz && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                            </div>
                        )}
                        <div className="field col-12 md:col-5">
                            <label htmlFor="cena">{translations[selectedLanguage].Cena}</label>
                            <InputText
                                id="cena"
                                value={coffDocs.cena} onChange={(e) => onInputChange(e, "text", 'cena')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffDocs.cena })}
                            />
                            {submitted && !coffDocs.cena && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
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
                            {(props.docsTip == 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.docsTip !== 'CREATE') ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docsTip !== 'CREATE') ? (
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
            <Dialog
                header={translations[selectedLanguage].ArtList}
                visible={ticArtLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setTicArtLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticArtLVisible &&
                    <TicArtL
                        parameter={'inputTextValue'}
                        ticEventart={coffDocs}
                        ticEvent={props.coffDoc}
                        onTaskComplete={handleTicArtLDialogClose}
                        setTicArtLVisible={setTicArtLVisible}
                        dialog={true}
                        lookUp={true}
                    />}
            </Dialog>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={coffDocs.nart}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CoffDoc;
