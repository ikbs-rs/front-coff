import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicPrivilegecondService } from "../../service/model/TicPrivilegecondService";
import TicPrivilegecond from './ticPrivilegecond';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function TicPrivilegecondL(props) {

  const objName = "tic_privilegecond"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyTicPrivilegecond = EmptyEntities[objName]
  emptyTicPrivilegecond.privilege = props.ticPrivilege.id
  emptyTicPrivilegecond.begcondition = '>='
  emptyTicPrivilegecond.endcondition = '<='
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticPrivilegeconds, setTicPrivilegeconds] = useState([]);
  const [ticPrivilegecond, setTicPrivilegecond] = useState(emptyTicPrivilegecond);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [privilegecondTip, setPrivilegecondTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setTicPrivilegecondLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticPrivilegecondService = new TicPrivilegecondService();
          const data = await ticPrivilegecondService.getLista(props.ticPrivilege.id);
          setTicPrivilegeconds(data);

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

    let _ticPrivilegeconds = [...ticPrivilegeconds];
    let _ticPrivilegecond = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.privilegecondTip === "CREATE") {
      _ticPrivilegeconds.push(_ticPrivilegecond);
    } else if (localObj.newObj.privilegecondTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticPrivilegeconds[index] = _ticPrivilegecond;
    } else if ((localObj.newObj.privilegecondTip === "DELETE")) {
      _ticPrivilegeconds = ticPrivilegeconds.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicPrivilegecond Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicPrivilegecond ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.privilegecondTip}`, life: 3000 });
    setTicPrivilegeconds(_ticPrivilegeconds);
    setTicPrivilegecond(emptyTicPrivilegecond);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticPrivilegeconds.length; i++) {
      if (ticPrivilegeconds[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicPrivilegecondDialog(emptyTicPrivilegecond);
  };

  const onRowSelect = (event) => {
    //ticPrivilegecond.begda = event.data.begda
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
        <b>{translations[selectedLanguage].PrivilegecondList}</b>
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
  const setTicPrivilegecondDialog = (ticPrivilegecond) => {
    setVisible(true)
    setPrivilegecondTip("CREATE")
    setTicPrivilegecond({ ...ticPrivilegecond });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const privilegecondTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicPrivilegecondDialog(rowData)
            setPrivilegecondTip("UPDATE")
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
                value={props.ticPrivilege.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.ticPrivilege.text}
                disabled={true}
              />
            </div>           
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticPrivilegecond}
        loading={loading}
        value={ticPrivilegeconds}
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
        onSelectionChange={(e) => setTicPrivilegecond(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={privilegecondTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cbegcondtp"
          header={translations[selectedLanguage].Begcond}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="nbegcondtp"
          header={translations[selectedLanguage].Nbegcond}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>  
        <Column
          field="begvalue"
          header={translations[selectedLanguage].Begvalue}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>        
        <Column
          field="cendcondtp"
          header={translations[selectedLanguage].Endcond}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="nendcondtp"
          header={translations[selectedLanguage].Nendcond}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>   
        <Column
          field="endvalue"
          header={translations[selectedLanguage].Endvalue}
          sortable
          filter
          style={{ width: "20%" }}
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
        header={translations[selectedLanguage].Privilegecond}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicPrivilegecond
            parameter={"inputTextValue"}
            ticPrivilegecond={ticPrivilegecond}
            ticPrivilege={props.ticPrivilege}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            privilegecondTip={privilegecondTip}
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
