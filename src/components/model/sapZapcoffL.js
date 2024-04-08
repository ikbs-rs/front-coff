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
import { SapDataService } from "../../service/model/SapDataService";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction"

export default function SapZapcoffL(props) {
  let i = 0
  const objName = "tic_agenda"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptySapZapcoff = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [sapZapcoffs, setSapZapcoffs] = useState([]);
  const [sapZapcoff, setSapZapcoff] = useState(emptySapZapcoff);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [agendaTip, setAgendaTip] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i<2) {  
        const sapZapcoffService = new SapDataService();
        const data = await sapZapcoffService.getLista('zapcoff');
        console.log(data, "********************* Date zapcoff ****************************")
        setSapZapcoffs(data);
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

    let _sapZapcoffs = [...sapZapcoffs];
    let _sapZapcoff = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.agendaTip === "CREATE") {
      _sapZapcoffs.push(_sapZapcoff);
    } else if (localObj.newObj.agendaTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _sapZapcoffs[index] = _sapZapcoff;
    } else if ((localObj.newObj.agendaTip === "DELETE")) {
      _sapZapcoffs = sapZapcoffs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'SapZapcoff Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'SapZapcoff ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.agendaTip}`, life: 3000 });
    setSapZapcoffs(_sapZapcoffs);
    setSapZapcoff(emptySapZapcoff);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < sapZapcoffs.length; i++) {
      if (sapZapcoffs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setSapZapcoffDialog(emptySapZapcoff);
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
        {/* <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div> */}
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].RukcoffLista}</b>
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

  const formatTimeColumn = (rowData, field) => {
    return DateFunction.convertTimeToDisplayFormat (rowData[field]);
  };

  const validBodyTemplate = (rowData) => {
    const valid = rowData.VALID == 'true'?true:false
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
  const setSapZapcoffDialog = (sapZapcoff) => {
    setVisible(true)
    setAgendaTip("CREATE")
    setSapZapcoff({ ...sapZapcoff });
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
            setSapZapcoffDialog(rowData)
            setAgendaTip("UPDATE")
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
        dataKey="ZAP"
        size={"small"}
        selectionMode="single"
        selection={sapZapcoff}
        loading={loading}
        value={sapZapcoffs}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="code"        
        sortOrder={1}
        scrollHeight="750px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={250}
        rowsPerPageOptions={[250, 500, 750]}
        onSelectionChange={(e) => setSapZapcoff(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        {/* <Column
          //bodyClassName="text-center"
          body={actionTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />         */}
        <Column
          field="ZAP"
          header={translations[selectedLanguage].MBR}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>        
        <Column
          field="IME"
          header={translations[selectedLanguage].Ime}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="PREZIME"
          header={translations[selectedLanguage].Prezime}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="NRM"
          header={translations[selectedLanguage].nrm}
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>         
        <Column
          field="NORG"
          header={translations[selectedLanguage].norg}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>    
        <Column
          field="NVPOSLA"
          header={translations[selectedLanguage].nvposla}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column> 
        <Column
          field="VALID"
          filterField="VALID"
          header={translations[selectedLanguage].Valid}
          sortable
          filter
          filterElement={validFilterTemplate}
          style={{ width: "5%" }}
          bodyClassName="text-center"
          body={validBodyTemplate}
        ></Column>                                   
      </DataTable>
    </div>
  );
}
