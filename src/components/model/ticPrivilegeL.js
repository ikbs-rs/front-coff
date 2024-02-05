import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicPrivilegeService } from "../../service/model/TicPrivilegeService";
import TicPrivilege from './ticPrivilege';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import TicPrivilegelinkL from "./ticPrivilegelinkL"
import TicPrivilegediscountL from "./ticPrivilegediscountL"
import TicPrivilegecondL from "./ticPrivilegecondL"


export default function TicPrivilegeL(props) {

  const objName = "tic_privilege"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicPrivilege = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticPrivileges, setTicPrivileges] = useState([]);
  const [ticPrivilege, setTicPrivilege] = useState(emptyTicPrivilege);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [privilegeTip, setPrivilegeTip] = useState('');
  const [ticPrivilegelinkLVisible, setTicPrivilegelinkLVisible] = useState(false);
  const [ticPrivilegediscountLVisible, setTicPrivilegediscountLVisible] = useState(false);
  const [ticPrivilegecondLVisible, setTicPrivilegecondLVisible] = useState(false);
  let i = 0
  const handleCancelClick = () => {
    props.setTicPrivilegeLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticPrivilegeService = new TicPrivilegeService();
          const data = await ticPrivilegeService.getLista();
          setTicPrivileges(data);

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

    let _ticPrivileges = [...ticPrivileges];
    let _ticPrivilege = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.privilegeTip === "CREATE") {
      _ticPrivileges.push(_ticPrivilege);
    } else if (localObj.newObj.privilegeTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticPrivileges[index] = _ticPrivilege;
    } else if ((localObj.newObj.privilegeTip === "DELETE")) {
      _ticPrivileges = ticPrivileges.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicPrivilege Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicPrivilege ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.privilegeTip}`, life: 3000 });
    setTicPrivileges(_ticPrivileges);
    setTicPrivilege(emptyTicPrivilege);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticPrivileges.length; i++) {
      if (ticPrivileges[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const handleTicPrivilegelinkLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleTicPrivilegediscountLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleTicPrivilegecondLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const openNew = () => {
    setTicPrivilegeDialog(emptyTicPrivilege);
  };

  const openPrivilegelink = () => {
    setTicPrivilegelinkDialog();
  };

  const openPrivilegediscount = () => {
    setTicPrivilegediscountDialog();
  };  

  const openPrivilegecond = () => {
    setTicPrivilegecondDialog();
  }; 

  const onRowSelect = (event) => {
    //ticPrivilege.begda = event.data.begda
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
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      text: {
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

  const setTicPrivilegelinkDialog = () => {
    setShowMyComponent(true);
    setTicPrivilegelinkLVisible(true);
  } 
  
  const setTicPrivilegediscountDialog = () => {
    setShowMyComponent(true);
    setTicPrivilegediscountLVisible(true);
  } 

  const setTicPrivilegecondDialog = () => {
    setShowMyComponent(true);
    setTicPrivilegecondLVisible(true);
  } 

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].User} icon="pi pi-users"  onClick={openPrivilegelink} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Discount} icon="pi pi-percentage"  onClick={openPrivilegediscount} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Link} icon="pi pi-sitemap" onClick={openPrivilegelink} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Condition} icon="pi pi-plus" onClick={openPrivilegecond} text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].PrivilegeList}</b>
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

  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  // <--- Dialog
  const setTicPrivilegeDialog = (ticPrivilege) => {
    setVisible(true)
    setPrivilegeTip("CREATE")
    setTicPrivilege({ ...ticPrivilege });
  }
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
            setTicPrivilegeDialog(rowData)
            setPrivilegeTip("UPDATE")
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
        selection={ticPrivilege}
        loading={loading}
        value={ticPrivileges}
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
        onSelectionChange={(e) => setTicPrivilege(e.value)}
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
        <Column
          field="code"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="text"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="ctp"
          header={translations[selectedLanguage].ctp}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="ntp"
          header={translations[selectedLanguage].Type}
          sortable
          filter
          style={{ width: "35%" }}
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
        header={translations[selectedLanguage].Privilege}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicPrivilege
            parameter={"inputTextValue"}
            ticPrivilege={ticPrivilege}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            privilegeTip={privilegeTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].PrivilegelinkList}
        visible={ticPrivilegelinkLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setTicPrivilegelinkLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicPrivilegelinkL
            parameter={"inputTextValue"}
            ticPrivilege={ticPrivilege}
            handleTicPrivilegelinkLDialogClose={handleTicPrivilegelinkLDialogClose}
            setTicPrivilegelinkLVisible={setTicPrivilegelinkLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>   
      <Dialog
        header={translations[selectedLanguage].PrivilegediscountList}
        visible={ticPrivilegediscountLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setTicPrivilegediscountLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicPrivilegediscountL
            parameter={"inputTextValue"}
            ticPrivilege={ticPrivilege}
            handleTicPrivilegediscountLDialogClose={handleTicPrivilegediscountLDialogClose}
            setTicPrivilegediscountLVisible={setTicPrivilegediscountLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>    
      <Dialog
        header={translations[selectedLanguage].PrivilegecondList}
        visible={ticPrivilegecondLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setTicPrivilegecondLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicPrivilegecondL
            parameter={"inputTextValue"}
            ticPrivilege={ticPrivilege}
            handleTicPrivilegecondLDialogClose={handleTicPrivilegecondLDialogClose}
            setTicPrivilegecondLVisible={setTicPrivilegecondLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>               
    </div>
  );
}
