import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicDocpaymentService } from "../../service/model/TicDocpaymentService";
import TicDocpayment from './ticDocpayment';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";


export default function TicDocpaymentL(props) {

  const objName = "tic_docpayment"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyTicDocpayment = EmptyEntities[objName]
  emptyTicDocpayment.doc = props.ticDoc.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticDocpayments, setTicDocpayments] = useState([]);
  const [ticDocpayment, setTicDocpayment] = useState(emptyTicDocpayment);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [docpaymentTip, setDocpaymentTip] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setTicPaymentLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticDocpaymentService = new TicDocpaymentService();
          const data = await ticDocpaymentService.getLista(props.ticDoc.id);
          setTicDocpayments(data);

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

    let _ticDocpayments = [...ticDocpayments];
    let _ticDocpayment = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.docpaymentTip === "CREATE") {
      _ticDocpayments.push(_ticDocpayment);
    } else if (localObj.newObj.docpaymentTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticDocpayments[index] = _ticDocpayment;
    } else if ((localObj.newObj.docpaymentTip === "DELETE")) {
      _ticDocpayments = ticDocpayments.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocpayment Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocpayment ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docpaymentTip}`, life: 3000 });
    setTicDocpayments(_ticDocpayments);
    setTicDocpayment(emptyTicDocpayment);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticDocpayments.length; i++) {
      if (ticDocpayments[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicDocpaymentDialog(emptyTicDocpayment);
  };

  const onRowSelect = (event) => {
    //ticDocpayment.begda = event.data.begda
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
        <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].DocpaymentList}</b>
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
  const setTicDocpaymentDialog = (ticDocpayment) => {
    setVisible(true)
    setDocpaymentTip("CREATE")
    setTicDocpayment({ ...ticDocpayment });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const docpaymentTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicDocpaymentDialog(rowData)
            setDocpaymentTip("UPDATE")
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
              <label htmlFor="code">{translations[selectedLanguage].Transaction}</label>
              <InputText id="code"
                value={props.ticDoc.id}
                disabled={true}
              />
            </div>
            {/* <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.ticDoc.textx}
                disabled={true}
              />
            </div>            */}
          </div>
        </div>
      </div>
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={ticDocpayment}
        loading={loading}
        value={ticDocpayments}
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
        onSelectionChange={(e) => setTicDocpayment(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={docpaymentTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cpaymenttp"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="npaymenttp"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "45%" }}
        ></Column>
        <Column
          field="amount"
          header={translations[selectedLanguage].Amount}
          sortable
          filter
          style={{ width: "20%" }}
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
          <TicDocpayment
            parameter={"inputTextValue"}
            ticDocpayment={ticDocpayment}
            ticDoc={props.ticDoc}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            docpaymentTip={docpaymentTip}
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
