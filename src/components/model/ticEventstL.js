import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Toast } from 'primereact/toast';
import { TicEventstService } from '../../service/model/TicEventstService';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from '../../configs/translations';
import DateFunction from '../../utilities/DateFunction';

export default function TicEventstL(props) {
    const objName = 'tic_eventst';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyTicEventst = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticEventsts, setTicEventsts] = useState([]);
    const [ticEventst, setTicEventst] = useState(emptyTicEventst);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [eventstTip, setEventstTip] = useState('');
    let i = 0;

    const handleCancelClick = () => {
        props.setTicEventstLVisible(false);
        if (props.eventArt) props.setTicEventeventstLVisible(false);
    };

    const handleConfirmClick = () => {
        console.log(ticEventst, "7777777777777777777777777777777777777777777777777777")
        if (ticEventst) {
            props.onTaskComplete(ticEventst); 
        } else {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No row selected', life: 3000 });
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const ticEventstService = new TicEventstService();
                    const data = await ticEventstService.getLista();
                    
                    setTicEventsts(data);

                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _ticEventsts = [...ticEventsts];
        let _ticEventst = { ...localObj.newObj.obj };
        //setSubmitted(true);
        if (localObj.newObj.eventstTip === 'CREATE') {
            _ticEventsts.push(_ticEventst);
        } else if (localObj.newObj.eventstTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticEventsts[index] = _ticEventst;
        } else if (localObj.newObj.eventstTip === 'DELETE') {
            _ticEventsts = ticEventsts.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventst Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventst ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventstTip}`, life: 3000 });
        setTicEventsts(_ticEventsts);
        setTicEventst(emptyTicEventst);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticEventsts.length; i++) {
            if (ticEventsts[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };


    const openNew = () => {
        setTicEventstDialog(emptyTicEventst);
    };


    const onRowSelect = (event) => {
        //ticEventst.begda = event.data.begda
        toast.current.show({
            severity: 'info',
            summary: 'Action Selected',
            detail: `Id: ${event.data.id} Name: ${event.data.text}`,
            life: 3000
        });
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Action Unselected',
            detail: `Id: ${event.data.id} Name: ${event.data.text}`,
            life: 3000
        });
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
            code: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            text: {
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
                {props.lookUp && (
                    <>
                        <div className="flex flex-wrap gap-1" />
                        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />
                        <div className="flex flex-wrap gap-1" />
                        <Button label={translations[selectedLanguage].Confirm} icon="pi pi-times" onClick={handleConfirmClick} text raised disabled={!ticEventst} />
                    </>
                )}
                {/* <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div> */}
                <div className="flex flex-wrap gap-1" />
                {/* <Button label={translations[selectedLanguage].Loc} icon="pi pi-map" onClick={handleLocClick} text raised disabled={!ticEventst} />
                <div className="flex flex-wrap gap-1" />
                <Button label={translations[selectedLanguage].Cena} icon="pi pi-euro" onClick={handleCenaClick} text raised disabled={!ticEventst} /> */}
                <div className="flex-grow-1"></div>
                <b>{translations[selectedLanguage].ArtList}</b>
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

    const formatDateColumn = (rowData, field) => {
        return DateFunction.formatDate(rowData[field]);
    };

    // <--- Dialog
    const setTicEventstDialog = (ticEventst) => {
        setVisible(true);
        setEventstTip('CREATE');
        setTicEventst({ ...ticEventst });
    };
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    const locTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setTicEventstDialog(rowData);
                        setEventstTip('UPDATE');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                dataKey="id"
                selectionMode="single"
                selection={ticEventst}
                loading={loading}
                value={ticEventsts}
                header={header}
                showGridlines
                removableSort
                filters={filters}
                scrollable
                scrollHeight="550px"
                virtualScrollerOptions={{ itemSize: 46 }}
                tableStyle={{ minWidth: '50rem' }}
                metaKeySelection={false}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onSelectionChange={(e) => setTicEventst(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                {/* <Column field="cart" header={translations[selectedLanguage].cart} sortable filter style={{ width: '15%' }}></Column> */}
                <Column field="nart" header={translations[selectedLanguage].nart} sortable filter style={{ width: '30%' }}></Column>
                {/* <Column field="code1" header={translations[selectedLanguage].Code} sortable filter style={{ width: '15%' }}></Column> */}
                <Column field="text1" header={translations[selectedLanguage].sediste} sortable filter style={{ width: '35%' }}></Column>
                <Column field="text2" header={translations[selectedLanguage].sektor} sortable filter style={{ width: '35%' }}></Column>
                <Column field="cena" header={translations[selectedLanguage].Cena} sortable filter style={{ width: '15%' }}></Column>
            </DataTable>
            {/* <Dialog
                header={translations[selectedLanguage].Art}
                visible={visible}
                style={{ width: '60%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && <TicEventst parameter={'inputTextValue'} ticEventst={ticEventst} handleDialogClose={handleDialogClose} setVisible={setVisible} ticEventId={props.eventArt ? props.ticEvent.id : null} dialog={true} eventstTip={eventstTip} />}
                <div className="p-dialog-header-icons" style={{ display: 'none' }}>
                    <button className="p-dialog-header-close p-link">
                        <span className="p-dialog-header-close-icon pi pi-times"></span>
                    </button>
                </div>
            </Dialog> */}
        </div>
    );
}
