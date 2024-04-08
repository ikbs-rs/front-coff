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

export default function SapOrgL(props) {
  let i = 0
  const objName = "tic_agenda"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptySapOrg = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [sapOrgs, setSapOrgs] = useState([]);
  const [sapOrg, setSapOrg] = useState(emptySapOrg);
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
        const sapOrgService = new SapDataService();
        const data = await sapOrgService.getLista('org');
        console.log(data, "********************* Date ****************************")
        setSapOrgs(data);
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

    let _sapOrgs = [...sapOrgs];
    let _sapOrg = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.agendaTip === "CREATE") {
      _sapOrgs.push(_sapOrg);
    } else if (localObj.newObj.agendaTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _sapOrgs[index] = _sapOrg;
    } else if ((localObj.newObj.agendaTip === "DELETE")) {
      _sapOrgs = sapOrgs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'SapOrg Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'SapOrg ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.agendaTip}`, life: 3000 });
    setSapOrgs(_sapOrgs);
    setSapOrg(emptySapOrg);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < sapOrgs.length; i++) {
      if (sapOrgs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setSapOrgDialog(emptySapOrg);
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
        <b>{translations[selectedLanguage].OrgLista}</b>
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
    const valid = rowData.valid == 1?true:false
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
  const setSapOrgDialog = (sapOrg) => {
    setVisible(true)
    setAgendaTip("CREATE")
    setSapOrg({ ...sapOrg });
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
            setSapOrgDialog(rowData)
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
        dataKey="ORG_ID"
        size={"small"}
        selectionMode="single"
        selection={sapOrg}
        loading={loading}
        value={sapOrgs}
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
        onSelectionChange={(e) => setSapOrg(e.value)}
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
          field="ORG"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="NORG"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "80%" }}
        ></Column>
        <Column
          field="LEVEL"
          header={translations[selectedLanguage].Nivo}
          sortable
          filter
          style={{ width: "5%" }}
        ></Column>         
        <Column
          field="RANK"
          header={translations[selectedLanguage].Order}
          sortable
          filter
          style={{ width: "5%" }}
        ></Column>                       
      </DataTable>
    </div>
  );
}
