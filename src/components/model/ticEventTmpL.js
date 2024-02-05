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
import { TicEventService } from '../../service/model/TicEventService';
import TicEvent from './ticEvent';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from '../../configs/translations';
import DateFunction from '../../utilities/DateFunction';
import ConfirmDialog from '../dialog/ConfirmDialog';

export default function TicEventL(props) {
console.log(props, "********************TicEventLTmp*********************************")
    let i = 0;
    const objName = 'tic_event';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyTicEvent = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [ticEvents, setTicEvents] = useState([]);
    const [ticEvent, setTicEvent] = useState(emptyTicEvent);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [eventTip, setEventTip] = useState('');
    const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);

    const handleCancelClick = () => {
        props.setTicEventTmpLVisible(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const ticEventService = new TicEventService();
                    const data = await ticEventService.getListaTmp();
                    setTicEvents(data);
                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticEvents.length; i++) {
            if (ticEvents[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };


    const handleActivationClick = () => {
        setConfirmDialogVisible(true);
    };


    const handleConfirm = async () => {
        //console.log(props.ticEvent, "***********handleConfirm********************")
        setSubmitted(true);
        const ticEventService = new TicEventService();
        await ticEventService.postCopyEvent(props.ticEvent.id, ticEvent.id, props.ticEvent.begda, props.ticEvent.endda);
        const data = await ticEventService.getListaTmp();
        setTicEvents(data);        
        //props.handleTicEventattsLDialogClose({ obj: props.ticEvent, docTip: 'UPDATE' });
        props.setTicEventTmpLVisible(false);
        //hideDeleteDialog();
        setConfirmDialogVisible(false);
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
            status: { value: null, matchMode: FilterMatchMode.EQUALS }
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
                <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
                />
                {/*
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Cenatp} icon="pi pi-dollar" onClick={openEventloc} text raised disabled={!ticEvent} />
                </div>
                    
                <div className="flex flex-wrap gap-1">
                    <SplitButton label={translations[selectedLanguage].Copy} /*icon="pi pi-copy" onClick={openEventloc}* model={copyItems} severity="info" raised text disabled={!ticEvent} />
                </div> 
            */}
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].CopyTemp} icon="pi pi-copy" severity="warning" onClick={handleActivationClick} text raised disabled={!ticEvent} />
                </div>
                {/* <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].Activation} icon="pi pi-caret-right" severity="danger" onClick={handleActivationClick} text raised disabled={!ticEvent} />
                </div>                 */}
                {/*        <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].CopyTemp} icon="pi pi-copy" onClick={openEventloc} text raised disabled={!ticEvent} />
                </div>
        */}
                <div className="flex-grow-1" />
                <b>{translations[selectedLanguage].EventsList}</b>
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

    const formatDateColumn = (rowData, field) => {
        return DateFunction.formatDate(rowData[field]);
    };

    const formatTimeColumn = (rowData, field) => {
        return DateFunction.convertTimeToDisplayFormat(rowData[field]);
    };

    const statusBodyTemplate = (rowData) => {
        const status = rowData.status == 1 ? true : false;
        return (
            <i
                className={classNames('pi', {
                    'text-green-500 pi-check-circle': status,
                    'text-red-500 pi-times-circle': !status
                })}
            ></i>
        );
    };

    const statusFilterTemplate = (options) => {
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
    const setTicEventDialog = (ticEvent) => {
        setVisible(true);
        setEventTip('CREATE');
        setTicEvent({ ...ticEvent });
    };
    //  Dialog --->

    const header = renderHeader();
    // heder za filter/>

    return (
        <div className="card">
            <Toast ref={toast} />
            <DataTable
                dataKey="id"
                selectionMode="single"
                selection={ticEvent}
                loading={loading}
                value={ticEvents}
                header={header}
                showGridlines
                removableSort
                filters={filters}
                scrollable
                sortField="code"
                sortOrder={1}
                scrollHeight="650px"
                virtualScrollerOptions={{ itemSize: 46 }}
                tableStyle={{ minWidth: '50rem' }}
                metaKeySelection={false}
                paginator
                rows={40}
                rowsPerPageOptions={[10, 20, 40, 80]}
                onSelectionChange={(e) => setTicEvent(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column field="npar" header={translations[selectedLanguage].Organizer} sortable filter style={{ width: '20%' }}></Column>
                <Column field="code" header={translations[selectedLanguage].Code} sortable filter style={{ width: '10%' }}></Column>
                <Column field="text" header={translations[selectedLanguage].Text} sortable filter style={{ width: '20%' }}></Column>
                <Column field="nctg" header={translations[selectedLanguage].ctg} sortable filter style={{ width: '10%' }}></Column>
                <Column field="ntp" header={translations[selectedLanguage].Type} sortable filter style={{ width: '10%' }}></Column>
                <Column field="nevent" header={translations[selectedLanguage].ParentEvent} sortable filter style={{ width: '15%' }}></Column>
                <Column field="begda" header={translations[selectedLanguage].Begda} sortable filter style={{ width: '7%' }} body={(rowData) => formatDateColumn(rowData, 'begda')}></Column>
                <Column field="endda" header={translations[selectedLanguage].Endda} sortable filter style={{ width: '7%' }} body={(rowData) => formatDateColumn(rowData, 'endda')}></Column>
                <Column field="begtm" header={translations[selectedLanguage].BegTM} sortable filter style={{ width: '7%' }} body={(rowData) => formatTimeColumn(rowData, 'begtm')}></Column>
                <Column field="endtm" header={translations[selectedLanguage].EndTM} sortable filter style={{ width: '10%' }} body={(rowData) => formatTimeColumn(rowData, 'endtm')}></Column>
                <Column
                    field="status"
                    filterField="status"
                    dataType="numeric"
                    header={translations[selectedLanguage].Status}
                    sortable
                    filter
                    filterElement={statusFilterTemplate}
                    style={{ width: '10%' }}
                    bodyClassName="text-center"
                    body={statusBodyTemplate}
                ></Column>
            </DataTable>
            <ConfirmDialog 
                visible={confirmDialogVisible} 
                onHide={() => setConfirmDialogVisible(false)} 
                onConfirm={handleConfirm} 
                uPoruka={'Kopiranje templejta, da li ste sigurni?'}
            />
        </div>
    );
}
