import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicDocdeliveryService } from "../../service/model/TicDocdeliveryService";
import TicDocdelivery from './ticDocdelivery';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function TicDocdeliveryL(props) {

  const objName = "tic_docdelivery"
  const objPar = "cmn_par"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicDocdelivery = EmptyEntities[objName]
  const emptyPar = EmptyEntities[objPar]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticDocdeliverys, setTicDocdeliverys] = useState([]);
  const [ticDocdelivery, setTicDocdelivery] = useState(emptyTicDocdelivery);
  const [cmnPar, setCmnPar] = useState(emptyPar);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [docdeliveryTip, setDocdeliveryTip] = useState('');
  const [ticDocdeliveryVisible, setTicDocdeliveryVisible] = useState(false);
  let i = 0
  
  const handleCancelClick = () => {
    props.setTicPaymentLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticDocdeliveryService = new TicDocdeliveryService();
          const data = await ticDocdeliveryService.getLista();
          setTicDocdeliverys(data);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const rowClass = (rowData) => {
    const tableRow = document.querySelectorAll('.p-datatable-tbody');
    tableRow.forEach((row) => {
      row.classList.remove('p-datatable-tbody');
    });
    const selRow = document.querySelectorAll('.p-selectable-row');
    selRow.forEach((row) => {
      //console.log("*-*-*************row.row.classList*************-*", row.classList)
      row.classList.remove('p-selectable-row');
    });

    //console.log(rowData.docvr == '1683550594276921344', "****************rowData************************", rowData)
    return rowData.doc == '1683550594276921344'
      ? 'highlight-row-blue'
      : rowData.docvr == '1683550132932841472'
        ? 'highlight-row-green'
        : '';
  };

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _ticDocdeliverys = [...ticDocdeliverys];
    let _ticDocdelivery = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.docdeliveryTip === "CREATE") {
      _ticDocdeliverys.push(_ticDocdelivery);
    } else if (localObj.newObj.docdeliveryTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticDocdeliverys[index] = _ticDocdelivery;
    } else if ((localObj.newObj.docdeliveryTip === "DELETE")) {
      _ticDocdeliverys = ticDocdeliverys.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocdelivery Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocdelivery ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docdeliveryTip}`, life: 3000 });
    setTicDocdeliverys(_ticDocdeliverys);
    setTicDocdelivery(emptyTicDocdelivery);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticDocdeliverys.length; i++) {
      if (ticDocdeliverys[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicDocdeliveryDialog(emptyTicDocdelivery);
  };

  const onRowSelect = (event) => {
    //ticDocdelivery.begda = event.data.begda
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
      ocode: {
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
        {/* <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div> */}
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].DocdeliveryList}</b>
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
  const setTicDocdeliveryDialog = (ticDocdelivery) => {
    setVisible(true)
    setDocdeliveryTip("CREATE")
    setTicDocdelivery({ ...ticDocdelivery });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const docdeliveryTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicDocdeliveryDialog(rowData)
            setDocdeliveryTip("UPDATE")
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
        rowClassName={rowClass}
        selectionMode="single"
        selection={ticDocdelivery}
        loading={loading}
        value={ticDocdeliverys}
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
        onSelectionChange={(e) => setTicDocdelivery(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={docdeliveryTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="doc"
          header={translations[selectedLanguage].Transaction}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="cpar"
          header={translations[selectedLanguage].cpar}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="npar"
          header={translations[selectedLanguage].npar}
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="adress"
          header={translations[selectedLanguage].adress}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="dat"
          header={translations[selectedLanguage].dat}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="potrazuje"
          header={translations[selectedLanguage].potrazuje}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="ncourier"
          header={translations[selectedLanguage].ncourier}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="parent"
          header={translations[selectedLanguage].parent}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Payment}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicDocdelivery
            parameter={"inputTextValue"}
            ticDocdelivery={ticDocdelivery}
            ticDoc={props.ticDoc}
            cmnPar={cmnPar}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            setTicDocdeliveryVisible={setTicDocdeliveryVisible}
            dialog={true}
            docdeliveryTip={docdeliveryTip}
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
