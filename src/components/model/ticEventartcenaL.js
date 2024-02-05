import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicEventartcenaService } from "../../service/model/TicEventartcenaService";
import TicEventartcena from './ticEventartcena';
import TicEventartcenaT from './ticEventartcenaT';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function TicEventartcenaL(props) {
console.log(props, "-----------------------------------------------------------------------")
  const objName = "tic_eventartcena"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyTicEventartcena = EmptyEntities[objName]
  emptyTicEventartcena.eventart = props.ticEventart.id
  emptyTicEventartcena.event = props.ticEventart.event
  emptyTicEventartcena.art = props.ticEventart.art
  emptyTicEventartcena.begda = props.ticEventart.begda
  emptyTicEventartcena.endda = props.ticEventart.endda
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticEventartcenas, setTicEventartcenas] = useState([]);
  const [ticEventartcena, setTicEventartcena] = useState(emptyTicEventartcena);
  const [ticEventartcenaT, setTicEventartcenaT] = useState(emptyTicEventartcena);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleT, setVisibleT] = useState(false);
  const [eventartcenaTip, setEventartcenaTip] = useState('');
  const [eventartcenaTTip, setEventartcenaTTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setTicEventartcenaLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticEventartcenaService = new TicEventartcenaService();
          const data = await ticEventartcenaService.getLista(props.ticEventart.id);
          console.log(data, "############################################")
          setTicEventartcenas(data);

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
    console.log(newObj, "***************************************handleDialogClose****************----------------")
    props.handleRefresh(newObj.obj.id+newObj.obj.value);

    let _ticEventartcenas = [...ticEventartcenas];
    let _ticEventartcena = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.eventartcenaTip === "CREATE") {
      _ticEventartcenas.push(_ticEventartcena);
    } else if (localObj.newObj.eventartcenaTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticEventartcenas[index] = _ticEventartcena;
    } else if ((localObj.newObj.eventartcenaTip === "DELETE")) {
      _ticEventartcenas = ticEventartcenas.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventartcena Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventartcena ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventartcenaTip}`, life: 3000 });
    setTicEventartcenas(_ticEventartcenas);
    setTicEventartcena(emptyTicEventartcena);
    setTicEventartcenaT(emptyTicEventartcena);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticEventartcenas.length; i++) {
      if (ticEventartcenas[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicEventartcenaDialog(emptyTicEventartcena);
  };

  const openNewT = () => {
    setTicEventartcenaTDialog(emptyTicEventartcena);
  };  

  const onRowSelect = (event) => {
    //ticEventartcena.begda = event.data.begda
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
      ccena: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ncena: {
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
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].CenaT} icon="pi pi-clock" severity="success"  onClick={openNewT} text raised />
        </div>          
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventartcenaList}</b>
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
  const setTicEventartcenaDialog = (ticEventartcena) => {
    setVisible(true)
    setEventartcenaTip("CREATE")
    setTicEventartcena({ ...ticEventartcena });
  }

  const setTicEventartcenaTDialog = (ticEventartcena) => {
    setVisibleT(true)
    setEventartcenaTTip("CREATE")
    setTicEventartcenaT({ ...ticEventartcena });
  }  
  
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const eventartcenaTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicEventartcenaDialog(rowData)
            setEventartcenaTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  const eventartcenaTTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicEventartcenaTDialog(rowData)
            setEventartcenaTTip("UPDATE")
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
                value={props.ticEventart.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.ticEventart.text}
                disabled={true}
              />
            </div>           
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticEventartcena}
        loading={loading}
        value={ticEventartcenas}
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
        onSelectionChange={(e) => setTicEventartcena(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={eventartcenaTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="ccena"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="ncena"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "299%" }}
        ></Column>    
        <Column
          field="cterr"
          header={translations[selectedLanguage].Cterr}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="nterr"
          header={translations[selectedLanguage].Nterr}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>  
        <Column
          field="ccurr"
          header={translations[selectedLanguage].Ccurr}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="ncurr"
          header={translations[selectedLanguage].Ncurr}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>  
        <Column
          field="value"
          header={translations[selectedLanguage].Value}
          sortable
          filter
          style={{ width: "10%" }}
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
        header={translations[selectedLanguage].Cena}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicEventartcena
            parameter={"inputTextValue"}
            ticEventartcena={ticEventartcena}
            ticEventart={props.ticEventart}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            eventartcenaTip={eventartcenaTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].CenaT}
        visible={visibleT}
        style={{ width: '60%' }}
        onHide={() => {
          setVisibleT(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicEventartcenaT
            parameter={"inputTextValue"}
            ticEventartcena={ticEventartcena}
            ticEventart={props.ticEventart}
            handleDialogClose={handleDialogClose}
            setVisible={setVisibleT}
            dialog={true}
            eventartcenaTip={"CREATE"}
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
