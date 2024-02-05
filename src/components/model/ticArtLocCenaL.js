import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { Toast } from 'primereact/toast';
import { TicArtService } from '../../service/model/TicArtService';
import TicArt from './ticArt';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from '../../configs/translations';
import DateFunction from '../../utilities/DateFunction';
import TicArtlocL from './ticArtlocL';
import TicArtcenaL from './ticArtcenaL';

export default function TicArtL(props) {
    const objName = 'tic_art';
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const emptyTicArt = EmptyEntities[objName];
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [ticArts, setTicArts] = useState([]);
    const [ticArt, setTicArt] = useState(emptyTicArt);
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [artTip, setLocTip] = useState('');
    const [ticArtlocLVisible, setTicArtlocLVisible] = useState(false);
    const [ticArtcenaLVisible, setTicArtcenaLVisible] = useState(false);
    let i = 0;
    const handleCancelClick = () => {
        props.setTicArtLVisible(false);
        if (props.eventArt) props.setTicEventartLVisible(false);
    };

    const handleConfirmClick = () => {
        if (ticArt) {
            props.onTaskComplete(ticArt); 
        } else {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No row selected', life: 3000 });
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                ++i;
                if (i < 2) {
                    const ticArtService = new TicArtService();
                    let data = [];
                    if (props.eventArt) {
                        data = await ticArtService.getEventLista(props.ticEvent.id);
                    } else {
                        data = await ticArtService.getLista();
                    }
                    setTicArts(data);

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

        let _ticArts = [...ticArts];
        let _ticArt = { ...localObj.newObj.obj };
        //setSubmitted(true);
        if (localObj.newObj.artTip === 'CREATE') {
            _ticArts.push(_ticArt);
        } else if (localObj.newObj.artTip === 'UPDATE') {
            const index = findIndexById(localObj.newObj.obj.id);
            _ticArts[index] = _ticArt;
        } else if (localObj.newObj.artTip === 'DELETE') {
            _ticArts = ticArts.filter((val) => val.id !== localObj.newObj.obj.id);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicArt Delete', life: 3000 });
        } else {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicArt ?', life: 3000 });
        }
        toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.artTip}`, life: 3000 });
        setTicArts(_ticArts);
        setTicArt(emptyTicArt);
    };

    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < ticArts.length; i++) {
            if (ticArts[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const handleTicArtlocLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const handleTicArtcenaLDialogClose = (newObj) => {
        const localObj = { newObj };
    };

    const openNew = () => {
        setTicArtDialog(emptyTicArt);
    };

    const handleLocClick = () => {
        setCmnLocDialog();
    };

    const handleCenaClick = () => {
        setTicCenaDialog();
    };

    const onRowSelect = (event) => {
        //ticArt.begda = event.data.begda
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
                        <Button label={translations[selectedLanguage].Confirm} icon="pi pi-times" onClick={handleConfirmClick} text raised disabled={!ticArt} />
                    </>
                )}
                <div className="flex flex-wrap gap-1">
                    <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
                </div>
                <div className="flex flex-wrap gap-1" />
                <Button label={translations[selectedLanguage].Loc} icon="pi pi-map" onClick={handleLocClick} text raised disabled={!ticArt} />
                <div className="flex flex-wrap gap-1" />
                <Button label={translations[selectedLanguage].Cena} icon="pi pi-euro" onClick={handleCenaClick} text raised disabled={!ticArt} />
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

    const setTicCenaDialog = () => {
        setShowMyComponent(true);
        setTicArtcenaLVisible(true);
    };

    const setCmnLocDialog = () => {
        setShowMyComponent(true);
        setTicArtlocLVisible(true);
    };

    // <--- Dialog
    const setTicArtDialog = (ticArt) => {
        setVisible(true);
        setLocTip('CREATE');
        setTicArt({ ...ticArt });
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
                        setTicArtDialog(rowData);
                        setLocTip('UPDATE');
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
                selection={ticArt}
                loading={loading}
                value={ticArts}
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
                onSelectionChange={(e) => setTicArt(e.value)}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
            >
                <Column
                    //bodyClassName="text-center"
                    body={locTemplate}
                    exportable={false}
                    headerClassName="w-10rem"
                    style={{ minWidth: '4rem' }}
                />
                <Column field="code" header={translations[selectedLanguage].Code} sortable filter style={{ width: '15%' }}></Column>
                <Column field="text" header={translations[selectedLanguage].Text} sortable filter style={{ width: '30%' }}></Column>
                <Column field="ctp" header={translations[selectedLanguage].Code} sortable filter style={{ width: '15%' }}></Column>
                <Column field="ntp" header={translations[selectedLanguage].Text} sortable filter style={{ width: '35%' }}></Column>
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
                ></Column>
            </DataTable>
            <Dialog
                header={translations[selectedLanguage].Art}
                visible={visible}
                style={{ width: '60%' }}
                onHide={() => {
                    setVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && <TicArt parameter={'inputTextValue'} ticArt={ticArt} handleDialogClose={handleDialogClose} setVisible={setVisible} ticEventId={props.eventArt ? props.ticEvent.id : null} dialog={true} artTip={artTip} />}
                <div className="p-dialog-header-icons" style={{ display: 'none' }}>
                    <button className="p-dialog-header-close p-link">
                        <span className="p-dialog-header-close-icon pi pi-times"></span>
                    </button>
                </div>
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].ArtlocList}
                visible={ticArtlocLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicArtlocLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && <TicArtlocL parameter={'inputTextValue'} ticArt={ticArt} handleTicArtlocLDialogClose={handleTicArtlocLDialogClose} setTicArtlocLVisible={setTicArtlocLVisible} dialog={true} lookUp={false} />}
            </Dialog>
            <Dialog
                header={translations[selectedLanguage].ArtcenaList}
                visible={ticArtcenaLVisible}
                style={{ width: '90%' }}
                onHide={() => {
                    setTicArtcenaLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {showMyComponent && <TicArtcenaL parameter={'inputTextValue'} ticArt={ticArt} handleTicArtcenaLDialogClose={handleTicArtcenaLDialogClose} setTicArtcenaLVisible={setTicArtcenaLVisible} dialog={true} lookUp={false} />}
            </Dialog>
        </div>
    );
}
