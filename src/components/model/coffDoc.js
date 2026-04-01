import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffDocService } from "../../service/model/CoffDocService";
import { CoffZapService } from "../../service/model/CoffZapService";
// import { CmnObjService } from "../../service/model/cmn/CmnObjService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { useCrudActionPermissions, usePermission } from '../../security/interceptors';
import DateFunction from "../../utilities/DateFunction"
import CoffDocsL from './coffDocsL';
import { buildOrderChangedMessage, useWebSocket } from '../../utilities/WebSocketContext';

const CoffDoc = (props) => {
    const { canCreate, canUpdate, canDelete } = useCrudActionPermissions('coff_doc');
    const canSeeAllRequesters = usePermission('coffCOFF');
    const canChooseKitchen = usePermission('coffNarucilac');
    console.log(props, "!!@@@@@@@@@@@@@@@@@@@@@@@@@@ CoffDoc @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@!!")

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const userId = localStorage.getItem('userId')
    const getStoredUser = () => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch (error) {
            console.error(error);
            return null;
        }
    };
    const storedUser = getStoredUser();
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [coffDoc, setCoffDoc] = useState(props.coffDoc);
    const [docTip, setDocTip] = useState(props.docTip);
    const [submitted, setSubmitted] = useState(false);
    const websocket = useWebSocket();

    const toast = useRef(null);
    const items = [
        { name: `${translations[selectedLanguage].Isporuceno}`, code: '3' },
        { name: `${translations[selectedLanguage].Cekanje}`, code: '2' },
        { name: `${translations[selectedLanguage].Prijem}`, code: '1' },
        { name: `${translations[selectedLanguage].Selekcija}`, code: '0' }
    ];

    const [ddCoffCoffItem, setDdCoffCoffItem] = useState(null);
    const [ddCoffCoffItems, setDdCoffCoffItems] = useState([]);
    const [coffCoffItem, setCoffCoffItem] = useState(null);
    const [coffCoffItems, setCoffCoffItems] = useState([]);

    const [ddCoffZapItem, setDdCoffZapItem] = useState(null);
    const [ddCoffZapItems, setDdCoffZapItems] = useState([]);
    const [coffZapItem, setCoffZapItem] = useState(null);
    const [coffZapItems, setCoffZapItems] = useState([]);
    const [defaultPotpisnik, setDefaultPotpisnik] = useState(null);
    const [assignedKitchen, setAssignedKitchen] = useState(null);
    const [coffDocVisible, setCoffDocVisible] = useState(true);
    const [user, setUser] = useState(storedUser);
    const canSelectRequester = canSeeAllRequesters;
    const [userCoff, setUserCoff] = useState(null);
    const normalizeEntity = (value) => Array.isArray(value) ? value[0] || null : value || null;
    const normalizeItems = (value) => Array.isArray(value) ? value : [];
    const normalizeId = (value) => {
        if (value === null || value === undefined) {
            return null;
        }

        const normalizedValue = String(value).trim();
        return normalizedValue === '' || normalizedValue === 'null' ? null : normalizedValue;
    };
    const resolveUserCoffId = (value) => {
        const normalizedValue = normalizeEntity(value);
        return normalizedValue?.coff ?? normalizedValue?.id ?? null;
    };
    const resolveUserIdentifier = (value) => {
        const normalizedValue = normalizeEntity(value);
        return (
            normalizeId(normalizedValue?.username) ??
            normalizeId(normalizedValue?.USERNAME) ??
            null
        );
    };
    const buildPersonDisplayName = (value, fallbackIdentifier = '') => {
        const normalizedValue = normalizeEntity(value);
        const explicitDisplayName =
            normalizedValue?.nzap1 ??
            normalizedValue?.N2ZAP1 ??
            normalizedValue?.NZAP1 ??
            normalizedValue?.nzap ??
            normalizedValue?.N2ZAP ??
            normalizedValue?.NZAP ??
            normalizedValue?.name ??
            normalizedValue?.nazap1;

        if (explicitDisplayName) {
            return explicitDisplayName;
        }

        const identifier = resolveUserIdentifier(normalizedValue) ?? fallbackIdentifier;
        const firstName =
            normalizedValue?.firstname ??
            normalizedValue?.FIRSTNAME ??
            normalizedValue?.firstName ??
            normalizedValue?.IME ??
            normalizedValue?.ime ??
            '';
        const secondName =
            normalizedValue?.secondname ??
            normalizedValue?.SECONDNAME ??
            normalizedValue?.lastname ??
            normalizedValue?.LASTNAME ??
            normalizedValue?.lastName ??
            normalizedValue?.PREZIME ??
            normalizedValue?.prezime ??
            '';

        return [identifier, firstName, secondName].filter(Boolean).join(' ').trim();
    };
    const resolveZapId = (value) => {
        const normalizedValue = normalizeEntity(value);
        return (
            normalizeId(normalizedValue?.username) ??
            normalizeId(normalizedValue?.potpisnik) ??
            normalizeId(normalizedValue?.zap1) ??
            normalizeId(normalizedValue?.id)
        );
    };
    const resolveDocUserId = (value) => {
        const normalizedValue = normalizeEntity(value);
        return (
            normalizeId(normalizedValue?.usr) ??
            normalizeId(normalizedValue?.userId) ??
            normalizeId(normalizedValue?.userid) ??
            normalizeId(normalizedValue?.user) ??
            null
        );
    };
    const resolveDocObjId = (value) => {
        const normalizedValue = normalizeEntity(value);
        return (
            normalizeId(normalizedValue?.obj) ??
            normalizeId(normalizedValue?.coff) ??
            normalizeId(normalizedValue?.id) ??
            null
        );
    };
	    const defaultUserIdentifier = resolveUserIdentifier(user) ?? resolveUserIdentifier(storedUser);
	    const defaultUserId =
	        normalizeId(user?.id) ||
	        normalizeId(storedUser?.id) ||
	        normalizeId(localStorage.getItem('userId')) ||
	        null;
	    const defaultUserDisplayName = buildPersonDisplayName(user) || buildPersonDisplayName(storedUser) || defaultUserIdentifier || '';


    useEffect(() => {
        async function fetchData() {
            try {
                const coffDocService = new CoffDocService();
                const data = await coffDocService.getCoffDocsUser(userId);
                const normalizedUser = normalizeEntity(data);

                setUser(normalizedUser || storedUser)
                const dataCoff = await coffDocService.getCoffDocsUserCoff(userId, 'COFFLOC');
                const normalizedUserCoff = normalizeEntity(dataCoff);
                // console.log(normalizedUser, "00-USRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSRUSR", normalizedUserCoff)
                setUserCoff(normalizedUserCoff)
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, [userId]);

    useEffect(() => {
        // Pozivaj backend samo kad su svi parametri spremni
        const memoUser = getStoredUser();
        const username = resolveUserIdentifier(memoUser);
        const loggedUserId = normalizeId(memoUser?.id) || normalizeId(localStorage.getItem('userId'));
        if (!userId || (!canSeeAllRequesters && !username) || !selectedLanguage) return;
        async function fetchData() {
            try {
                const coffZapService = new CoffZapService();
                const coffDocService = new CoffDocService();
                const [zapData, coffData, defaultPotpisnikData, assignedKitchenData] = await Promise.all([
                    canSeeAllRequesters ? coffZapService.getPotpisnici() : [],
                    coffDocService.getCmnObjListaLL('COFFLOC'),
                    username ? coffZapService.getPotpisnikByUsername(username) : null,
                    loggedUserId ? coffDocService.getCoffDocsUserCoff(loggedUserId, 'COFFLOC') : null
                ]);

                const normalizedZapData = Array.isArray(zapData) ? zapData : [];
                const normalizedCoffData = Array.isArray(coffData) ? coffData : [];
                const defaultZap = defaultPotpisnikData || null;
                const normalizedAssignedKitchen = Array.isArray(assignedKitchenData) ? assignedKitchenData[0] || null : assignedKitchenData || null;
                const coffDropdownOptions = normalizedCoffData.map(({ text, id }) => ({ name: text, code: normalizeId(id) }));

                const zapDropdownOptions = normalizedZapData.map((item) => ({
                    name: buildPersonDisplayName(item),
                    code: resolveZapId(item)
                }));

                console.log('[CoffDoc] potpisnici lista', normalizedZapData);
                console.log('[CoffDoc] potpisnici dropdown opcije', zapDropdownOptions);

                setCoffZapItems(normalizedZapData);
                setDdCoffZapItems(zapDropdownOptions);
                setCoffCoffItems(normalizedCoffData);
                setDdCoffCoffItems(coffDropdownOptions);
                setDefaultPotpisnik(defaultZap);
                setAssignedKitchen(normalizedAssignedKitchen);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [userId, canChooseKitchen, canSeeAllRequesters, selectedLanguage]);

    // Uklonjeno, sada se sve radi u gornjem useEffect-u

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    useEffect(() => {
        // Inicijalizacija kao u CoffDocPorudzbina
        const isCreateMode = props.docTip === 'CREATE';
        const statusCode = (props.coffDoc?.status && String(props.coffDoc.status)) || (isCreateMode ? '1' : '0');
        const selectedStatus = items.find((item) => item.code === statusCode) || null;

        // Pronađi potpisnika i kuhinju
        const defaultZap = defaultPotpisnik;
        const defaultObjId = normalizeId(assignedKitchen?.coff) ?? normalizeId(assignedKitchen?.id);
        const selectedPotpisnikId = isCreateMode
            ? (resolveZapId(defaultZap) ?? normalizeId(props.coffDoc?.potpisnik))
            : (normalizeId(props.coffDoc?.potpisnik) ?? resolveZapId(defaultZap));
        const selectedCoffId = isCreateMode
            ? (defaultObjId ?? normalizeId(props.coffDoc?.coff) ?? normalizeId(props.coffDoc?.obj))
            : (normalizeId(props.coffDoc?.coff) ?? normalizeId(props.coffDoc?.obj) ?? defaultObjId);

        const selectedZapOption = ddCoffZapItems.find((item) => normalizeId(item.code) === selectedPotpisnikId) || null;
        const selectedCoffOption = ddCoffCoffItems.find((item) => normalizeId(item.code) === selectedCoffId) || null;
        const selectedZap =
            coffZapItems.find((item) => resolveZapId(item) === selectedPotpisnikId) ||
            (resolveZapId(defaultZap) === selectedPotpisnikId ? defaultZap : null) ||
            null;
        const selectedCoff = coffCoffItems.find((item) => normalizeId(item.id) === selectedCoffId) || null;

        setDropdownItem(selectedStatus);
        setCoffDoc((prevState) => ({
            ...props.coffDoc,
            status: statusCode,
            potpisnik: selectedPotpisnikId,
            coff: selectedCoffId,
            obj: selectedCoffId,
            nzap: selectedZap?.nzap1 || selectedZap?.nzap || prevState.nzap,
            nzap1: selectedZap?.nzap1 || selectedZap?.nzap || prevState.nzap1,
            mesto: selectedCoff?.text || prevState.mesto,
            ncoff: selectedCoff?.text || prevState.ncoff,
        }));
        setDdCoffZapItem(selectedZapOption);
        setCoffZapItem(selectedZap);
        setDdCoffCoffItem(selectedCoffOption);
        setCoffCoffItem(selectedCoff);
        setDocTip(props.docTip);
        setSubmitted(false);
    }, [props.coffDoc, props.docTip, ddCoffZapItems, ddCoffCoffItems, coffZapItems, coffCoffItems, defaultPotpisnik, assignedKitchen]);

    const handleCancelClick = () => {
        props.setCoffDocVisible(false);
    };

		    const buildCoffDocPayload = () => {
			        const baseCoffDoc = { ...coffDoc };
		        const currentPotpisnik = ddCoffZapItem?.code ?? coffDoc.potpisnik ?? (canSeeAllRequesters ? null : defaultUserIdentifier) ?? null;
		        const currentNzap =
		            buildPersonDisplayName(coffZapItem) ||
		            ddCoffZapItem?.name ||
		            coffDoc.nzap ||
		            defaultUserDisplayName ||
		            "";
		        const currentCoff = ddCoffCoffItem?.code ?? coffDoc.coff ?? resolveUserCoffId(userCoff) ?? null;
		        const currentMesto = coffDoc.mesto ?? coffCoffItem?.text ?? coffDoc.ncoff ?? "";
			        const currentObj = coffDoc.obj ?? normalizeId(currentCoff) ?? currentCoff;
		        const currentStatus = dropdownItem?.code ?? coffDoc.status ?? "0";
	
				        return {
				            ...baseCoffDoc,
				            id: normalizeId(coffDoc.id) || coffDoc.id,
				            usr: normalizeId(coffDoc.usr) ?? coffDoc.usr ?? defaultUserId,
				            potpisnik: currentPotpisnik ?? defaultUserIdentifier,
				            nzap: currentNzap,
				            nzap1: currentNzap,
			            coff: normalizeId(currentCoff) || currentCoff,
		            obj: normalizeId(currentObj) || currentObj,
		            mesto: currentMesto,
		            status: String(currentStatus),
		            vreme: DateFunction.formatDatetimeR(DateFunction.currDatetime()),
		            ndoctp: normalizeId(props.ndoctp) || props.ndoctp
		        };
	    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const preparedCoffDoc = buildCoffDocPayload();

            if (!preparedCoffDoc.potpisnik || !preparedCoffDoc.coff) {
                toast.current.show({
                    severity: "warn",
                    summary: "Action",
                    detail: `${translations[selectedLanguage].Requiredfield}`,
                    life: 3000,
                });
                return;
            }

            const coffDocServiceCreate = new CoffDocService();
            const createdDocId = await coffDocServiceCreate.postCoffDoc(preparedCoffDoc);

            preparedCoffDoc.id = createdDocId;
            setCoffDoc({ ...preparedCoffDoc });
            props.handleDialogClose({ obj: preparedCoffDoc, docTip: props.docTip, docId: createdDocId });
            props.setCoffDocVisible(false);
            return;

            // Napravite kopiju `coffDoc` objekta
            const _coffDoc = { ...coffDoc };

            console.log("00-**************************************", coffZapItem);

            // Proverite da li `coffZapItem` postoji i ima svojstvo `N2ZAP`
            if (coffZapItem && coffZapItem.N2ZAP) {
                _coffDoc.nzap = coffZapItem.N2ZAP; // Ažurirajte kopiju `coffDoc` umesto originalnog
            } else {
                console.error("Error: `coffZapItem` is not defined or missing `N2ZAP` property.");
                return; // Izlaz iz funkcije ako je `coffZapItem` neispravan
            }

            console.log("01-**************************************");

            // Postavljanje dodatnih vrednosti u `_coffDoc`
            _coffDoc.vreme = DateFunction.formatDatetimeR(DateFunction.currDatetime());
            _coffDoc.ndoctp = props.ndoctp;

            console.log("02-**************************************");

            // Kreirajte CoffDoc pomoću servisa
            const coffDocService = new CoffDocService();
            const data = await coffDocService.postCoffDoc(_coffDoc);

            _coffDoc.id = data;  // Dodajte ID iz odgovora na kopiju `coffDoc`

            console.log(_coffDoc, "04 -**************************************", data);

            // Ažurirajte stanje sa novom kopijom `coffDoc`
            setCoffDoc(_coffDoc);

            // Zatvorite dijalog i prosledite novu kopiju `coffDoc`
            props.handleDialogClose({ obj: _coffDoc, docTip: props.docTip, docId: data });
            props.setCoffDocVisible(false);
        } catch (err) {
            console.error("Error in handleCreateClick:", err);
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: `${err.response?.data?.error || "An error occurred"}`,
                life: 5000,
            });
        }
    };


    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const preparedCoffDoc = buildCoffDocPayload();
            const coffDocServiceSave = new CoffDocService();
            setCoffDoc({ ...preparedCoffDoc });
            await coffDocServiceSave.putCoffDoc(preparedCoffDoc);
            props.handleDialogClose({ obj: preparedCoffDoc, docTip: props.docTip, docC: "Z" });
            props.setCoffDocVisible(false);
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(buildOrderChangedMessage({
                    source: 'CoffDoc.handleSaveClick',
                    docId: preparedCoffDoc?.id ?? null,
                    status: String(preparedCoffDoc?.status ?? ''),
                    objId: preparedCoffDoc?.obj ?? preparedCoffDoc?.coff ?? null,
                    userId: preparedCoffDoc?.usr ?? null,
                    notify: String(preparedCoffDoc?.status ?? '') === '1'
                }));
            }
            return;
            coffDoc.nzap = coffZapItem.N2ZAP
            coffDoc.vreme = DateFunction.formatDatetimeR(DateFunction.currDatetime())
            const coffDocService = new CoffDocService();
            await setCoffDoc({ ...coffDoc });
            await coffDocService.putCoffDoc(coffDoc);
            props.handleDialogClose({ obj: coffDoc, docTip: props.docTip, docC: "Z" });
            props.setCoffDocVisible(false);
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(buildOrderChangedMessage({
                    source: 'CoffDoc.handleSaveClickLegacy',
                    docId: coffDoc?.id ?? null,
                    status: String(coffDoc?.status ?? ''),
                    objId: coffDoc?.obj ?? coffDoc?.coff ?? null,
                    userId: coffDoc?.usr ?? null,
                    notify: String(coffDoc?.status ?? '') === '1'
                }));
            }
        } catch (err) {
            let msg = "An error occurred";
            if (err?.response?.data?.error) {
                msg = err.response.data.error;
            } else if (err?.message) {
                msg = err.message;
            }
            toast.current.show({
                severity: "error",
                summary: "Action ",
                detail: msg,
                life: 5000,
            });
        }
    };

	    const handleNextClick = async (event) => {
	        try {
	            setSubmitted(true);
	            const preparedCoffDoc = { ...buildCoffDocPayload() }
	            if (!preparedCoffDoc.potpisnik || !preparedCoffDoc.coff) {
	                toast.current.show({
	                    severity: "warn",
	                    summary: "Action",
	                    detail: `${translations[selectedLanguage].Requiredfield}`,
	                    life: 3000,
	                });
	                return;
	            }
	            const coffDocServiceNext = new CoffDocService();
	            if (event == 'CREATE') {
	                const createdDocId = await coffDocServiceNext.postCoffDoc(preparedCoffDoc);
	                preparedCoffDoc.id = createdDocId
	                preparedCoffDoc.nzap1 = preparedCoffDoc.nzap
	                setCoffDoc({ ...preparedCoffDoc })
	                props.handleDialogClose({
	                    obj: preparedCoffDoc,
	                    docTip: 'CREATE',
	                    stayOpen: true,
	                    nextDocTip: 'UPDATE',
	                    docId: createdDocId
	                });
	            } else {
	                preparedCoffDoc.nzap1 = preparedCoffDoc.nzap
	                await coffDocServiceNext.putCoffDoc(preparedCoffDoc);
	                setCoffDoc({ ...preparedCoffDoc })
	                props.handleDialogClose({
	                    obj: preparedCoffDoc,
	                    docTip: 'UPDATE',
	                    stayOpen: true,
	                    nextDocTip: 'UPDATE',
	                    docId: preparedCoffDoc.id
	                });
	            }
	            setDocTip('UPDATE');
            return;
            const _coffDoc = { ...coffDoc }
            coffDoc.nzap = coffZapItem.N2ZAP
            coffDoc.vreme = DateFunction.formatDatetimeR(DateFunction.currDatetime())
            coffDoc.ndoctp = props.ndoctp
            coffDoc.obj = -1
            const coffDocService = new CoffDocService();
            if (event == 'CREATE') {
                const data = await coffDocService.postCoffDoc(coffDoc);
                coffDoc.id = data
                console.log(coffDoc, data, "#############handleNextClick##############", event)
                setCoffDoc({ ...coffDoc })
                props.handleDialogClose({ obj: coffDoc, docTip: props.docTip });
            } else {
                await coffDocService.putCoffDoc(coffDoc);
            }
            setDocTip('UPDATE');
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
            const coffDocService = new CoffDocService();
            await coffDocService.deleteCoffDoc(coffDoc);
            props.handleDialogClose({ obj: coffDoc, docTip: 'DELETE' });
            props.setCoffDocVisible(false);
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

    const onInputChange = (e, type, name) => {
        if (type === "options") {
            if (name === "potpisnik") {
                const selectedOption = e.value;
                const selectedValue = normalizeId(selectedOption?.code);
                const foundItem =
                    coffZapItems.find((item) => resolveZapId(item) === selectedValue) ||
                    (resolveZapId(defaultPotpisnik) === selectedValue ? defaultPotpisnik : null) ||
                    null;
                const selectedUsrId = resolveDocUserId(foundItem);
                const selectedCoffId = resolveDocObjId(foundItem);
                const foundCoffItem = coffCoffItems.find((item) => normalizeId(item.id) === selectedCoffId) || null;

                setDdCoffZapItem(selectedOption);
                setCoffZapItem(foundItem || null);

                if (canChooseKitchen && selectedCoffId) {
                    setDdCoffCoffItem(ddCoffCoffItems?.find((item) => normalizeId(item.code) === selectedCoffId) || null);
                    setCoffCoffItem(foundCoffItem || null);
                }

                setCoffDoc((prevState) => ({
                    ...prevState,
                    usr: selectedUsrId ?? prevState.usr,
                    potpisnik: selectedValue,
                    nzap: buildPersonDisplayName(foundItem) || prevState.nzap,
                    nzap1: foundItem?.nzap1 || buildPersonDisplayName(foundItem) || prevState.nzap1,
                    coff: canChooseKitchen ? (selectedCoffId ?? prevState.coff) : prevState.coff,
                    obj: canChooseKitchen ? (selectedCoffId ?? prevState.obj) : prevState.obj,
                    mesto: canChooseKitchen ? (foundCoffItem?.text || prevState.mesto) : prevState.mesto,
                    ncoff: canChooseKitchen ? (foundCoffItem?.text || prevState.ncoff) : prevState.ncoff,
                }));
                return;
            }

            if (name === "coff") {
                const selectedValue = normalizeId(e.value?.code ?? e.value);
                const foundItem = coffCoffItems.find((item) => normalizeId(item.id) === selectedValue);

                setDdCoffCoffItem(e.value);
                setCoffCoffItem(foundItem || null);
                setCoffDoc((prevState) => ({
                    ...prevState,
                    coff: selectedValue,
                    obj: selectedValue,
                    mesto: foundItem?.text || prevState.mesto,
                    ncoff: foundItem?.text || prevState.ncoff,
                }));
                return;
            }
            if (name === "status") {
                const selectedOption = e.value;
                const selectedValue = selectedOption?.code;
                setDropdownItem(selectedOption);
                setCoffDoc((prevState) => ({
                    ...prevState,
                    status: selectedValue,
                }));
                return;
            }
        }

        const val = (e.target && e.target.value) || '';
        setCoffDoc((prevState) => ({
            ...prevState,
            [name]: val,
        }));
    };
    const handleDialogClose = (newObj) => {
        const localObj = { newObj };
    }
    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid glass-form glass-dialog-form doc-entry-dialog-layout">
            <Toast ref={toast} />
            <div className="col-12 doc-entry-dialog-main">
                <div className="card glass-card">
                    <div className="p-fluid formgrid grid">
                        {canSelectRequester ?
                            <div className="field col-12 md:col-6">
                                <label htmlFor="potpisnik">{translations[selectedLanguage].potpisnik} *</label>
                                <Dropdown id="potpisnik"
                                    value={ddCoffZapItem}
                                    options={ddCoffZapItems}
                                    onChange={(e) => onInputChange(e, "options", 'potpisnik')}
                                    required
                                    optionLabel="name"
                                    filter
                                    filterBy="name,code"
                                    placeholder="Select One"
                                    className={classNames({ 'p-invalid': submitted && !coffDoc.potpisnik })}
                                />
                                {submitted && !coffDoc.potpisnik && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                            </div> : null}
                        {canChooseKitchen ? (
                            <div className="field col-12 md:col-4">
                                <label htmlFor="coff">{translations[selectedLanguage].Coff} *</label>
                                <Dropdown id="coff"
                                    value={ddCoffCoffItem}
                                    options={ddCoffCoffItems}
                                    onChange={(e) => onInputChange(e, "options", 'coff')}
                                    required
                                    optionLabel="name"
                                    filter
                                    filterBy="name,code"
                                    placeholder="Select One"
                                    className={classNames({ 'p-invalid': submitted && !coffDoc.coff })}
                                />
                                {submitted && !coffDoc.coff && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                            </div>
                        ) : null}
                        <div className="field col-12 md:col-6">
                            <label htmlFor="mesto">{translations[selectedLanguage].Loc}</label>
                            <InputText
                                id="mesto"
                                value={coffDoc.mesto} onChange={(e) => onInputChange(e, "text", 'mesto')}
                            />
                        </div>
                        {(props.doctp) ? (
                            <div className="field col-12 md:col-6">
                                <label htmlFor="eksternibroj">{translations[selectedLanguage].eksternibroj}</label>
                                <InputText
                                    id="eksternibroj"
                                    value={coffDoc.eksternibroj} onChange={(e) => onInputChange(e, "text", 'eksternibroj')}
                                />
                            </div>
                        ) : null}
                        <div className="field col-12 md:col-8">
                            <label htmlFor="napomena">{translations[selectedLanguage].napomena}</label>
                            <InputText
                                id="napomena"
                                value={coffDoc.napomena} onChange={(e) => onInputChange(e, "text", 'napomena')}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="status">{translations[selectedLanguage].Status}</label>
                            <Dropdown id="status"
                                value={dropdownItem}
                                options={dropdownItems}
                                onChange={(e) => onInputChange(e, "options", 'status')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-instatus': submitted && !coffDoc.status })}
                            />
                            {submitted && !coffDoc.status && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? (
                            <Button
                                label={translations[selectedLanguage].Close}
                                icon="pi pi-times"
                                className="p-button-outlined p-button-secondary"
                                onClick={handleCancelClick}
                                outlined
                            />
                        ) : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {(props.docTip === 'CREATE' && canCreate) ? (
                                <Button
                                    label={translations[selectedLanguage].Create}
                                    icon="pi pi-check"
                                    onClick={handleCreateClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.docTip !== 'CREATE' && canDelete) ? (
                                <Button
                                    label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash"
                                    onClick={showDeleteDialog}
                                    className="p-button-outlined p-button-danger"
                                    outlined
                                />
                            ) : null}
                            {(props.docTip !== 'CREATE' && canUpdate) ? (
                                <Button
                                    label={translations[selectedLanguage].Save}
                                    icon="pi pi-check"
                                    onClick={handleSaveClick}
                                    severity="success"
                                    outlined
                                />
                            ) : null}
                            {(props.standard) ? (
                                (props.docTip == 'CREATE') ? (
                                    canCreate ? (
                                        <Button
                                            label={translations[selectedLanguage].CreateSt}
                                            icon="pi pi-check"
                                            onClick={() => handleNextClick('CREATE')}
                                            severity="success"
                                            outlined
                                        />
                                    ) : null
                                ) : (
                                    canUpdate ? (
                                        <Button
                                            label={translations[selectedLanguage].SaveSt}
                                            icon="pi pi-check"
                                            onClick={() => handleNextClick('UPDATE')}
                                            severity="success"
                                            outlined
                                        />
                                    ) : null
                                )
                            ) : (null)
                            }
                        </div>
                    </div>
                </div>
                {(props.stVisible) ? (
                    <div className="col-lg-12 details order-1 order-lg-1 doc-entry-dialog-items">
                        < CoffDocsL
                            parameter={"inputTextValue"}
                            coffDoc={coffDoc}
                            doctp={props.doctp}
                            handleDialogClose={handleDialogClose}
                            setCoffDocVisible={setCoffDocVisible}
                            dialog={true}
                            datarefresh={props.dataTab}
                        // onDataUpdate={handleDataUpdate} 
                        />
                    </div>
                ) : null}
            </div>
            <DeleteDialog
                visible={deleteDialogVisible}
                inAction="delete"
                item={coffDoc.text}
                onHide={hideDeleteDialog}
                onDelete={handleDeleteClick}
            />
        </div>
    );
};

export default CoffDoc;
