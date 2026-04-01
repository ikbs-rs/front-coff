import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { CoffDocService } from "../../service/model/CoffDocService";
import { CoffZapService } from "../../service/model/CoffZapService";
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from "primereact/toast";
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from "../../configs/translations";
import { useCrudActionPermissions, usePermission } from '../../security/interceptors';
import DateFunction from "../../utilities/DateFunction";
import CoffDocsL from './coffDocsL';
import { buildOrderChangedMessage, useWebSocket } from '../../utilities/WebSocketContext';

const CoffDocOrder = (props) => {
    const { canCreate, canUpdate, canDelete } = useCrudActionPermissions('coff_doc');
    const canSeeAllRequesters = usePermission('coffCOFF');
    const canChooseKitchen = usePermission('coffNarucilac');
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const websocket = useWebSocket();
    const toast = useRef(null);

    const items = [
        { name: `${translations[selectedLanguage].Isporuceno}`, code: '3' },
        { name: `${translations[selectedLanguage].Cekanje}`, code: '2' },
        { name: `${translations[selectedLanguage].Prijem}`, code: '1' },
        { name: `${translations[selectedLanguage].Selekcija}`, code: '0' }
    ];

    const getStoredUser = () => {
        try {
            return JSON.parse(localStorage.getItem('user') || 'null');
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const storedUser = getStoredUser();
    const user = storedUser;
    const canSelectRequester = canSeeAllRequesters;

    const normalizeId = (value) => {
        if (value === null || value === undefined) {
            return null;
        }

        const normalizedValue = String(value).trim();
        return normalizedValue === '' || normalizedValue === 'null' ? null : normalizedValue;
    };

    const resolveLoggedUserId = () =>
        normalizeId(storedUser?.id) ??
        normalizeId(storedUser?.ID) ??
        normalizeId(localStorage.getItem('userId'));

    const resolveLoggedUsername = () =>
        normalizeId(storedUser?.username) ??
        normalizeId(storedUser?.USERNAME);

    const resolveZapId = (value) =>
        normalizeId(value?.username) ??
        normalizeId(value?.potpisnik) ??
        normalizeId(value?.zap1) ??
        normalizeId(value?.id);

    const resolveZapName = (value) =>
        value?.nzap1 ??
        value?.nzap ??
        value?.N2ZAP ??
        value?.NZAP ??
        '';

    const resolveZapUserId = (value) =>
        normalizeId(value?.usr) ??
        normalizeId(value?.userId) ??
        normalizeId(value?.userid) ??
        normalizeId(value?.user) ??
        normalizeId(value?.korisnik);

    const resolveZapObjId = (value) =>
        normalizeId(value?.obj) ??
        normalizeId(value?.coff) ??
        normalizeId(value?.objid);

    const resolveAssignedKitchenId = (value) =>
        normalizeId(value?.coff) ??
        normalizeId(value?.obj) ??
        normalizeId(value?.id);

    const hasValue = (value) => normalizeId(value) !== null;

    const buildZapOptions = (zapItems, fallbackZap) => {
        const options = (Array.isArray(zapItems) ? zapItems : []).map((item) => ({
            name: resolveZapName(item),
            code: resolveZapId(item)
        }));

        const fallbackCode = resolveZapId(fallbackZap);
        if (fallbackCode && !options.some((item) => item.code === fallbackCode)) {
            options.unshift({
                name: resolveZapName(fallbackZap),
                code: fallbackCode
            });
        }

        return options;
    };

    const buildInitialCoffDoc = (sourceDoc, zapDefaults, coffItems, assignedKitchen) => {
        const isCreateMode = props.docTip === 'CREATE';
        const loggedUserId = resolveLoggedUserId();
        const defaultZapId = canSeeAllRequesters ? null : resolveZapId(zapDefaults);
        const defaultObjId = resolveAssignedKitchenId(assignedKitchen) ?? normalizeId(zapDefaults?.obj);

        const selectedPotpisnikId = isCreateMode
            ? (defaultZapId ?? normalizeId(sourceDoc?.potpisnik))
            : (normalizeId(sourceDoc?.potpisnik) ?? defaultZapId);
        const selectedCoffId = isCreateMode
            ? (defaultObjId ?? normalizeId(sourceDoc?.coff) ?? normalizeId(sourceDoc?.obj))
            : (normalizeId(sourceDoc?.coff) ?? normalizeId(sourceDoc?.obj) ?? defaultObjId);

        const selectedCoff = (coffItems || []).find((item) => normalizeId(item.id) === selectedCoffId) || null;

        return {
            ...sourceDoc,
            usr: loggedUserId ?? sourceDoc?.usr ?? null,
            potpisnik: selectedPotpisnikId ?? sourceDoc?.potpisnik ?? null,
            nzap: hasValue(sourceDoc?.nzap) ? sourceDoc.nzap : (zapDefaults?.nzap || resolveZapName(zapDefaults)),
            nzap1: hasValue(sourceDoc?.nzap1) ? sourceDoc.nzap1 : (zapDefaults?.nzap1 || resolveZapName(zapDefaults)),
            coff: selectedCoffId ?? sourceDoc?.coff ?? null,
            obj: selectedCoffId ?? sourceDoc?.obj ?? null,
            mesto: hasValue(sourceDoc?.mesto) ? sourceDoc.mesto : (selectedCoff?.text || ''),
        };
    };

    const findDropdownItemByCode = (code) =>
        items.find((item) => item.code === String(code ?? '0')) || null;

    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [coffDoc, setCoffDoc] = useState(props.coffDoc);
    const [docTip, setDocTip] = useState(props.docTip);
    const [submitted, setSubmitted] = useState(false);

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

    useEffect(() => {
        async function fetchData() {
            try {
                const coffZapService = new CoffZapService();
                const coffDocService = new CoffDocService();
                const username = resolveLoggedUsername();

                const loggedUserId = resolveLoggedUserId();
                const [zapData, coffData, defaultPotpisnikData, assignedKitchenData] = await Promise.all([
                    canSelectRequester ? coffZapService.getPotpisnici() : Promise.resolve([]),
                    coffDocService.getCmnObjListaLL('COFFLOC'),
                    username
                        ? coffDocService.getPotpisnikByUsername(username)
                        : Promise.resolve(null),
                    loggedUserId
                        ? coffDocService.getCoffDocsUserCoff(loggedUserId, 'COFFLOC')
                        : Promise.resolve(null)
                ]);

                const normalizedZapData = Array.isArray(zapData) ? zapData : [];
                const normalizedCoffData = Array.isArray(coffData) ? coffData : [];
                const defaultZap = defaultPotpisnikData || null;
                const normalizedAssignedKitchen = Array.isArray(assignedKitchenData) ? assignedKitchenData[0] || null : assignedKitchenData || null;

                setCoffZapItems(normalizedZapData);
                setDdCoffZapItems(buildZapOptions(normalizedZapData, defaultZap));
                setCoffCoffItems(normalizedCoffData);
                setDdCoffCoffItems(
                    normalizedCoffData.map(({ text, id }) => ({
                        name: text,
                        code: normalizeId(id)
                    }))
                );
                setDefaultPotpisnik(defaultZap);
                setAssignedKitchen(normalizedAssignedKitchen);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [canChooseKitchen, canSelectRequester]);

    useEffect(() => {
        setDropdownItems(items);
    }, []);

    useEffect(() => {
        setDropdownItem(findDropdownItemByCode(props.coffDoc?.status ?? coffDoc?.status));
    }, [props.coffDoc?.status]);

    useEffect(() => {
        setDocTip(props.docTip);
        setSubmitted(false);
    }, [props.docTip]);

    useEffect(() => {
        const nextCoffDoc = buildInitialCoffDoc(props.coffDoc, defaultPotpisnik, coffCoffItems, assignedKitchen);
        const selectedPotpisnikId = normalizeId(nextCoffDoc.potpisnik);
        const selectedCoffId = normalizeId(nextCoffDoc.coff) ?? normalizeId(nextCoffDoc.obj);
        const selectedZapOption = ddCoffZapItems.find((item) => item.code === selectedPotpisnikId) || null;
        const selectedCoffOption = ddCoffCoffItems.find((item) => item.code === selectedCoffId) || null;
        const selectedZap =
            coffZapItems.find((item) => resolveZapId(item) === selectedPotpisnikId) ||
            (resolveZapId(defaultPotpisnik) === selectedPotpisnikId ? defaultPotpisnik : null);
        const selectedCoff =
            coffCoffItems.find((item) => normalizeId(item.id) === selectedCoffId) || null;

        setCoffDoc(nextCoffDoc);
        setCoffZapItem(selectedZap || null);
        setDdCoffZapItem(selectedZapOption || null);
        setCoffCoffItem(selectedCoff || null);
        setDdCoffCoffItem(selectedCoffOption || null);
    }, [props.coffDoc, props.docTip, coffZapItems, coffCoffItems, ddCoffZapItems, ddCoffCoffItems, defaultPotpisnik, assignedKitchen, canSeeAllRequesters]);

    const buildCoffDocPayload = () => {
        const currentPotpisnik = ddCoffZapItem?.code ?? normalizeId(coffDoc?.potpisnik) ?? resolveZapId(defaultPotpisnik);
        const currentZap =
            coffZapItems.find((item) => resolveZapId(item) === currentPotpisnik) ||
            (resolveZapId(defaultPotpisnik) === currentPotpisnik ? defaultPotpisnik : null) ||
            coffZapItem;
        const currentCoffId = ddCoffCoffItem?.code ?? normalizeId(coffDoc?.coff) ?? normalizeId(coffDoc?.obj) ?? resolveAssignedKitchenId(assignedKitchen);
        const currentCoff =
            coffCoffItems.find((item) => normalizeId(item.id) === currentCoffId) ||
            coffCoffItem;
        const currentStatus = dropdownItem?.code ?? coffDoc?.status ?? '0';
        const currentNzap = coffDoc?.nzap || currentZap?.nzap || resolveZapName(currentZap);

        return {
            ...coffDoc,
            id: normalizeId(coffDoc?.id) ?? coffDoc?.id,
            usr: normalizeId(coffDoc?.usr) ?? resolveLoggedUserId() ?? null,
            potpisnik: currentPotpisnik,
            nzap: currentNzap,
            nzap1: coffDoc?.nzap1 || currentZap?.nzap1 || currentNzap,
            coff: currentCoffId,
            obj: normalizeId(coffDoc?.obj) ?? currentCoffId,
            mesto: coffDoc?.mesto || currentCoff?.text || '',
            status: String(currentStatus),
            vreme: DateFunction.formatDatetimeR(DateFunction.currDatetime()),
            ndoctp: normalizeId(props.ndoctp) || props.ndoctp
        };
    };

    const validatePayload = (payload) => Boolean(payload?.potpisnik && payload?.coff);

    const handleCancelClick = () => {
        props.setCoffDocVisible(false);
    };

    const showRequiredFieldMessage = () => {
        toast.current.show({
            severity: "warn",
            summary: "Action",
            detail: `${translations[selectedLanguage].Requiredfield}`,
            life: 3000,
        });
    };

    const showError = (err) => {
        toast.current.show({
            severity: "error",
            summary: "Action ",
            detail: `${err.response?.data?.error || err.message}`,
            life: 5000,
        });
    };

    const handleCreateClick = async () => {
        try {
            setSubmitted(true);
            const payload = buildCoffDocPayload();

            if (!validatePayload(payload)) {
                showRequiredFieldMessage();
                return;
            }

            const coffDocService = new CoffDocService();
            const createdDocId = await coffDocService.postCoffDoc(payload);
            const nextCoffDoc = { ...payload, id: createdDocId };

            setCoffDoc(nextCoffDoc);
            props.handleDialogClose({ obj: nextCoffDoc, docTip: props.docTip, docId: createdDocId });
            props.setCoffDocVisible(false);
        } catch (err) {
            showError(err);
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            const payload = buildCoffDocPayload();

            if (!validatePayload(payload)) {
                showRequiredFieldMessage();
                return;
            }

            const coffDocService = new CoffDocService();
            await coffDocService.putCoffDoc(payload);
            setCoffDoc(payload);
            props.handleDialogClose({ obj: payload, docTip: props.docTip, docC: "Z" });
            props.setCoffDocVisible(false);
            if (websocket && websocket.readyState === WebSocket.OPEN) {
                websocket.send(buildOrderChangedMessage({
                    source: 'CoffDocOrder.handleSaveClick',
                    docId: payload?.id ?? null,
                    status: String(payload?.status ?? ''),
                    objId: payload?.obj ?? payload?.coff ?? null,
                    userId: payload?.usr ?? null,
                    notify: String(payload?.status ?? '') === '1'
                }));
            }
        } catch (err) {
            showError(err);
        }
    };

    const handleNextClick = async (event) => {
        try {
            setSubmitted(true);
            const payload = buildCoffDocPayload();

            if (!validatePayload(payload)) {
                showRequiredFieldMessage();
                return;
            }

            const coffDocService = new CoffDocService();

            if (event === 'CREATE') {
                const createdDocId = await coffDocService.postCoffDoc(payload);
                const nextCoffDoc = { ...payload, id: createdDocId };
                setCoffDoc(nextCoffDoc);
                props.handleDialogClose({
                    obj: nextCoffDoc,
                    docTip: 'CREATE',
                    stayOpen: true,
                    nextDocTip: 'UPDATE',
                    docId: createdDocId
                });
            } else {
                await coffDocService.putCoffDoc(payload);
                setCoffDoc(payload);
                props.handleDialogClose({
                    obj: payload,
                    docTip: 'UPDATE',
                    stayOpen: true,
                    nextDocTip: 'UPDATE',
                    docId: payload.id
                });
            }

            setDocTip('UPDATE');
        } catch (err) {
            showError(err);
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
            showError(err);
        }
    };

    const onInputChange = (e, type, name) => {
        if (type === "options") {
            if (name === "potpisnik") {
                const selectedOption = e.value;
                const selectedValue = normalizeId(selectedOption?.code);
                const foundItem =
                    coffZapItems.find((item) => resolveZapId(item) === selectedValue) ||
                    (resolveZapId(defaultPotpisnik) === selectedValue ? defaultPotpisnik : null);
                const selectedUsrId = resolveZapUserId(foundItem);
                const selectedCoffId = resolveZapObjId(foundItem);
                const foundCoffItem = coffCoffItems.find((item) => normalizeId(item.id) === selectedCoffId) || null;
                const selectedCoffOption = foundCoffItem
                    ? { name: foundCoffItem.text, code: selectedCoffId }
                    : null;

                setDdCoffZapItem(selectedOption);
                setCoffZapItem(foundItem || null);

                if (canChooseKitchen && selectedCoffOption) {
                    setDdCoffCoffItem(selectedCoffOption);
                    setCoffCoffItem(foundCoffItem);
                }

                setCoffDoc((prevState) => ({
                    ...prevState,
                    usr: selectedUsrId ?? prevState.usr,
                    potpisnik: selectedValue,
                    nzap: foundItem?.nzap || resolveZapName(foundItem) || prevState.nzap,
                    nzap1: foundItem?.nzap1 || resolveZapName(foundItem) || prevState.nzap1,
                    coff: canChooseKitchen ? (selectedCoffId ?? prevState.coff) : (prevState.coff ?? resolveAssignedKitchenId(assignedKitchen)),
                    obj: canChooseKitchen ? (selectedCoffId ?? prevState.obj) : (prevState.obj ?? resolveAssignedKitchenId(assignedKitchen)),
                    mesto: canChooseKitchen ? (foundCoffItem?.text || prevState.mesto) : prevState.mesto,
                    ncoff: canChooseKitchen ? (foundCoffItem?.text || prevState.ncoff) : prevState.ncoff,
                }));
                return;
            }

            if (name === "coff") {
                const selectedOption = e.value;
                const selectedValue = normalizeId(selectedOption?.code);
                const foundItem = coffCoffItems.find((item) => normalizeId(item.id) === selectedValue);

                setDdCoffCoffItem(selectedOption);
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

            const selectedOption = e.value;
            const selectedValue = normalizeId(selectedOption?.code);
            setDropdownItem(selectedOption);
            setCoffDoc((prevState) => ({
                ...prevState,
                [name]: selectedValue,
            }));
            return;
        }

        const val = (e.target && e.target.value) || '';
        setCoffDoc((prevState) => ({
            ...prevState,
            [name]: val,
        }));
    };

    const handleDialogClose = () => { };

    const hideDeleteDialog = () => {
        setDeleteDialogVisible(false);
    };

    return (
        <div className="grid glass-form glass-dialog-form doc-entry-dialog-layout">
            <Toast ref={toast} />
            <div className="col-12 doc-entry-dialog-main">
                <div className="card glass-card">
                    <div className="p-fluid formgrid grid">
                        {canSelectRequester ? (
                            <div className="field col-12 md:col-6">
                                <label htmlFor="potpisnik">{translations[selectedLanguage].potpisnik} *</label>
                                <Dropdown
                                    id="potpisnik"
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
                            </div>
                        ) : null}
                        {canChooseKitchen ? (
                            <div className="field col-12 md:col-4">
                                <label htmlFor="coff">{translations[selectedLanguage].Coff} *</label>
                                <Dropdown
                                    id="coff"
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
                                value={coffDoc.mesto || ''}
                                onChange={(e) => onInputChange(e, "text", 'mesto')}
                            />
                        </div>
                        {(props.doctp) ? (
                            <div className="field col-12 md:col-6">
                                <label htmlFor="eksternibroj">{translations[selectedLanguage].eksternibroj}</label>
                                <InputText
                                    id="eksternibroj"
                                    value={coffDoc.eksternibroj || ''}
                                    onChange={(e) => onInputChange(e, "text", 'eksternibroj')}
                                />
                            </div>
                        ) : null}
                        <div className="field col-12 md:col-8">
                            <label htmlFor="napomena">{translations[selectedLanguage].napomena}</label>
                            <InputText
                                id="napomena"
                                value={coffDoc.napomena || ''}
                                onChange={(e) => onInputChange(e, "text", 'napomena')}
                            />
                        </div>
                        <div className="field col-12 md:col-4">
                            <label htmlFor="status">{translations[selectedLanguage].Status}</label>
                            <Dropdown
                                id="status"
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
                                (docTip === 'CREATE') ? (
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
                            ) : null}
                        </div>
                    </div>
                </div>
                {(props.stVisible) ? (
                    <div className="col-lg-12 details order-1 order-lg-1 doc-entry-dialog-items">
                        <CoffDocsL
                            parameter={"inputTextValue"}
                            coffDoc={coffDoc}
                            doctp={props.doctp}
                            handleDialogClose={handleDialogClose}
                            setCoffDocVisible={props.setCoffDocVisible}
                            dialog={true}
                            datarefresh={props.dataTab}
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

export default CoffDocOrder;

