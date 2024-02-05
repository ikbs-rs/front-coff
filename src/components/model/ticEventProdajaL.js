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
import env from '../../configs/env';
import WebMap from './remoteComponentContainer';
import WebSalMap from './ticDocW';

export default function TicEventL(props) {
    console.log(props, '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
    let i = 0;
    const objName = 'tic_event';
    const docId = props.ticDoc?.id || 1
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyTicEvent = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticEvents, setTicEvents] = useState([]);
    const [ticEvent, setTicEvent] = useState(emptyTicEvent);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [eventTip, setEventTip] = useState('');
    const [webMapVisible, setWebMapVisible] = useState(false);

    const generateImageUrl = (id, relpath, selectedLanguage) => {
        return `${env.IMG_BACK_URL}/public/tic/${id}.jpg/?relpath=${relpath}&sl=${selectedLanguage}`;
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const relPath = 'public/tic/event/';
                    const ticEventService = new TicEventService();
                    const data = await ticEventService.getProdajaLista();

                    const updatedData = data.map((obj) => {
                        return {
                            ...obj,
                            imageUrl: generateImageUrl(obj.id, relPath, selectedLanguage)
                        };
                    });
                    setTicEvents(updatedData);
                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);
    const handleCancelClick = () => {
        props.setTicEventProdajaLVisible(false);
    };

    const handleDialogClose = (newObj) => {
        const localObj = { newObj };

        let _ticEvents = [...ticEvents];
        let _ticEvent = { ...localObj.newObj.obj };

        //setSubmitted(true);
        if (localObj.newObj.eventTip === 'CREATE') {
            _ticEvents.push(_ticEvent);
        } else if (localObj.newObj.eventTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticEvents[index] = _ticEvent;
        } else if (localObj.newObj.eventTip === 'DELETE') {
            _ticEvents = ticEvents.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEvent Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEvent ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventTip}`, life: 3000 });
        setTicEvents(_ticEvents);
        setTicEvent(emptyTicEvent);
    };

    const handleTaskComplete = () => {
        console.log(ticEvent, '**********************handleTaskComplete**************************');
        if (ticEvent) {
            props.onTaskComplete(ticEvent);
        } else {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No row selected', life: 3000 });
        }
    };

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

    const openNew = () => {
        setTicEventDialog(emptyTicEvent);
    };

    const onRowSelect = (event) => {
        /*
            setTicEventDialog(event.data);
            setEventTip('UPDATE');  
        */
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
                {props.dialog && <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />}
                {/** 
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                */}
                <div className="flex flex-wrap gap-1">
                    {props.dialog && <Button label={translations[selectedLanguage].Confirm} icon="pi pi-table" onClick={handleTaskComplete} severity="info" text raised disabled={!ticEvent} />}
                </div>
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

    /*
    Web Map *********************************************************************************************************
    */
    const handleWebMapClick = async (rowData) => {
        try {
            setTicEvent(rowData)
            setWebMapDialog();
        } catch (error) {
            console.error(error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to fetch cmnPar data',
                life: 3000
            });
        }
    };

    const setWebMapDialog = () => {
        setWebMapVisible(true);
    };

    const handleWebMapDialogClose = (newObj) => {
        setWebMapVisible(false);
    };

    //  Dialog -------------------------------------------------------------------------------------------------------->

    const header = renderHeader();
    // heder za filter/>

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.imageUrl} alt={rowData.textx} className="w-6rem shadow-2 border-round" />;
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-map"
                    style={{ width: '24px', height: '24px' }}
                    className="p-button-outlined p-button-danger"
                    onClick={() => {
                        //setTicEventDialog(rowData);
                        handleWebMapClick(rowData)
                        setEventTip('SAL');
                    }}
                    text
                    raised
                ></Button>
            </div>
        );
    };
    const webTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-1">
                <Button
                    type="button"
                    icon="pi pi-palette"
                    style={{ width: '24px', height: '24px' }}
                    className="p-button-warning"
                    onClick={() => {
                        //setTicEventDialog(rowData);
                        handleWebMapClick(rowData)
                        setEventTip('WEB');
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
                selection={ticEvent}
                loading={loading}
                value={ticEvents}
                header={header}
                //showGridlines
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
                onSelectionChange={(e) => setTicEvent(e.value)}
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
                <Column
                    //bodyClassName="text-center"
                    body={webTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />                
                <Column field="code" header={translations[selectedLanguage].Code} sortable filter style={{ width: '10%' }}></Column>
                <Column field="text" header={translations[selectedLanguage].Text} sortable filter style={{ width: '20%' }}></Column>
                <Column body={imageBodyTemplate} header={translations[selectedLanguage].Image} style={{ width: '20%' }}></Column>
                <Column field="nctg" header={translations[selectedLanguage].ctg} sortable filter style={{ width: '10%' }}></Column>
                <Column field="ntp" header={translations[selectedLanguage].Type} sortable filter style={{ width: '10%' }}></Column>
                <Column field="nevent" header={translations[selectedLanguage].Event} sortable filter style={{ width: '15%' }}></Column>
                <Column field="begda" header={translations[selectedLanguage].Begda} sortable filter style={{ width: '7%' }} body={(rowData) => formatDateColumn(rowData, 'begda')}></Column>
                <Column field="endda" header={translations[selectedLanguage].Endda} sortable filter style={{ width: '7%' }} body={(rowData) => formatDateColumn(rowData, 'endda')}></Column>
                <Column field="begtm" header={translations[selectedLanguage].BegTM} sortable filter style={{ width: '7%' }} body={(rowData) => formatTimeColumn(rowData, 'begtm')}></Column>
                <Column field="endtm" header={translations[selectedLanguage].EndTM} sortable filter style={{ width: '10%' }} body={(rowData) => formatTimeColumn(rowData, 'endtm')}></Column>
            </DataTable>
            <Dialog
                header={translations[selectedLanguage].Event}
                visible={visible}
                style={{ width: '50%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && 
                    <TicEvent 
                        parameter={'inputTextValue'} 
                        ticEvent={ticEvent} 
                        handleDialogClose={handleDialogClose} 
                        setVisible={setVisible} 
                        dialog={true} 
                        eventTip={eventTip} 
                    />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].webMap}
                visible={webMapVisible}
                style={{ width: '90%', height: '1100px' }}
                onHide={() => {
                    setWebMapVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {webMapVisible && (
                    <WebSalMap
                    parameter={'inputTextValue'} 
                    ticEvent={ticEvent} 
                    handleDialogClose={handleDialogClose} 
                    setVisible={setVisible} 
                    dialog={true} 
                    eventTip={eventTip}                     
                    onTaskComplete={handleWebMapDialogClose}
                    />
                )}
                {/* {webMapVisible && (
                    <WebMap
                        remoteUrl= {`http://ws11.ems.local:3000/#/seatmap/${ticEvent.id}?docid=${docId}&sl=sr_cyr`}
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, ticDoc: props.ticDoc, parentOrigin: 'http://192.168.72.96:8354' }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleWebMapDialogClose}
                        originUrl="http://192.168.72.96:8353"
                    />
                )} */}
            </Dialog>
        </div>
    );
}
