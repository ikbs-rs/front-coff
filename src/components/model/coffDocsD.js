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
import { AutoComplete } from "primereact/autocomplete";
import { TicArtService } from '../../service/model/TicArtService';
import { CoffArtumService } from "../../service/model/CoffArtumService";
import { Dialog } from 'primereact/dialog';
import TicArtL from './ticArtL';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { TicDoctpService } from '../../service/model/TicDoctpService';
import { TicArtcenaService } from '../../service/model/TicArtcenaService';
import { defaultValue } from '../../configs/defaultValue';

const CoffDoc = (props) => {
    const docsCrudPermissions = useCrudActionPermissions('coff_docs');
    const canUseDocsAction = usePermission('coffDocs');
    const canRequesterManageDocs = usePermission('coffNarucilac');
    const canCreate = docsCrudPermissions.canCreate || canUseDocsAction || canRequesterManageDocs;
    const canUpdate = docsCrudPermissions.canUpdate || canUseDocsAction || canRequesterManageDocs;
    const canDelete = docsCrudPermissions.canDelete || canUseDocsAction || canRequesterManageDocs;
    // console.log(props, "@!!!@@@@@@@@@@@@@@@@@@@@@ CoffDoc @@@@@@@@@@@@@@@@@@@@@@@@@@!!!@")

    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ddCmnUmItem, setDdCmnUmItem] = useState(null);
    const [ddCmnUmItems, setDdCmnUmItems] = useState(null);
    const [cmnUmItems, setCmnUmItems] = useState(null);
    const [coffDocs, setCoffDocs] = useState(props.coffDocs);
    const [ticArtLVisible, setTicArtLVisible] = useState(false);
    const [coffArt, setCoffArt] = useState(null);
	    const [allArt, setAllArts] = useState([]);
	    const [artValue, setArtValue] = useState('');
	    const [filteredArts, setFilteredArts] = useState([]);
	    const [docTypeRule, setDocTypeRule] = useState(null);

    const toast = useRef(null);
    const priceLookupConfig = defaultValue.ems ?? defaultValue.tic ?? defaultValue.def;

    const normalizeId = (value) => {
        if (value === null || value === undefined) {
            return null;
        }

        const normalizedValue = String(value).trim();
        return normalizedValue === '' ? null : normalizedValue;
    };

    const formatArtLabel = (art) => [art?.code, art?.text].filter(Boolean).join(' ').trim();
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
    const roundToOneDecimal = (value) => Number(parseDecimal(value).toFixed(1));
    const formatToOneDecimal = (value) => {
        if (value === null || value === undefined || String(value).trim() === '') {
            return '';
        }

        return roundToOneDecimal(value).toFixed(1);
    };
    const normalizeDoctpRule = (value) => Array.isArray(value) ? value[0] || null : value || null;
    const resolveDocTypeDuguje = () => String(docTypeRule?.duguje ?? props.coffDoc?.duguje ?? (props.doctp !== '1' ? '1' : '0')) === '1';
    const resolveDocTypeSign = () => {
        const sign = `${docTypeRule?.znak ?? props.coffDoc?.znak ?? '+'}`.trim();
        return sign === '-' ? -1 : 1;
    };
    const buildCalculatedAmounts = (source) => {
        const signMultiplier = resolveDocTypeSign();
        const ulazValue = parseDecimal(source?.ulaz);
        const izlazValue = parseDecimal(source?.izlaz);
        const cenaValue = parseDecimal(source?.cena);

        return {
            duguje: roundToOneDecimal(ulazValue * cenaValue * signMultiplier),
            potrazuje: roundToOneDecimal(izlazValue * cenaValue * signMultiplier),
        };
    };
    const applyCalculatedAmounts = (source) => {
        const nextState = { ...source };
        const calculatedAmounts = buildCalculatedAmounts(nextState);

        nextState.duguje = calculatedAmounts.duguje;
        nextState.potrazuje = calculatedAmounts.potrazuje;

        return nextState;
    };
    const applyPriceValue = (source, priceItem) =>
        applyCalculatedAmounts({
            ...source,
            cena:
                priceItem?.value === null || priceItem?.value === undefined
                    ? ''
                    : formatToOneDecimal(priceItem.value),
        });

    const resolveCurrentDocId = () =>
        normalizeId(props.coffDoc?.id) ??
        normalizeId(coffDocs?.doc) ??
        normalizeId(localStorage.getItem('currCoffOrder'));

    const resolveCurrentObjId = () =>
        normalizeId(props.coffDoc?.obj) ??
        normalizeId(coffDocs?.obj);

    const applyArtSelection = (art) => {
        if (!art) {
            return;
        }

        setCoffArt(art);
        setArtValue(formatArtLabel(art));
        setCoffDocs((prevState) => ({
            ...prevState,
            art: art.id,
            nart: art.text,
            cart: art.code,
            um: art.um ?? prevState.um,
        }));
    };

    const buildCoffDocsPayload = () => {
        const payload = applyCalculatedAmounts({
            ...coffDocs,
            doc: resolveCurrentDocId(),
            obj: resolveCurrentObjId(),
            cena: formatToOneDecimal(coffDocs?.cena),
        });

        return {
            ...payload,
            cena: formatToOneDecimal(payload.cena),
        };
    };
	    const buildEmptyCoffDocs = () => ({
	        ...EmptyEntities["coff_docs"],
	        doc: resolveCurrentDocId(),
            obj: resolveCurrentObjId(),
	    });
	    const resetFormState = () => {
	        setCoffDocs(buildEmptyCoffDocs());
	        setArtValue('');
	        setFilteredArts([]);
	        setDdCmnUmItem(null);
	        setDdCmnUmItems([]);
	        setCmnUmItems([]);
	        setCoffArt(null);
	        setSubmitted(false);
	        setDeleteDialogVisible(false);
	        setTicArtLVisible(false);
	        setShowMyComponent(true);
	    };
	    const validatePayload = (payload) => {
        const quantityField = resolveDocTypeDuguje() ? 'ulaz' : 'izlaz';
        return Boolean(
            payload.doc &&
            payload.cart &&
            payload.nart &&
            payload.um &&
            payload[quantityField] &&
            payload.cena !== null &&
            payload.cena !== undefined &&
            `${payload.cena}`.trim() !== ''
        );
    };

    useEffect(() => {
        const nextCoffDocs = {
            ...props.coffDocs,
            doc: props.coffDocs?.doc ?? props.coffDoc?.id ?? localStorage.getItem('currCoffOrder') ?? null,
            obj: props.coffDocs?.obj ?? props.coffDoc?.obj ?? null,
            cena: props.docsTip !== 'CREATE' ? formatToOneDecimal(props.coffDocs?.cena) : props.coffDocs?.cena,
        };

        setCoffDocs(applyCalculatedAmounts(nextCoffDocs));
    }, [props.coffDocs, props.docsTip, props.coffDoc?.id, props.coffDoc?.obj]);

    useEffect(() => {
        async function fetchDoctpRule() {
            try {
                if (!props.doctp) {
                    setDocTypeRule(null);
                    return;
                }

                const ticDoctpService = new TicDoctpService();
                const data = await ticDoctpService.getTicDoctp(props.doctp);
                setDocTypeRule(normalizeDoctpRule(data));
            } catch (error) {
                console.error(error);
                setDocTypeRule(null);
            }
        }

        fetchDoctpRule();
    }, [props.doctp]);

    useEffect(() => {
        setArtValue(formatArtLabel({ code: coffDocs?.cart, text: coffDocs?.nart }));
    }, [coffDocs?.cart, coffDocs?.nart]);

    useEffect(() => {
        async function fetchData() {
            try {
                const selectedArtId = coffDocs?.art ?? props.coffDocs?.art;

                if (!selectedArtId) {
                    setCmnUmItems([]);
                    setDdCmnUmItems([]);
                    setDdCmnUmItem(null);
                    return;
                }

                const coffArtumService = new CoffArtumService();
                const data = await coffArtumService.getLista(selectedArtId);
                const normalizedData = data || [];
                const dataDD = normalizedData.map(({ num, um }) => ({ name: num, code: um }));
                const selectedUm = coffDocs?.um ?? props.coffDocs?.um;
                const foundItem = normalizedData.find((item) => `${item.um}` === `${selectedUm}` || `${item.id}` === `${selectedUm}`);

                setCmnUmItems(normalizedData);
                setDdCmnUmItems(dataDD);
                setDdCmnUmItem(dataDD.find((item) => `${item.code}` === `${selectedUm}`) || null);

                if (foundItem) {
                    setCoffDocs((prevState) => ({
                        ...prevState,
                        cum: foundItem.code ?? prevState.cum,
                        num: foundItem.textx ?? foundItem.num ?? prevState.num,
                    }));
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [coffDocs?.art, coffDocs?.um, props.coffDocs]);

    useEffect(() => {
        let cancelled = false;

        async function fetchPrice() {
            const artId = normalizeId(coffDocs?.art);
            const umId = normalizeId(coffDocs?.um);

            if (!artId || !umId) {
                setCoffDocs((prevState) => applyPriceValue(prevState, null));
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

                    return applyPriceValue(prevState, priceItem);
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

    useEffect(() => {
        async function fetchData() {
            try {
                const coffArtService = new TicArtService();
                const data = await coffArtService.getLista();
                setAllArts(data || []);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const handleCancelClick = () => {
        props.setVisible(false);
        props.setVisibleCoffDocsmenu(false);
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
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

            const coffDocsService = new CoffDocsService();
            const data = await coffDocsService.postCoffDocs(payload);
            const nextCoffDocs = { ...payload, id: data };

            setCoffDocs(nextCoffDocs);
            props.setVisibleCoffDocsmenu(false);
            props.setVisible(false);
            props.handleDialogClose({ obj: nextCoffDocs, docsTip: props.docsTip });
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response?.data?.error || err.message}`,
                life: 5000,
            });
        }
    };

    const handleCreateAndAddNewClick = async () => {
        try {
            setSubmitted(true);
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

	            const coffDocsService = new CoffDocsService();
	            const data = await coffDocsService.postCoffDocs(payload);
	            const nextCoffDocs = { ...payload, id: data };
	
	            props.handleDialogClose({ obj: nextCoffDocs, docsTip: props.docsTip, resetForm: true });
	            resetFormState();
	        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response?.data?.error || err.message}`,
                life: 5000,
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
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

            const coffDocsService = new CoffDocsService();
            await coffDocsService.putCoffDocs(payload);
            setCoffDocs(payload);
            props.handleDialogClose({ obj: payload, docsTip: props.docsTip });
            props.setVisibleCoffDocsmenu(false);
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response?.data?.error || err.message}`,
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
            props.setVisibleCoffDocsmenu(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response?.data?.error || err.message}`,
                life: 5000,
            });
        }
    };

    const onInputChange = (e, type, name) => {
        if (type === "options" && name === "um") {
            const selectedOption = e.value;
            const selectedUm = selectedOption?.code || '';
            const foundItem = (cmnUmItems || []).find((item) => `${item.um}` === `${selectedUm}` || `${item.id}` === `${selectedUm}`);

            setDdCmnUmItem(selectedOption);
            setCoffDocs((prevState) => ({
                ...prevState,
                um: selectedUm,
                num: selectedOption?.name ?? prevState.num,
                cum: foundItem?.cum ?? foundItem?.code ?? prevState.cum,
            }));
            return;
        }

        if (type === "auto" && name === "art") {
            setArtValue(e.value || '');
            return;
        }

        const val = (e.target && e.target.value) || '';
        setCoffDocs((prevState) => applyCalculatedAmounts({
            ...prevState,
            [name]: val,
        }));
    };
    const handlePriceBlur = () => {
        setCoffDocs((prevState) => ({
            ...applyCalculatedAmounts(prevState),
            cena: formatToOneDecimal(prevState?.cena),
        }));
    };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    const searchArts = (event) => {
        const query = (event.query || '').toLowerCase().trim();

        if (!query) {
            setFilteredArts(allArt.slice(0, 20));
            return;
        }

        const filtered = allArt.filter((item) => {
            const itemId = item.id === null || item.id === undefined ? '' : String(item.id).toLowerCase();
            return (
                item.text?.toLowerCase().includes(query) ||
                item.code?.toLowerCase().includes(query) ||
                itemId.includes(query)
            );
        });

        setFilteredArts(filtered.slice(0, 20));
    };

    const handleSelect = (e) => {
        applyArtSelection(e.value);
    };

    const handleArtClick = async (e, destination) => {
        try {
            if (destination === 'local') {
                setTicArtLVisible(true);
            }
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

    const handleTicArtLDialogClose = (newObj) => {
        console.log(newObj, "11111111111111111111111111111111qqq1111111111111111111111111111111", newObj)
        applyArtSelection(newObj);
        setTicArtLVisible(false);
    };

    const itemTemplate = (item) => {
        return (
            <div>
                {item.code}
                {` `}
                {item.text}
            </div>
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
                                    completeMethod={searchArts}
                                    onSelect={handleSelect}
                                    onChange={(e) => onInputChange(e, "auto", 'art')}
                                    itemTemplate={itemTemplate}
                                    placeholder="Pretrazi"
                                    className={classNames({ 'p-invalid': submitted && !coffDocs.cart })}
                                />
                                <Button icon="pi pi-search" onClick={(e) => handleArtClick(e, 'local')} className="p-button" />
                            </div>
                            {submitted && !coffDocs.cart && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>

                        <div className="field col-12 md:col-8">
                            <label htmlFor="nart">{translations[selectedLanguage].nart}</label>
                            <InputText
                                id="nart"
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
                            <Dropdown
                                id="um"
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
                        {resolveDocTypeDuguje() ? (
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
                            </div>
                        ) : (
                            <div className="field col-12 md:col-6">
                                <label htmlFor="izlaz">{translations[selectedLanguage].Kol} *</label>
                                <InputText
                                    id="izlaz"
                                    value={coffDocs.izlaz}
                                    onChange={(e) => onInputChange(e, 'text', 'izlaz')}
                                    required
                                    className={classNames({ 'p-invalid': submitted && !coffDocs.izlaz })}
                                />
                                {submitted && !coffDocs.izlaz && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                            </div>
                        )}
                        <div className="field col-12 md:col-5">
                            <label htmlFor="cena">{translations[selectedLanguage].Cena}</label>
                            <InputText
                                id="cena"
                                value={coffDocs.cena}
                                onChange={(e) => onInputChange(e, "text", 'cena')}
                                onBlur={handlePriceBlur}
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
                {ticArtLVisible && (
                    <TicArtL
                        parameter={'inputTextValue'}
                        ticEventart={coffDocs}
                        ticEvent={props.coffDoc}
                        onTaskComplete={handleTicArtLDialogClose}
                        setTicArtLVisible={setTicArtLVisible}
                        dialog={true}
                        lookUp={true}
                    />
                )}
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


