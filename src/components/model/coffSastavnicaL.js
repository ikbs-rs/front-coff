import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CoffSastavnicaService } from "../../service/model/CoffSastavnicaService";
import CoffSastavnica from './coffSastavnica';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function CoffSastavnicaL(props) {
  console.log("************************",props)
  const objName = "coff_sastavnica"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyCoffSastavnica = EmptyEntities[objName]
  emptyCoffSastavnica.art2 = props.ticArt.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffSastavnicas, setCoffSastavnicas] = useState([]);
  const [coffSastavnica, setCoffSastavnica] = useState(emptyCoffSastavnica);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [sastavnicaTip, setSastavnicaTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setCoffSastavnicaLVisible(false);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const coffSastavnicaService = new CoffSastavnicaService();
          const data = await coffSastavnicaService.getLista(props.ticArt.id);
          setCoffSastavnicas(data);

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

    let _coffSastavnicas = [...coffSastavnicas];
    let _coffSastavnica = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.sastavnicaTip === "CREATE") {
      _coffSastavnicas.push(_coffSastavnica);
    } else if (localObj.newObj.sastavnicaTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _coffSastavnicas[index] = _coffSastavnica;
    } else if ((localObj.newObj.sastavnicaTip === "DELETE")) {
      _coffSastavnicas = coffSastavnicas.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffSastavnica Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffSastavnica ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.sastavnicaTip}`, life: 3000 });
    setCoffSastavnicas(_coffSastavnicas);
    setCoffSastavnica(emptyCoffSastavnica);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < coffSastavnicas.length; i++) {
      if (coffSastavnicas[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCoffSastavnicaDialog(emptyCoffSastavnica);
  };

  const onRowSelect = (event) => {
    //coffSastavnica.begda = event.data.begda
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
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].SastavnicaList}</b>
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
  const setCoffSastavnicaDialog = (coffSastavnica) => {
    setVisible(true)
    setSastavnicaTip("CREATE")
    setCoffSastavnica({ ...coffSastavnica });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const sastavnicaTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCoffSastavnicaDialog(rowData)
            setSastavnicaTip("UPDATE")
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
                value={props.ticArt.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.ticArt.text}
                disabled={true}
              />
            </div>           
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={coffSastavnica}
        loading={loading}
        value={coffSastavnicas}
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
        onSelectionChange={(e) => setCoffSastavnica(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={sastavnicaTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cart1"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="nart1"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "50%" }}
        ></Column>       
        <Column
          field="cum"
          header={translations[selectedLanguage].cum}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>  
        <Column
          field="ration"
          header={translations[selectedLanguage].ration}
          sortable
          filter
          style={{ width: "10%" }}
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
          <CoffSastavnica
            parameter={"inputTextValue"}
            coffSastavnica={coffSastavnica}
            ticArt={props.ticArt}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            sastavnicaTip={sastavnicaTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
    </div>
  );
}
