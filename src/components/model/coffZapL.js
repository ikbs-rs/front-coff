import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import './index.css';
import { CoffZapService } from "../../service/model/CoffZapService";
import CoffZap from './coffZap';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import CoffZaplinkL from "./coffZaplinkL";

export default function CoffZapL(props) {
  let i = 0
  const objName = "coff_zap"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCoffZap = { ...EmptyEntities[objName] }
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffZaps, setCoffZaps] = useState([]);
  const [coffZap, setCoffZap] = useState(emptyCoffZap);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [zapTip, setZapTip] = useState('');
  const [coffZaplinkLVisible, setCoffZaplinkLVisible] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i<2) {  
        const coffZapService = new CoffZapService();
        const data = await coffZapService.getLista('/zap');
        setCoffZaps(data);
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

    let _coffZaps = [...coffZaps];
    let _coffZap = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.zapTip === "CREATE") {
      _coffZaps.push(_coffZap);
    } else if (localObj.newObj.zapTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _coffZaps[index] = _coffZap;
    } else if ((localObj.newObj.zapTip === "DELETE")) {
      _coffZaps = coffZaps.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffZap Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffZap ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.zapTip}`, life: 3000 });
    setCoffZaps(_coffZaps);
    setCoffZap({ ...emptyCoffZap });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < coffZaps.length; i++) {
      if (coffZaps[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCoffZapDialog(emptyCoffZap);
  };

  const handleZaplinkClick = () => {
    setShowMyComponent(true);
    setCoffZaplinkLVisible(true);
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
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex flex-wrap gap-1" />
        <Button
          label={translations[selectedLanguage].Zaplink}
          icon="pi pi-link"
          onClick={handleZaplinkClick}
          text
          raised
          disabled={!coffZap?.id}
        />
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].ZapList}</b>
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
    return Number(rowData.valid) === 1
      ? translations[selectedLanguage].Yes
      : translations[selectedLanguage].No;
  };

  const validFilterTemplate = (options) => {
    const validOptions = [
      { name: translations[selectedLanguage].Yes, code: '1' },
      { name: translations[selectedLanguage].No, code: '0' },
    ];

    return (
      <div className="flex align-items-center gap-2">
        <Dropdown
          value={options.value ?? null}
          options={validOptions}
          onChange={(e) => options.filterCallback(e.value)}
          optionLabel="name"
          optionValue="code"
          placeholder={translations[selectedLanguage].Selekcija || "Select"}
          showClear
          className="w-full"
        />
      </div>
    );
  };

  // <--- Dialog
  const setCoffZapDialog = (coffZap) => {
    setShowMyComponent(true)
    setVisible(true)
    setZapTip("CREATE")
    setCoffZap({ ...coffZap });
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
            setCoffZapDialog(rowData)
            setZapTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  return (
    <div className="card model-grid-page">
      <Toast ref={toast} />
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={coffZap}
        loading={loading}
        value={coffZaps}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="code"        
        sortOrder={1}
        scrollHeight="flex"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setCoffZap(e.value)}
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
          field="zap"
          header={translations[selectedLanguage].Zap}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="IME"
          header={translations[selectedLanguage].Ime}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="PREZIME"
          header={translations[selectedLanguage].Prezime}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>                
        <Column
          field="email"
          header="Email"
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="NRM"
          header={translations[selectedLanguage].nrm}
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="LOK"
          header={translations[selectedLanguage].Loc}
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="valid"
          filterField="valid"
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
        header={translations[selectedLanguage].Zap}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffZap
            parameter={"inputTextValue"}
            coffZap={coffZap}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            zapTip={zapTip}
          />
        )}
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].ZaplinkList}
        visible={coffZaplinkLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setCoffZaplinkLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffZaplinkL
            coffZap={coffZap}
            setCoffZaplinkLVisible={setCoffZaplinkLVisible}
            dialog={true}
          />
        )}
      </Dialog>
    </div>
  );
}
