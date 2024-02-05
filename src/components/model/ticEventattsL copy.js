/**
 * Argumenti respektivno koji se prosledjuju
 * 0 - modu, `adm`
 * 1 - tabela, bez prefiksa, `user`
 * 2 - id tabele
 * 3 - naziv atributa po kome se pretrazuje
 * 5 - mumericki atrinut 0 ili 1
 * 6 - vrednost atributa pokome se pretrazuje
 */
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Checkbox } from 'primereact/checkbox';
import { Toast } from 'primereact/toast';
import { TicEventattsService } from '../../service/model/TicEventattsService';
import TicEventatts from './ticEventatts';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from '../../configs/translations';
import { fetchObjData } from './customHook';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import FileService from '../../service/FileService';
import ConfirmDialog from '../dialog/ConfirmDialog';
import { Calendar } from 'primereact/calendar';
import DateFunction from "../../utilities/DateFunction";
import TicEventattsgrpL from './ticEventattsgrpL';

export default function TicEventattsL(props) {
    const objName = 'tic_eventatts';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [submitted, setSubmitted] = useState(false);
    const emptyTicEventatts = EmptyEntities[objName];
    emptyTicEventatts.event = props.ticEvent.id;
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticEventattss, setTicEventattss] = useState([]);
    const [ticEventatts, setTicEventatts] = useState(emptyTicEventatts);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [eventattsTip, setEventattsTip] = useState('');
    const [dropdownItem, setDropdownItem] = useState(null);
    const [dropdownItems, setDropdownItems] = useState(null);
    const [dropdownItem1, setDropdownItem1] = useState(null);
    const [dropdownItems1, setDropdownItems1] = useState(null);
    const [dropdownAllItems, setDropdownAllItems] = useState(null);
    const [dropdownAllItems1, setDropdownAllItems1] = useState(null);
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
    let [refresh, setRefresh] = useState(null);
    const [componentKey, setComponentKey] = useState(0);
    const [ticEventattsgrpLVisible, setTicEventattsgrpLVisible] = useState(false);

    let i = 0;

    const handleCancelClick = () => {
        props.setTicEventattsLVisible(false);

    };

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             ++i;
    //             if (i < 2) {
    //                 let updatedData = {};
    //                 const ticEventattsService = new TicEventattsService();
    //                 const data = await ticEventattsService.getLista(props.ticEvent.id);
    //                 // Proširivanje dropdownData niza za svaki red sa inputtp === "3"
    //                 const updatedDropdownItems = { ...dropdownAllItems };
    //                 updatedData = await Promise.all(
    //                     data.map(async (row) => {
    //                         if (row.inputtp === '3' && row.ddlist) {
    //                             const [modul, tabela, code, modul1, table1, code1] = row.ddlist.split(',');
    //                             let apsTabela = modul + `_` + tabela;
    //                             if (code) {
    //                                 apsTabela = apsTabela + `_${code}`
    //                             }
    //                             const dataDD = await fetchObjData(modul, tabela, code, props.ticEvent); // Sačekaj izvršenje
    //                             updatedDropdownItems[apsTabela] = dataDD.ddItems;
    //                             if (modul1) {
    //                                 console.log(modul1, table1, code1, "*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--")
    //                                 let apsTabela1 = modul1 + `_` + table1;
    //                                 if (code1) {
    //                                     apsTabela1 = apsTabela1 + `_${code1}`
    //                                 }
    //                                 const dataDD1 = await fetchObjData(modul1, table1, code1, props.ticEvent); // Sačekaj izvršenje
    //                                 updatedDropdownItems[apsTabela1] = dataDD1.ddItems;
    //                             }
    //                         }
    //                         return { ...row, isUploadPending: false }; // Dodaj novu kolonu sa statusom
    //                     })
    //                 );
    //                 await setTicEventattss(updatedData);
    //                 await setDropdownAllItems(updatedDropdownItems);
    //                 console.log(updatedDropdownItems, "---------------------------------------------------")

    //                 initFilters();
    //             }
    //         } catch (error) {
    //             console.error(error);
    //             // Obrada greške ako je potrebna
    //         }
    //     }

    //     fetchData();
    // }, [refresh, componentKey]);

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const ticEventattsService = new TicEventattsService();
                    const data = await ticEventattsService.getLista(props.ticEvent.id);
                    const updatedDropdownItems = { ...dropdownAllItems };
                    const updatedDropdownItems1 = { ...dropdownAllItems1 };
    
                    const promises = data.map(async (row) => {
                        if (row.inputtp === '3'  && row.ddlist) {
                            const [modul, tabela, code, modul1, tabela1, code1] = row.ddlist.split(',');
                            let apsTabela = modul + `_` + tabela;
                            if (code) {
                                apsTabela = apsTabela + `_${code}`
                            }
                            const dataDD = await fetchObjData(modul, tabela, code, props.ticEvent);
                            updatedDropdownItems[apsTabela] = dataDD.ddItems;
    
                        }
                        if (row.inputtp === '6' && row.ddlist) {
                            const [modul, tabela, code, modul1, table1, code1] = row.ddlist.split(',');
                            let apsTabela = modul + `_` + tabela;
                            if (code) {
                                apsTabela = apsTabela + `_${code}`
                            }
                            const dataDD = await fetchObjData(modul, tabela, code, props.ticEvent);
                            updatedDropdownItems[apsTabela] = dataDD.ddItems;
    
                            if (modul1) {
                                let apsTabela1 = modul1 + `_` + table1;
                                if (code1) {
                                    apsTabela1 = apsTabela1 + `_${code1}`
                                }
                                const dataDD1 = await fetchObjData(modul1, table1, code1, props.ticEvent);
                                updatedDropdownItems[apsTabela1] = dataDD1.ddItems;
                            }
                        }                        
                        return { ...row, isUploadPending: false };
                    });
    
                    const updatedData = await Promise.all(promises);
                    setTicEventattss(updatedData);
                    setDropdownAllItems(updatedDropdownItems);
                    console.log(updatedDropdownItems, "-----------------------updatedDropdownItems----------------------------");
    
                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
    
        fetchData();
    }, [refresh, componentKey]);
    

    const openEventattsgrp = () => {
        setTicEventattsgrpDialog();
    };

    const setTicEventattsgrpDialog = () => {
        setShowMyComponent(true);
        setTicEventattsgrpLVisible(true);
    };

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _ticEventattss = [...ticEventattss];
        let _ticEventatts = { ...localObj.newObj.obj };
        //setSubmitted(true);
        if (localObj.newObj.eventattsTip === 'CREATE') {
            //_ticEventattss.push(_ticEventatts);
            setRefresh(newObj.id);
            setComponentKey((prevKey) => prevKey + 1);
        } else if (localObj.newObj.eventattsTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticEventattss[index] = _ticEventatts;
        } else if (localObj.newObj.eventattsTip === 'DELETE') {
            _ticEventattss = ticEventattss.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventatts Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventatts ?', life: 3000 });
        }
        toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: `{${objName}} ${localObj.newObj.eventattsTip}`,
            life: 3000
        });
        setTicEventattss(_ticEventattss);
        setTicEventatts(emptyTicEventatts);
    };

    const onTemplateSelect = (e) => {
        console.log('onTemplateSelect');
    };

    const handleAutoInputClick = () => {
        setConfirmDialogVisible(true);
    };


    const handleTicEventattsgrpLDialogClose = (newObj) => {
        const localObj = { newObj };
        console.log(props.ticEvent, "***********handleTicEventattsgrpLDialogClose********************")
        setRefresh(++refresh);
    };

    const handleConfirm = async () => {
        //console.log(props.ticEvent, "***********handleConfirm********************")
        setSubmitted(true);
        const ticEventattsService = new TicEventattsService();
        await ticEventattsService.postAutoEventatts(props.ticEvent.id);
        const data = await ticEventattsService.getLista(props.ticEvent.id);
        setTicEventattss(data);
        props.handleTicEventattsLDialogClose({ obj: props.ticEvent, docTip: 'UPDATE' });
        props.setVisible(false);
        //hideDeleteDialog();
        setConfirmDialogVisible(false);
    };

    // const handleDropdownChange = async (e, rowData, apsTabela) => {
    //     rowData.value = e.value.code;
    //     const val = (e.target && e.target.value && e.target.value.code) || '';
    //     setDropdownItem(e.value);

    //     let _ticEventatts = { ...ticEventatts };
    //     _ticEventatts[`value`] = val;
    //     setTicEventatts(_ticEventatts);
    //     // Ažuriramo podatke u bazi bez submita
    //     await updateDataInDatabase(_ticEventatts);
    // };

    const onInputChange = async (e, type, name, rowData, apsTabela) => {
        let val = '';
        let _ticEventatts = {}
        if (name === 'value') {
            switch (type) {
                case 'input':
                    val = (e.target && e.target.value) || '';
                    rowData.value = e.target.value;
                    setTicEventattss([...ticEventattss]);
                    break;
                case 'checkbox':
                    rowData.value = e.checked ? '1' : '0';
                    setTicEventattss([...ticEventattss]);
                    val = e.checked ? 1 : 0;
                    break;
                case 'options':
                    rowData.value = e.value.code;
                    val = (e.target && e.target.value && e.target.value.code) || '';
                    setDropdownItem(e.value);
                    break;
                case 'fileUpload':
                    try {
                        console.log('Custom upload started Bravo:', e);
                        const originalFileExtension = e.files[0].name.split('.').pop();
                        const newFileName = `${ticEventatts.event}.${originalFileExtension}`;
                        console.log('Modified file name:', newFileName);

                        rowData.isUploadPending = false;
                        const relPath = 'public/tic/event/';
                        const file = e.files[0];
                        const fileService = new FileService();
                        const data = await fileService.uploadFile(file, newFileName, relPath);
                        rowData.isUploadPending = true;
                        toast.current.show({ severity: 'success', summary: 'Success', detail: data.message });
                        e.options.clear();
                        val = relPath + newFileName;
                        rowData.value = val;
                        const rowIndex = ticEventattss.findIndex((row) => row.id === rowData.id);

                        // Ažurirajte reda sa novim podacima
                        const updatedTicEventattss = [...ticEventattss];
                        updatedTicEventattss[rowIndex] = rowData;

                        // Postavljanje novog niza kao stanje za ticEventattss
                        setTicEventattss(updatedTicEventattss);
                        //setTicEventattss([...ticEventattss]);
                    } catch (error) {
                        console.error(error);
                        toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error uploading file' });
                    }
                    break;
                case 'calendar':
                    val = await DateFunction.formatDateToDBFormat(DateFunction.dateGetValue((e.target && e.target.value) || ''))
                    rowData.value = val
                    break;
                default:
                    val = '';
                    break;
            }

            // Napravite kopiju trenutnog niza
            const updatedTicEventattss = [...ticEventattss];

            // Pronađite indeks trenutnog reda
            const rowIndex = updatedTicEventattss.findIndex((row) => row.id === rowData.id);

            // Ažurirajte samo trenutni red sa novim podacima
            updatedTicEventattss[rowIndex] = rowData;

            // Postavljanje novog niza kao stanje za ticEventattss
            setTicEventattss(updatedTicEventattss);

        } else if (name === 'valid') {
            rowData.valid = e.checked ? 1 : 0;
            setTicEventattss([...ticEventattss]);
            val = e.checked ? 1 : 0;
        } else if (name === 'text') {
            switch (type) {
                case 'input':
                    val = (e.target && e.target.value) || '';
                    rowData.text = e.target.value;
                    setTicEventattss([...ticEventattss]);
                    break;                    
                case 'options':
                    rowData.text = e.value.code;
                    val = (e.target && e.target.value && e.target.value.code) || '';
                    setDropdownItem1(e.value);
                    break;
                default:
                    val = '';
                    break;
            } 
            // Napravite kopiju trenutnog niza
            const updatedTicEventattss = [...ticEventattss];

            // Pronađite indeks trenutnog reda
            const rowIndex = updatedTicEventattss.findIndex((row) => row.id === rowData.id);

            // Ažurirajte samo trenutni red sa novim podacima
            console.log(rowData, "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq")
            updatedTicEventattss[rowIndex] = rowData;

            // Postavljanje novog niza kao stanje za ticEventattss
            setTicEventattss(updatedTicEventattss);                       
        }
        console.log('val:', val);
        console.log('e.target.value:', e.target.value);
        console.log('name:', name);
        console.log('rowData.value:', rowData.value);
        
        _ticEventatts = { ...ticEventatts };
        _ticEventatts[`${name}`] = val;
        setTicEventatts(_ticEventatts);
        await updateDataInDatabase(_ticEventatts);

        // Ažurirajte stanje komponente nakon ažuriranja podataka
        // const updatedTicEventattss = ticEventattss.map((row) => {
        //     if (row.id === rowData.id) {
        //         return { ...rowData };
        //     }
        //     return row;
        // });
        // console.log(updatedTicEventattss, "*****************LOG POSLE U********************")
        // setTicEventattss(updatedTicEventattss);

    };

    const updateDataInDatabase = async (rowData) => {
        try {
            //console.log(rowData, "***********updateDataInDatabase************", rowData.value)
            const ticEventattsService = new TicEventattsService();
            await ticEventattsService.putTicEventatts(rowData);
            // Dodatno rukovanje ažuriranim podacima, ako je potrebno          
        } catch (err) {
            console.error('Error updating data:', err);
            // Dodatno rukovanje greškom, ako je potrebno
        }
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticEventattss.length; i++) {
            if (ticEventattss[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const openNew = () => {
        setTicEventattsDialog(emptyTicEventatts);
    };

    const onRowSelect = (event) => {
        console.log('onRowSelect');
    };

    const onRowUnselect = (event) => {
        console.log('onRowUnselect');
    };
    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            ctp: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            ntp: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            valid: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    const onGlobalFilterChange = (e) => {
        let value1 = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value1;

        setFilters(_filters);
        setGlobalFilterValue(value1);
    };

    const renderHeader = () => {
        return (
            <div className="flex card-container">
                <div className="flex flex-wrap gap-1" />
                <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].AutoAtts} icon="pi pi-copy" severity="warning" onClick={handleAutoInputClick} text raised />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].GroupAtts} icon="pi pi-plus-circle" severity="warning" onClick={openEventattsgrp} text raised />
                </div>
                <div className="flex-grow-1"></div>
                <b>{translations[selectedLanguage].EventattsList}</b>
                <div className="flex-grow-1"></div>
                <div className="flex flex-wrap gap-1">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={translations[selectedLanguage].KeywordSearch} />
                    </span>
                    <Button type="button" icon="pi pi-filter-slash" label={translations[selectedLanguage].Clear} outlined onClick={clearFilter} text raised />
                </div>
            </div>
        );
    };

    const validBodyTemplate = (rowData) => {
        const valid = rowData.valid == 1 ? true : false;
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': valid,
                    'text-red-500 pi-times-circle': !valid
                })}
            ></i>
        );
    };

    const validFilterTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2">
                <label htmlFor="verified-filter" className="font-bold">
                    {translations[selectedLanguage].Valid}
                </label>
                <TriStateCheckbox inputId="verified-filter" value={options.value} onChange={(e) => options.filterCallback(e.value)} />
            </div>
        );
    };

    // <--- Dialog
    const setTicEventattsDialog = (ticEventatts) => {
        setVisible(true);
        setEventattsTip('CREATE');
        setTicEventatts({ ...ticEventatts });
    };
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    const eventattsTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setTicEventattsDialog(rowData);
                        setEventattsTip('UPDATE');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };

    // funkcije
    const textEditor = (rowData, field, e) => {
        //return <InputText value={rowData.text || ''} onChange={(e) => onInputChange(e, 'text', 'text', rowData, null)} />;
        console.log(rowData, '************************text*************rowData.inputtp***************', e);
        switch (rowData.inputtp) {
            case '6':
                const [modul, tabela, code, modul1, tabela1, code1] = rowData.ddlist.split(',');
                let apsTabela1 = `${modul1}_${tabela1}`;
                if (code1) {
                    apsTabela1 = apsTabela1 + `_${code1}`
                }

                const selectedOptions1 = dropdownAllItems[apsTabela1] || [];
                //console.log(selectedOptions1, '******************selectedOptions111*******', apsTabela1, '*********QQQQQ******', dropdownAllItems);
                setDropdownItems1(selectedOptions1);
                const selectedOption1 = selectedOptions1.find((option) => option.code === rowData.text);
                setDropdownItem1(selectedOption1);

                return <Dropdown id={rowData.id} value={selectedOption1} options={selectedOptions1} onChange={(e) => onInputChange(e, 'options', 'text', rowData, apsTabela1)} placeholder="Select One" optionLabel="name" />;
            default:
                return <InputText value={rowData.text || ''} onChange={(e) => onInputChange(e, 'input', 'text', rowData, null)} />;
        }

    };

    const validEditor = (rowData, field) => {
        return <Checkbox checked={rowData.valid === 1} onChange={(e) => onInputChange(e, 'checkbox', 'valid', rowData, null)} />;

    };

    const valueEditor = (rowData, field, e) => {
        console.log(rowData, '************************rowData*************e***************', e);
        switch (rowData.inputtp) {
            case '4':
                return (
                    <div className="card flex justify-content-center">
                        <FileUpload
                            //mode="basic"
                            name="Fajl"
                            accept="image/*"
                            maxFileSize={1000000}
                            uploadHandler={(event) => onInputChange(event, 'fileUpload', 'value', rowData, null)}
                            onSelect={onTemplateSelect}
                            customUpload={true}
                            chooseLabel="Browse"
                            emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                        />
                    </div>
                );
            case '1':
                return <InputText value={rowData.value || ''} onChange={(e) => onInputChange(e, 'input', 'value', rowData, null)} />;
            case '2':
                return <Checkbox checked={rowData.value === '1'} onChange={(e) => onInputChange(e, 'checkbox', 'value', rowData, null)} />;
            case '6':
                const [modul1, tabela1, code1, modul2, tabela2, code2] = rowData.ddlist.split(',');
                let apsTabela1 = `${modul1}_${tabela1}`;
                if (code1) {
                    apsTabela1 = apsTabela1 + `_${code1}`
                }

                const selectedOptions1 = dropdownAllItems[apsTabela1] || [];
                console.log(rowData.ddlist, '******************selectedOptions000000*******', apsTabela1, '*********WWWWW******', dropdownAllItems);
                setDropdownItems(selectedOptions1);
                const selectedOption1 = dropdownAllItems[apsTabela1].find((option) => option.code === rowData.value);
                setDropdownItem(selectedOption1);

                return <Dropdown id={rowData.id} value={selectedOption1} options={selectedOptions1} onChange={(e) => onInputChange(e, 'options', 'value', rowData, apsTabela1)} placeholder="Select One" optionLabel="name" />;

            case '3':
                const [modul, tabela, code] = rowData.ddlist.split(',');
                let apsTabela = `${modul}_${tabela}`;
                if (code) {
                    apsTabela = apsTabela + `_${code}`
                }

                const selectedOptions = dropdownAllItems[apsTabela] || [];
                //console.log(selectedOptions, '******************selectedOptions*******', apsTabela, '*********WWWWW******', dropdownAllItems);
                setDropdownItems(selectedOptions);
                const selectedOption = dropdownAllItems[apsTabela].find((option) => option.code === rowData.value);
                setDropdownItem(selectedOption);

                return <Dropdown id={rowData.id} value={selectedOption} options={selectedOptions} onChange={(e) => onInputChange(e, 'options', 'value', rowData, apsTabela)} placeholder="Select One" optionLabel="name" />;
            case '5': // Za kalendar
                return (
                    <Calendar
                        showIcon
                        dateFormat="dd.mm.yy"
                        value={DateFunction.formatJsDate(props.ticEvent.begda || DateFunction.currDate())}
                        onChange={async (e) => onInputChange(e, 'calendar', 'value', rowData, null)} // Dodajte funkciju za rukovanje promenama na kalendaru
                    />
                );
            default:
                return <InputText value={rowData.value || ''} onChange={(e) => onInputChange(e, 'input', 'value', rowData, null)} />;
        }
    };

    const onCellEditComplete = async (e) => {
        let { rowData, newValue, newRowData, field, originalEvent: event } = e;
        let _rowData = { ...rowData };
        let _newValue = newValue;

        switch (field) {
            case 'valid':
                if (newValue != null) _rowData[field] = _newValue;
                else event.preventDefault();
                break;
            case 'value':
                if (newValue != null) {
                    _rowData[field] = _newValue;
                    // Check if upload is pending and prevent exiting edit mode
                    if (rowData.inputtp === '4' && !_rowData.isUploadPending) {
                        event.preventDefault();
                    }
                } else event.preventDefault();
                break;
            case 'text': // Dodali smo ovu sekciju za kolonu "text"
                if (newValue != null) {
                    _rowData[field] = _newValue;
                } else event.preventDefault();
                break;
            default:
                if (newValue != null) _rowData[field] = _newValue;
                else event.preventDefault();
                break;
        }

        // Ažuriramo stanje komponente
        setTicEventattss([...ticEventattss]);
    };

    const valueTemplate = (rowData) => {
        if ((rowData.inputtp === '3'||rowData.inputtp === '6') && rowData.ddlist) {
            const [modul, tabela, code] = rowData.ddlist.split(',');
            let apsTabela = `${modul}_${tabela}`;
            if (code) {
                apsTabela = apsTabela + `_${code}`
            }
            const dropdownData = dropdownAllItems[apsTabela] || [];
            const dropdownValue = dropdownData.find((item) => item.code === rowData.value);
            if (dropdownValue) {
                return <span>{dropdownValue.name}</span>;
            }
        }

        if (rowData.inputtp === '2') {
            const value = rowData.value == 1 ? true : false;
            return (
                <i
                    className={classNames('pi', {
                        'text-green-500 pi-check-circle': value,
                        'text-red-500 pi-times-circle': !value
                    })}
                ></i>
            );
        }
        if (rowData.inputtp === '5') {
            let value = ''
            if (rowData.value) {
                value = DateFunction.formatDate(rowData.value)
            }
            return (
                <span>{value}</span>
            );
        }

        // Prikazujemo ili "value" ili default vrednost
        return rowData.value;
    };

    const textTemplate = (rowData) => {
        if (rowData.inputtp === '6' && rowData.ddlist) {
            const [modul, tabela, code, modul1, tabela1, code1] = rowData.ddlist.split(',');
            let apsTabela1 = `${modul1}_${tabela1}`;
            if (code1) {
                apsTabela1 = apsTabela1 + `_${code1}`
            }
            const dropdownData = dropdownAllItems[apsTabela1] || [];
            const dropdownValue = dropdownData.find((item) => item.code1 === rowData.value);
            if (dropdownValue) {
                return <span>{dropdownValue.name}</span>;
            }
        }
        // Prikazujemo ili "value" ili default vrednost
        return rowData.value;
    };
    // Funkcije

    return (
        <div className="card">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-6">
                            <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                            <InputText id="code" value={props.ticEvent.code} disabled={true} />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                            <InputText id="text" value={props.ticEvent.textx} disabled={true} />
                        </div>
                    </div>
                </div>
            </div>
            <DataTable
                key={componentKey}
                dataKey="id"
                selectionMode="single"
                selection={ticEventatts}
                loading={loading}
                value={ticEventattss}
                header={header}
                showGridlines
                removableSort
                //editMode="cell"
                rowClassName={(rowData) => ({ 'editing-row': rowData === ticEventatts })}
                filters={filters}
                scrollable
                scrollHeight="550px"
                //virtualScrollerOptions={{ itemSize: 46 }}
                tableStyle={{ minWidth: '50rem' }}
                //metaKeySelection={false}
                paginator
                rows={75}
                rowsPerPageOptions={[25, 50, 75]}
                onSelectionChange={(e) => setTicEventatts(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column
                    //bodyClassName="text-center"
                    body={eventattsTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />
                <Column field="ctp" header={translations[selectedLanguage].Code} sortable filter style={{ width: '10%' }}></Column>
                <Column field="ntp" header={translations[selectedLanguage].Text} sortable filter style={{ width: '25%' }}></Column>
                <Column field="nttp" header={translations[selectedLanguage].ntp} sortable filter style={{ width: '25%' }}></Column>
                <Column field="ninputtp" header={translations[selectedLanguage].inputtp} sortable filter style={{ width: '10%' }}></Column>
                <Column field="ddlist" header={translations[selectedLanguage].ddlist} sortable filter style={{ width: '10%' }}></Column>
                <Column
                    field="value"
                    header={translations[selectedLanguage].Value}
                    sortable
                    filter
                    style={{ width: '20%' }}
                    editor={(e) => valueEditor(e.rowData, e.field, e)} // Dodali smo editor za editiranje value
                    body={valueTemplate}
                    onCellEditComplete={onCellEditComplete} // Dodali smo onCellEditComplete za validaciju
                ></Column>
                <Column
                    field="text"
                    header={translations[selectedLanguage].Descript}
                    sortable
                    filter
                    style={{ width: '10%' }}
                    //editor={(props) => textEditor(props.rowData, props.field)} // Koristimo textEditor za editiranje teksta
                    editor={(e) => textEditor(e.rowData, e.field, e)} // Dodali smo editor za editiranje value
                    body={textTemplate}
                    onCellEditComplete={onCellEditComplete}
                ></Column>

                <Column
                    field="valid"
                    filterField="valid"
                    dataType="numeric"
                    header={translations[selectedLanguage].Valid}
                    sortable
                    filter
                    filterElement={validFilterTemplate}
                    style={{ width: '10%' }}
                    bodyClassName="text-center"
                    body={validBodyTemplate}
                    editor={(props) => validEditor(props.rowData, props.field)} // Dodali smo editor za editiranje validnosti
                    onCellEditComplete={onCellEditComplete} // Dodali smo onCellEditComplete za validaciju
                ></Column>
            </DataTable>
            <Dialog
                header={translations[selectedLanguage].Link}
                visible={visible}
                style={{ width: '60%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventatts
                        parameter={'inputTextValue'}
                        ticEventatts={ticEventatts}
                        ticEvent={props.ticEvent}
                        handleDialogClose={handleDialogClose}
                        setVisible={setVisible}
                        dialog={true}
                        eventattsTip={eventattsTip}
                    />}
                <div className="p-dialog-header-icons" style={{ display: 'none' }}>
                    <button className="p-dialog-header-close p-link">
                        <span className="p-dialog-header-close-icon pi pi-times"></span>
                    </button>
                </div>
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventAttsgrpList}
                visible={ticEventattsgrpLVisible}
                style={{ width: '60%' }}
                onHide={() => {
                    setTicEventattsgrpLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent &&
                    <TicEventattsgrpL
                        parameter={'inputTextValue'}
                        ticEvent={props.ticEvent}
                        handleTicEventattsgrpLDialogClose={handleTicEventattsgrpLDialogClose}
                        setTicEventattsgrpLVisible={setTicEventattsgrpLVisible}
                        setVisible={setVisible}
                        dialog={true}
                        lookUp={false}
                    />}
            </Dialog>
            <ConfirmDialog visible={confirmDialogVisible} onHide={() => setConfirmDialogVisible(false)} onConfirm={handleConfirm} />
        </div>
    );
}
