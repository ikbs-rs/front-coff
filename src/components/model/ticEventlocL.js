import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicEventlocService } from "../../service/model/TicEventlocService";
import TicEventloc from './ticEventloc';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import ConfirmDialog from '../dialog/ConfirmDialog';


export default function TicEventlocL(props) {

  const objName = "tic_eventloc"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicEventloc = EmptyEntities[objName]
  emptyTicEventloc.event = props.ticEvent.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticEventlocs, setTicEventlocs] = useState([]);
  const [ticEventloc, setTicEventloc] = useState(emptyTicEventloc);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [eventlocTip, setEventlocTip] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  let i = 0
  const handleCancelClick = () => {
    props.setTicEventlocLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticEventlocService = new TicEventlocService();
          const data = await ticEventlocService.getLista(props.ticEvent.id);
          setTicEventlocs(data);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleAutoInputClick = () => {
    setConfirmDialogVisible(true);
  };

  const handleConfirm = async () => {
    //console.log(props.ticEvent, "***********handleConfirm********************")
    setSubmitted(true);
    const ticEventlocService = new TicEventlocService();
    await ticEventlocService.postAutoEventatts(props.ticEvent.id);
    const data = await ticEventlocService.getLista(props.ticEvent.id);
    setTicEventloc(data);
    props.handleTicEventattsLDialogClose({ obj: props.ticEvent, docTip: 'UPDATE' });
    props.setVisible(false);
    //hideDeleteDialog();
    setConfirmDialogVisible(false);
  };

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _ticEventlocs = [...ticEventlocs];
    let _ticEventloc = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.eventlocTip === "CREATE") {
      _ticEventlocs.push(_ticEventloc);
    } else if (localObj.newObj.eventlocTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticEventlocs[index] = _ticEventloc;
    } else if ((localObj.newObj.eventlocTip === "DELETE")) {
      _ticEventlocs = ticEventlocs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventloc Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventloc ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventlocTip}`, life: 3000 });
    setTicEventlocs(_ticEventlocs);
    setTicEventloc(emptyTicEventloc);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticEventlocs.length; i++) {
      if (ticEventlocs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicEventlocDialog(emptyTicEventloc);
  };

  const onRowSelect = (event) => {
    //ticEventloc.begda = event.data.begda
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 3000,
    });
  };
  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ctp: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ntp: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      endda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      begda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      }
    });
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    let value1 = e.target.value
    let _filters = { ...filters };

    _filters["global"].value = value1;

    setFilters(_filters);
    setGlobalFilterValue(value1);
  };

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        {/* <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].AutoAtts} icon="pi pi-copy" severity="warning" onClick={handleAutoInputClick} text raised />
        </div> */}
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventlocList}</b>
        <div className="flex-grow-1"></div>
        <div className="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder={translations[selectedLanguage].KeywordSearch}
            />
          </span>
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label={translations[selectedLanguage].Clear}
            outlined
            onClick={clearFilter}
            text raised
          />
        </div>
      </div>
    );
  };

  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  // <--- Dialog
  const setTicEventlocDialog = (ticEventloc) => {
    setVisible(true)
    setEventlocTip("CREATE")
    setTicEventloc({ ...ticEventloc });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const eventlocTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicEventlocDialog(rowData)
            setEventlocTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="code">{translations[selectedLanguage].Code}</label>
              <InputText id="code"
                value={props.ticEvent.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.ticEvent.textx}
                disabled={true}
              />
            </div>
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticEventloc}
        loading={loading}
        value={ticEventlocs}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="550px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setTicEventloc(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={eventlocTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cloc"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="nloc"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "60%" }}
        ></Column>
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column>
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
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
        {showMyComponent && (
          <TicEventloc
            parameter={"inputTextValue"}
            ticEventloc={ticEventloc}
            ticEvent={props.ticEvent}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            eventlocTip={eventlocTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <ConfirmDialog visible={confirmDialogVisible} onHide={() => setConfirmDialogVisible(false)} onConfirm={handleConfirm} />
    </div>
  );
}
