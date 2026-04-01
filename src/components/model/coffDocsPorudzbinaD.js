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
import { useCrudActionPermissions, usePermission } from '../../security/interceptors';
import { SapDataService } from "../../service/model/SapDataService";
import { AutoComplete } from "primereact/autocomplete";
import { TicArtService } from '../../service/model/TicArtService';
import { CoffArtumService } from "../../service/model/CoffArtumService";
import { Dialog } from 'primereact/dialog';
import TicArtL from './ticArtL';
import { TicArtcenaService } from '../../service/model/TicArtcenaService';
import { defaultValue } from '../../configs/defaultValue';
import { EmptyEntities } from '../../service/model/EmptyEntities';

const CoffDocsPorudzbina = (props) => {
    const docsCrudPermissions = useCrudActionPermissions('coff_docs');
    const canUseDocsAction = usePermission('coffDocs');
    const canRequesterManageDocs = usePermission('coffNarucilac');
    const canCreate = docsCrudPermissions.canCreate || canUseDocsAction || canRequesterManageDocs;
    const canUpdate = docsCrudPermissions.canUpdate || canUseDocsAction || canRequesterManageDocs;
    const canDelete = docsCrudPermissions.canDelete || canUseDocsAction || canRequesterManageDocs;
    // console.log(props, "BMVBMV @@@@@@@@@@@@@@@@@@@@@ CoffDocPorudzbina @@@@@@@@@@@@@@@@@@@@@@@@@@!!!@")

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
    const priceLookupConfig = defaultValue.ems ?? defaultValue.tic ?? defaultValue.def;
    const items = [
        { name: `${translations[selectedLanguage].Yes}`, code: '1' },
        { name: `${translations[selectedLanguage].No}`, code: '0' }
    ];

    const normalizeId = (value) => {
        if (value === null || value === undefined) {
            return null;
        }

        const normalizedValue = String(value).trim();
        return normalizedValue === '' ? null : normalizedValue;
    };
    const parseDecimal = (value) => {
        if (value === null || value === undefined) {
            return 0;
        }

        const normalizedValue = String(value).replace(',', '.').trim();

        if (!normalizedValue) {
            return 0;
        }

        const parsedValue = Number(normalizedValue);
        return Number.isFinite(parsedValue) ? parsedValue : 0;
    };
    const formatToOneDecimal = (value) => {
        if (value === null || value === undefined || String(value).trim() === '') {
            return '';
        }

        return parseDecimal(value).toFixed(1);
    };

    const resolveCurrentDocId = () =>
        normalizeId(props.coffDoc?.id) ??
        normalizeId(coffDocs?.doc) ??
        normalizeId(localStorage.getItem('currCoffOrder'));

    const resolveCurrentObjId = () =>
        normalizeId(props.coffDoc?.obj) ??
        normalizeId(coffDocs?.obj);

    const buildCoffDocsPayload = () => ({
        ...coffDocs,
        doc: resolveCurrentDocId(),
        obj: resolveCurrentObjId(),
        cena: formatToOneDecimal(coffDocs?.cena),
    });
    const buildEmptyCoffDocs = () => ({
        ...EmptyEntities["coff_docs"],
        doc: resolveCurrentDocId(),
        obj: resolveCurrentObjId(),
        imageUrl: props.coffDocs?.imageUrl ?? '',
    });
    const resetFormState = () => {
        setCoffDocs(buildEmptyCoffDocs());
        setArtValue('');
        setFilteredArts([]);
        setSelectedArt(null);
        setCoffArt(null);
        setDdCmnUmItem(null);
        setDdCmnUmItems([]);
        setCmnUmItem(null);
        setCmnUmItems([]);
        setSubmitted(false);
        setDeleteDialogVisible(false);
        setTicArtLVisible(false);
        setShowMyComponent(true);
    };
    const validatePayload = (payload) =>
        Boolean(
            payload.doc &&
            payload.art &&
            payload.cart &&
            payload.nart &&
            payload.um &&
            payload.izlaz &&
            payload.cena !== null &&
            payload.cena !== undefined &&
            `${payload.cena}`.trim() !== ''
        );
    const applyArtSelection = (art) => {
        if (!art) {
            return;
        }

        setSelectedArt(art.code || art.id || null);
        setArtValue(art.code || art.text || '');
        setCoffArt(art);
        setCoffDocs((prevState) => ({
            ...prevState,
            art: art.id,
            nart: art.text,
            cart: art.code,
            um: art.um ?? prevState.um,
        }));
    };

    useEffect(() => {
        setCoffDocs((prevState) => ({
            ...prevState,
            ...props.coffDocs,
            doc: props.coffDocs?.doc ?? props.coffDoc?.id ?? prevState?.doc ?? null,
            obj: props.coffDocs?.obj ?? props.coffDoc?.obj ?? prevState?.obj ?? null,
            cena: props.coffDocs?.cena ?? prevState?.cena ?? '',
        }));
        setSubmitted(false);
    }, [props.coffDocs, props.coffDoc?.id, props.coffDoc?.obj]);

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("$$$$$$$$$$$$$$$$$$$$ coffArtumService $$$$$$$$$$$$$$$$$$$$$$", coffDocs?.art || props.coffDocs.art)
                const coffArtumService = new CoffArtumService();
                const data = await coffArtumService.getLista(coffDocs?.art || props.coffDocs.art);
                console.log(data, "*******$$$$$$$$$$$$$$$$$$$$ coffArtumService $$$$$$$$$$$$$$$$$$$$$$**************", coffDocs.art)
                setCmnUmItems(data)
                const dataDD = data.map(({ num, um }) => ({ name: num, code: um }));
                const selectedUm = coffDocs?.um ?? props.coffDocs?.um;
                setDdCmnUmItems(dataDD);
                setDdCmnUmItem(dataDD.find((item) => item.code === selectedUm) || null);
                if (selectedUm) {
                    const foundItem = data.find((item) => item.id === selectedUm || item.um === selectedUm);
                    setCmnUmItem(foundItem || null);
                    if (foundItem) {
                        setCoffDocs((prevState) => ({
                            ...prevState,
                            cum: foundItem.code ?? prevState.cum,
                            num: foundItem.textx ?? foundItem.num ?? prevState.num,
                        }));
                    }
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [coffDocs.art]);

    useEffect(() => {
        let cancelled = false;

        async function fetchPrice() {
            const artId = normalizeId(coffDocs?.art);
            const umId = normalizeId(coffDocs?.um);

            if (!artId || !umId) {
                setCoffDocs((prevState) => ({ ...prevState, cena: '' }));
                return;
            }

            try {
                const ticArtcenaService = new TicArtcenaService();
                const priceItem = await ticArtcenaService.getValue(
                    artId,
                    umId,
                    priceLookupConfig.curr,
                    priceLookupConfig.cena
                );

                if (cancelled) {
                    return;
                }

                setCoffDocs((prevState) => {
                    if (
                        normalizeId(prevState?.art) !== artId ||
                        normalizeId(prevState?.um) !== umId
                    ) {
                        return prevState;
                    }

                    return {
                        ...prevState,
                        cena:
                            priceItem?.value === null || priceItem?.value === undefined
                                ? ''
                                : formatToOneDecimal(priceItem.value),
                    };
                });
            } catch (error) {
                if (!cancelled) {
                    console.error(error);
                }
            }
        }

        fetchPrice();

        return () => {
            cancelled = true;
        };
    }, [coffDocs?.art, coffDocs?.um, priceLookupConfig.cena, priceLookupConfig.curr]);

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
            const payload = buildCoffDocsPayload();

            if (!validatePayload(payload)) {
                toast.current.show({
                    severity: "warn",
                    summary: "Action ",
                    detail: `${translations[selectedLanguage].Requiredfield}`,
                    life: 5000,
                });
                return;
            }

            const data = await coffDocsService.postCoffDocs(payload);
            const nextCoffDocs = { ...payload, id: data }
            setCoffDocs(nextCoffDocs)
            props.handleDialogClose({ obj: nextCoffDocs, docsTip: props.docsTip });
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

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
            const coffDocsService = new CoffDocsService();
            const payload = buildCoffDocsPayload();

            if (!validatePayload(payload)) {
                toast.current.show({
                    severity: "warn",
                    summary: "Action ",
                    detail: `${translations[selectedLanguage].Requiredfield}`,
                    life: 5000,
                });
                return;
            }

            const data = await coffDocsService.postCoffDocs(payload);
            const nextCoffDocs = { ...payload, id: data };

            props.handleDialogClose({ obj: nextCoffDocs, docsTip: props.docsTip, resetForm: true });
            resetFormState();
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
            const payload = buildCoffDocsPayload();

            if (!validatePayload(payload)) {
                toast.current.show({
                    severity: "warn",
                    summary: "Action ",
                    detail: `${translations[selectedLanguage].Requiredfield}`,
                    life: 5000,
                });
                return;
            }

            await coffDocsService.putCoffDocs(payload);
            setCoffDocs(payload)
            props.handleDialogClose({ obj: payload, docsTip: props.docsTip });
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
                setCmnUmItem(foundItem || null);
                setCoffDocs((prevState) => ({
                    ...prevState,
                    um: val,
                    num: e.value?.name ?? prevState.num,
                    cum: foundItem?.cum ?? prevState.cum
                }));
                return;
            } else {
                setDropdownItem(e.value);
            }
        } else if (type === "auto") {
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
        applyArtSelection(e.value);
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
        applyArtSelection(newObj);
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
                        <div className="field col-12 md:col-12 text-center">
                            <img src={props.coffDocs.imageUrl} className="shadow-2 border-round" style={{ width: '300px', height: '300px', objectFit: 'cover' }} />
                        </div>

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

                        <div className="field col-12 md:col-6">
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
                        <div className="field col-12 md:col-6">
                            <label htmlFor="izlaz">{translations[selectedLanguage].Kol} *</label>
                            <InputText id="izlaz"
                                value={coffDocs.izlaz}
                                onChange={(e) => onInputChange(e, 'text', 'izlaz')}
                                required
                                className={classNames({ 'p-invalid': submitted && !coffDocs.izlaz })} />
                            {submitted && !coffDocs.izlaz && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
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
                            {(props.docsTip == 'CREATE' && canCreate) ? (
                                <>
                                    <Button
                                        label={translations[selectedLanguage].Create}
                                        icon="pi pi-check"
                                        onClick={handleCreateClick}
                                        severity="success"
                                        outlined
                                    />
                                    <Button
                                        label={translations[selectedLanguage].CreateAndAddNew}
                                        icon="pi pi-plus"
                                        onClick={handleCreateAndAddNewClick}
                                        severity="success"
                                        outlined
                                    />
                                </>
                            ) : null}
                            {(props.docsTip !== 'CREATE' && canDelete) ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docsTip !== 'CREATE' && canUpdate) ? (
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

export default CoffDocsPorudzbina;
