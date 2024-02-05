import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Toast } from 'primereact/toast';
import './index.css';
import { TicEventtpService } from '../../service/model/TicEventtpService';
import TicEventtpsL from './ticEventtpsL';
import TicEventtp from './ticEventtp';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from '../../configs/translations';

export default function TicEventtpL(props) {
    let i = 0;
    const objName = 'tic_eventtp';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyTicEventtp = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticEventtps, setTicEventtps] = useState([]);
    const [ticEventtp, setTicEventtp] = useState(emptyTicEventtp);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [eventtpTip, setEventtpTip] = useState('');
    const [ticEventtpsLVisible, setTicEventtpsLVisible] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const ticEventtpService = new TicEventtpService();
                    const data = await ticEventtpService.getTicEventtps();
                    setTicEventtps(data);
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

        let _ticEventtps = [...ticEventtps];
        let _ticEventtp = { ...localObj.newObj.obj };

        //setSubmitted(true);
        if (localObj.newObj.eventtpTip === 'CREATE') {
            _ticEventtps.push(_ticEventtp);
        } else if (localObj.newObj.eventtpTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticEventtps[index] = _ticEventtp;
        } else if (localObj.newObj.eventtpTip === 'DELETE') {
            _ticEventtps = ticEventtps.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventtp Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventtp ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventtpTip}`, life: 3000 });
        setTicEventtps(_ticEventtps);
        setTicEventtp(emptyTicEventtp);
    };

    const handleTicEventtpsLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticEventtps.length; i++) {
            if (ticEventtps[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const openNew = () => {
        setTicEventtpDialog(emptyTicEventtp);
    };
    const openEventtps = () => {
        setTicEventtpsDialog();
    };

    const onRowSelect = (event) => {
        toast.current.show({
            severity: 'info',
            summary: 'Action Selected',
            detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
            life: 3000
        });
    };

    const onRowUnselect = (event) => {
        toast.current.show({
            severity: 'warn',
            summary: 'Action Unselected',
            detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
            life: 3000
        });
    };
    // <heder za filter
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            code: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
            },
            textx: {
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
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Attributes} icon="pi pi-table" onClick={openEventtps} text raised disabled={!ticEventtp} />
                </div>

                <div className="flex-grow-1" />
                <b>{translations[selectedLanguage].EventTpList}</b>
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
    const setTicEventtpDialog = (ticEventtp) => {
        setVisible(true);
        setEventtpTip('CREATE');
        setTicEventtp({ ...ticEventtp });
    };

    const setTicEventtpsDialog = () => {
        setShowMyComponent(true);
        setTicEventtpsLVisible(true);
    };
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    const actionTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => {
                        setTicEventtpDialog(rowData);
                        setEventtpTip('UPDATE');
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
                selection={ticEventtp}
                loading={loading}
                value={ticEventtps}
                header={header}
                showGridlines
                removableSort
                filters={filters}
                scrollable
                sortField="code"
                sortOrder={1}
                scrollHeight="750px"
                virtualScrollerOptions={{ itemSize: 46 }}
                tableStyle={{ minWidth: '50rem' }}
                metaKeySelection={false}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                onSelectionChange={(e) => setTicEventtp(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column
                    //bodyClassName="text-center"
                    body={actionTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />
                <Column field="code" header={translations[selectedLanguage].Code} sortable filter style={{ width: '25%' }}></Column>
                <Column field="textx" header={translations[selectedLanguage].Text} sortable filter style={{ width: '60%' }}></Column>
                <Column
                    field="valid"
                    filterField="valid"
                    dataType="numeric"
                    header={translations[selectedLanguage].Valid}
                    sortable
                    filter
                    filterElement={validFilterTemplate}
                    style={{ width: '15%' }}
                    bodyClassName="text-center"
                    body={validBodyTemplate}
                ></Column>
            </DataTable>
            <Dialog
                header={translations[selectedLanguage].EventTp}
                visible={visible}
                style={{ width: '50%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && <TicEventtp parameter={'inputTextValue'} ticEventtp={ticEventtp} handleDialogClose={handleDialogClose} setVisible={setVisible} dialog={true} eventtpTip={eventtpTip} />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].EventAttsList}
                visible={ticEventtpsLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicEventtpsLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && <TicEventtpsL parameter={'inputTextValue'} ticEventtp={ticEventtp} handleTicEventtpsLDialogClose={handleTicEventtpsLDialogClose} setTicEventtpsLVisible={setTicEventtpsLVisible} dialog={true} lookUp={false} />}
            </Dialog>
        </div>
    );
}
