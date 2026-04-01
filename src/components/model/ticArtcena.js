import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { TicArtcenaService } from '../../service/model/TicArtcenaService';
import { TicCenaService } from '../../service/model/TicCenaService';
import './index.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import DeleteDialog from '../dialog/DeleteDialog';
import { translations } from '../../configs/translations';
import { useCrudActionPermissions } from '../../security/interceptors';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import DateFunction from '../../utilities/DateFunction';
import { CmnUmService } from '../../service/model/cmn/CmnUmService';
import { defaultValue } from '../../configs/defaultValue';

const TicArtcena = (props) => {
    const { canCreate, canUpdate, canDelete } = useCrudActionPermissions('tic_artcena');
    console.log(props, '===================TicArtcena======================');
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const initialUm = props.ticArtcena.um || props.ticArt.um || null;
    const initialCena = props.ticArtcena.cena || defaultValue.tic?.cena || defaultValue.def?.cena || null;
    const initialCurr = props.ticArtcena.curr || defaultValue.tic?.curr || defaultValue.def?.curr || '1';
    const initialTerr = props.ticArtcena.terr || defaultValue.tic?.terr || defaultValue.def?.terr || null;
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [ticArtcena, setTicArtcena] = useState({ ...props.ticArtcena, um: initialUm, cena: initialCena, curr: initialCurr, terr: initialTerr });
    const [submitted, setSubmitted] = useState(false);

    const [ddTicCena, setDdTicCenaItem] = useState(null);
    const [ddTicCenas, setDdTicCenaItems] = useState(null);
    const [ticCenaItem, setTicCenaItem] = useState(null);
    const [ticCenaItems, setTicCenaItems] = useState(null);

    const [ddCmnCurr, setDdCmnCurrItem] = useState(null);
    const [ddCmnCurrs, setDdCmnCurrItems] = useState(null);
    const [cmnCurrItem, setCmnCurrItem] = useState(null);
    const [cmnCurrItems, setCmnCurrItems] = useState(null);

    const [ddCmnTerr, setDdCmnTerrItem] = useState(null);
    const [ddCmnTerrs, setDdCmnTerrItems] = useState(null);
    const [cmnTerrItem, setCmnTerrItem] = useState(null);
    const [cmnTerrItems, setCmnTerrItems] = useState(null);

    const [ddCmnUm, setDdCmnUmItem] = useState(null);
    const [ddCmnUms, setDdCmnUmItems] = useState(null);
    const [cmnUmItem, setCmnUmItem] = useState(null);
    const [cmnUmItems, setCmnUmItems] = useState(null);

    const [begda, setBegda] = useState(new Date(DateFunction.formatJsDate(props.ticArtcena.begda || DateFunction.currDate())));
    const [endda, setEndda] = useState(new Date(DateFunction.formatJsDate(props.ticArtcena.endda || '99991231')));

    const calendarRef = useRef(null);

    const toast = useRef(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticCenaService = new TicCenaService();
                const data = await ticCenaService.getTicCenas();
                const selectedCena = props.ticArtcena.cena || initialCena;
                const foundItem = data.find((item) => `${item.id}` === `${selectedCena}`) || data.find((item) => `${item.code || ''}`.toUpperCase() === 'EMS');

                setTicCenaItems(data);
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdTicCenaItems(dataDD);
                setDdTicCenaItem(dataDD.find((item) => `${item.code}` === `${selectedCena}`) || (foundItem ? { name: foundItem.textx, code: foundItem.id } : null));

                if (foundItem) {
                    setTicCenaItem(foundItem || null);
                    setTicArtcena((prevState) => ({
                        ...prevState,
                        cena: foundItem.id,
                        ccena: foundItem.code,
                        ncena: foundItem.textx
                    }));
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticCenaService = new TicCenaService();
                const data = await ticCenaService.getCmnCurrs();
                const selectedCurr = props.ticArtcena.curr || initialCurr;
                const foundItem = data.find((item) => `${item.id}` === `${selectedCurr}`) || data.find((item) => `${item.code}` === `${selectedCurr}` || `${item.textx || ''}`.toUpperCase().includes('RSD'));

                setCmnCurrItems(data);
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnCurrItems(dataDD);
                setDdCmnCurrItem(dataDD.find((item) => `${item.code}` === `${selectedCurr}`) || (foundItem ? { name: foundItem.textx, code: foundItem.id } : null));

                if (foundItem) {
                    setCmnCurrItem(foundItem || null);
                    setTicArtcena((prevState) => ({
                        ...prevState,
                        curr: foundItem.id,
                        ncurr: foundItem.textx,
                        ccurr: foundItem.code
                    }));
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const ticCenaService = new TicCenaService();
                const data = await ticCenaService.getCmnTerrs();
                const selectedTerr = props.ticArtcena.terr || initialTerr;
                const foundItem = data.find((item) => `${item.id}` === `${selectedTerr}`) || data.find((item) => `${item.code}` === `${selectedTerr}` || `${item.textx || ''}`.toLowerCase().includes('srb'));

                setCmnTerrItems(data);
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnTerrItems(dataDD);
                setDdCmnTerrItem(dataDD.find((item) => `${item.code}` === `${selectedTerr}`) || (foundItem ? { name: foundItem.textx, code: foundItem.id } : null));

                if (foundItem) {
                    setCmnTerrItem(foundItem || null);
                    setTicArtcena((prevState) => ({
                        ...prevState,
                        terr: foundItem.id,
                        nterr: foundItem.textx,
                        cterr: foundItem.code
                    }));
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const cmnUmService = new CmnUmService();
                const data = await cmnUmService.getCmnUms();
                setCmnUmItems(data);
                const dataDD = data.map(({ textx, id }) => ({ name: textx, code: id }));
                setDdCmnUmItems(dataDD);
                setDdCmnUmItem(dataDD.find((item) => `${item.code}` === `${initialUm}`) || null);

                if (initialUm) {
                    const foundItem = data.find((item) => `${item.id}` === `${initialUm}`);
                    setCmnUmItem(foundItem || null);

                    if (foundItem) {
                        setTicArtcena((prevState) => ({
                            ...prevState,
                            um: foundItem.id,
                            num: foundItem.textx,
                            cum: foundItem.code
                        }));
                    }
                }
            } catch (error) {
                console.error(error);
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
            ticArtcena.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticArtcena.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticArtcenaService = new TicArtcenaService();
            const data = await ticArtcenaService.postTicArtcena(ticArtcena);
            ticArtcena.id = data;
            props.handleDialogClose({ obj: ticArtcena, artcenaTip: props.artcenaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'TicArtcena ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const handleSaveClick = async () => {
        try {
            setSubmitted(true);
            ticArtcena.begda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(begda));
            ticArtcena.endda = DateFunction.formatDateToDBFormat(DateFunction.dateGetValue(endda));
            const ticArtcenaService = new TicArtcenaService();
            ticArtcena.event = null

            await ticArtcenaService.putTicArtcena(ticArtcena);
            props.handleDialogClose({ obj: ticArtcena, artcenaTip: props.artcenaTip });
            props.setVisible(false);
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'TicArtcena ',
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
            const ticArtcenaService = new TicArtcenaService();
            await ticArtcenaService.deleteTicArtcena(ticArtcena);
            props.handleDialogClose({ obj: ticArtcena, artcenaTip: 'DELETE' });
            props.setVisible(false);
            hideDeleteDialog();
        } catch (err) {
            toast.current.show({
                severity: 'error',
                summary: 'TicArtcena ',
                detail: `${err.response.data.error}`,
                life: 5000
            });
        }
    };

    const onInputChange = (e, type, name, a) => {
        let val = '';

        if (type === 'options') {
            val = (e.target && e.target.value && e.target.value.code) || '';
            if (type === 'options') {
                if (name == 'cena') {
                    setDdTicCenaItem(e.value);
                    const foundItem = ticCenaItems.find((item) => item.id === val);
                    setTicCenaItem(foundItem || null);
                    ticArtcena.ncena = e.value.name;
                    ticArtcena.ccena = foundItem.code;
                } else if (name == 'curr') {
                    setDdCmnCurrItem(e.value);
                    const foundItem = cmnCurrItems.find((item) => item.id === val);
                    setCmnCurrItem(foundItem || null);
                    ticArtcena.ncurr = e.value.name;
                    ticArtcena.ccurr = foundItem.code;
                } else if (name == 'terr') {
                    setDdCmnTerrItem(e.value);
                    const foundItem = cmnTerrItems.find((item) => item.id === val);
                    setCmnTerrItem(foundItem || null);
                    ticArtcena.nterr = e.value.name;
                    ticArtcena.cterr = foundItem.code;
                } else if (name == 'um') {
                    setDdCmnUmItem(e.value);
                    const foundItem = cmnUmItems.find((item) => item.id === val);
                    setCmnUmItem(foundItem || null);
                    ticArtcena.num = e.value.name;
                    ticArtcena.cum = foundItem ? foundItem.code : null;
                }
            }
        } else if (type === 'Calendar') {
            //const dateVal = DateFunction.dateGetValue(e.value);
            //console.log(dateVal, '***********************************');
            val = (e.target && e.target.value) || '';
            switch (name) {
                case 'begda':
                    setBegda(e.value);
                    //ticArtcena.begda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                case 'endda':
                    setEndda(e.value);
                    //ticArtcena.endda = DateFunction.formatDateToDBFormat(dateVal)
                    break;
                default:
                    console.error('Pogresan naziv polja');
            }
        } else {
            val = (e.target && e.target.value) || '';
        }
        let _ticArtcena = { ...ticArtcena };
        _ticArtcena[`${name}`] = val;
        setTicArtcena(_ticArtcena);
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
                        <div className="field col-12 md:col-10">
                            <label htmlFor="cena">{translations[selectedLanguage].Cena} *</label>
                            <Dropdown
                                id="cena"
                                value={ddTicCena}
                                options={ddTicCenas}
                                onChange={(e) => onInputChange(e, 'options', 'cena')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArtcena.cena })}
                            />
                            {submitted && !ticArtcena.cena && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>

                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-3">
                            <label htmlFor="value">{translations[selectedLanguage].Value} *</label>
                            <InputText id="value" value={ticArtcena.value} onChange={(e) => onInputChange(e, 'text', 'value')} required className={classNames({ 'p-invalid': submitted && !ticArtcena.value })} />
                            {submitted && !ticArtcena.value && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="curr">{translations[selectedLanguage].Curr} *</label>
                            <Dropdown
                                id="curr"
                                value={ddCmnCurr}
                                options={ddCmnCurrs}
                                onChange={(e) => onInputChange(e, 'options', 'curr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArtcena.curr })}
                            />
                            {submitted && !ticArtcena.curr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="terr">{translations[selectedLanguage].Terr} *</label>
                            <Dropdown
                                id="terr"
                                value={ddCmnTerr}
                                options={ddCmnTerrs}
                                onChange={(e) => onInputChange(e, 'options', 'terr')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArtcena.terr })}
                            />
                            {submitted && !ticArtcena.terr && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                        <div className="field col-12 md:col-3">
                            <label htmlFor="um">{translations[selectedLanguage].Um} *</label>
                            <Dropdown
                                id="um"
                                value={ddCmnUm}
                                options={ddCmnUms}
                                onChange={(e) => onInputChange(e, 'options', 'um')}
                                required
                                optionLabel="name"
                                placeholder="Select One"
                                className={classNames({ 'p-invalid': submitted && !ticArtcena.um })}
                            />
                            {submitted && !ticArtcena.um && <small className="p-error">{translations[selectedLanguage].Requiredfield}</small>}
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="begda">{translations[selectedLanguage].Begda} *</label>
                            <Calendar value={begda} onChange={(e) => onInputChange(e, 'Calendar', 'begda', this)} showIcon dateFormat="dd.mm.yy" />
                        </div>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-5">
                            <label htmlFor="roenddal">{translations[selectedLanguage].Endda} *</label>
                            <Calendar value={endda} onChange={(e) => onInputChange(e, 'Calendar', 'endda')} showIcon dateFormat="dd.mm.yy" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {props.dialog ? <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={handleCancelClick} outlined /> : null}
                        <div className="flex-grow-1"></div>
                        <div className="flex flex-wrap gap-1">
                            {props.artcenaTip === 'CREATE' && canCreate ? <Button label={translations[selectedLanguage].Create}
                                    icon="pi pi-check" onClick={handleCreateClick} severity="success" outlined /> : null}
                            {props.artcenaTip !== 'CREATE' && canDelete ? <Button label={translations[selectedLanguage].Delete}
                                    icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" outlined /> : null}
                            {props.artcenaTip !== 'CREATE' && canUpdate ? <Button label={translations[selectedLanguage].Save}
                                    icon="pi pi-check" onClick={handleSaveClick} severity="success" outlined /> : null}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteDialog visible={deleteDialogVisible} inTicArtcena="delete" item={ticArtcena.roll} onHide={hideDeleteDialog} onDelete={handleDeleteClick} />
        </div>
    );
};

export default TicArtcena;


