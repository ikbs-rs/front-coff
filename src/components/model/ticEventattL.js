import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import './index.css';
import { TicEventattService } from "../../service/model/TicEventattService";
import TicEventatt from './ticEventatt';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function TicEventattL(props) {
  let i = 0
  const objName = "tic_eventatt"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicEventatt = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticEventatts, setTicEventatts] = useState([]);
  const [ticEventatt, setTicEventatt] = useState(emptyTicEventatt);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [eventattTip, setEventattTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticEventattService = new TicEventattService();
          const data = await ticEventattService.getLista();
          console.log(data, "***************************************TicEventattL*****************************************")
          setTicEventatts(data);
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

    let _ticEventatts = [...ticEventatts];
    let _ticEventatt = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.eventattTip === "CREATE") {
      _ticEventatts.push(_ticEventatt);
    } else if (localObj.newObj.eventattTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticEventatts[index] = _ticEventatt;
    } else if ((localObj.newObj.eventattTip === "DELETE")) {
      _ticEventatts = ticEventatts.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventatt Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventatt ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventattTip}`, life: 3000 });
    setTicEventatts(_ticEventatts);
    setTicEventatt(emptyTicEventatt);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticEventatts.length; i++) {
      if (ticEventatts[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicEventattDialog(emptyTicEventatt);
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.textx}`,
      life: 3000,
    });
  };


  const handleConfirmClick = () => {
    if (ticEventatt) {
      props.onTaskComplete(ticEventatt);
    } else {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No row selected', life: 3000 });
    }
  };

  const handleCancelClick = () => {
    props.setTicEventattLVisible(false);
    if (props.ticEventatt) props.setTicEventttLVisible(false);
  };

  // <heder za filter
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      textx: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      valid: { value: null, matchMode: FilterMatchMode.EQUALS },
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
        {props.lookUp && (
          <>
            <div className="flex flex-wrap gap-1" />
            <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />
            <div className="flex flex-wrap gap-1" />
            <Button label={translations[selectedLanguage].Confirm} icon="pi pi-times" onClick={handleConfirmClick} text raised disabled={!ticEventatt} />
          </>
        )}
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].EventAttsList}</b>
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

  const validBodyTemplate = (rowData) => {
    const valid = rowData.valid == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
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
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };

  // <--- Dialog
  const setTicEventattDialog = (ticEventatt) => {
    setVisible(true)
    setEventattTip("CREATE")
    setTicEventatt({ ...ticEventatt });
  }
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
            setTicEventattDialog(rowData)
            setEventattTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticEventatt}
        loading={loading}
        value={ticEventatts}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="code"
        sortOrder={1}
        scrollHeight="650px"
        //virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={50}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setTicEventatt(e.value)}
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
          field="code"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="text"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "55%" }}
        ></Column>
        <Column
          field="ntp"
          header={translations[selectedLanguage].ntp}
          sortable
          filter
          style={{ width: "55%" }}
        ></Column>
        <Column
          field="ddlist"
          header={translations[selectedLanguage].ddlist}
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="valid"
          filterField="valid"
          dataType="numeric"
          header={translations[selectedLanguage].Valid}
          sortable
          filter
          filterElement={validFilterTemplate}
          style={{ width: "10%" }}
          bodyClassName="text-center"
          body={validBodyTemplate}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].EventAtt}
        visible={visible}
        style={{ width: '50%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicEventatt
            parameter={"inputTextValue"}
            ticEventatt={ticEventatt}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            eventattTip={eventattTip}
          />
        )}
      </Dialog>
    </div>
  );
}
