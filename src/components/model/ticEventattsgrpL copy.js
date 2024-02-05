import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicEventattsService } from "../../service/model/TicEventattsService";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";


export default function TicEventattsgrpL(props) {

  const objName = "tic_eventatts"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyTicEventattsgrp = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticEventattsgrps, setTicEventattsgrps] = useState([]);
  const [ticEventattsgrp, setTicEventattsgrp] = useState(emptyTicEventattsgrp);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [eventattsgrpTip, setEventattsgrpTip] = useState('');
  const [selectedAttss, setSelectedAttss] = useState(null);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const [rowClick, setRowClick] = useState(true);

  let i = 0
  const handleCancelClick = () => {
    props.setTicEventattsgrpLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticEventattsService = new TicEventattsService();
          const data = await ticEventattsService.getLista(props.ticEvent.id);
          setTicEventattsgrps(data);

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

    let _ticEventattsgrps = [...ticEventattsgrps];
    let _ticEventattsgrp = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.eventattsgrpTip === "CREATE") {
      _ticEventattsgrps.push(_ticEventattsgrp);
    } else if (localObj.newObj.eventattsgrpTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticEventattsgrps[index] = _ticEventattsgrp;
    } else if ((localObj.newObj.eventattsgrpTip === "DELETE")) {
      _ticEventattsgrps = ticEventattsgrps.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventattsgrp Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventattsgrp ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventattsgrpTip}`, life: 3000 });
    setTicEventattsgrps(_ticEventattsgrps);
    setTicEventattsgrp(emptyTicEventattsgrp);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticEventattsgrps.length; i++) {
      if (ticEventattsgrps[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const handleGetSelectedRowsClick = () => {
      console.log("Button Clicked!", selectedAttss); // Dodajte ovu liniju za isprint
      // const selectedData = products.filter((product) =>
      //   selectedProducts.includes(product.id)
      // );
      console.log(selectedAttss, "****");
      // setSelectedRowsData(selectedData);    
    setTicEventattsgrpDialog(selectedAttss);
  };

  const onRowSelect = (event) => {
    //ticEventattsgrp.begda = event.data.begda
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
          <Button label={translations[selectedLanguage].Copy} icon="pi pi-plus" severity="success" onClick={handleGetSelectedRowsClick} text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventattsgrpList}</b>
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



  // <--- Dialog
  const setTicEventattsgrpDialog = (selectedAttss) => {
    setVisible(true)
    //setEventattsgrpTip("CREATE")
    setSelectedAttss({ ...selectedAttss });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  return (
    <div className="card">
      <Toast ref={toast} />
      <div className="col-12">
        <div className="card">
          <div className="p-fluid formgrid grid">
            <div className="field col-12 md:col-6">
              <label htmlFor="code">{translations[selectedLanguage].Code}</label>
              <InputText id="code"
                value={props.ticEvent.code}
                disabled={true}
              />
            </div>
            <div className="field col-12 md:col-6">
              <label htmlFor="text">{translations[selectedLanguage].Text}</label>
              <InputText
                id="text"
                value={props.ticEvent.textx}
                disabled={true}
              />
            </div>           
          </div>
        </div>
      </div>
      <DataTable
        value={ticEventattsgrps}
        selectionMode={rowClick ? null : "checkbox"}
        selection={ticEventattsgrp}
        onSelectionChange={(e) => setTicEventattsgrp(e.value)}
        dataKey="id"
        //loading={loading}
        
        //header={header}
        //showGridlines
        //removableSort
        //filters={filters}
        //scrollable
        //scrollHeight="550px"
        //virtualScrollerOptions={{ itemSize: 46 }}
        //tableStyle={{ minWidth: "50rem" }}
        //metaKeySelection={false}
       // paginator
       // rows={50}
       // rowsPerPageOptions={[5, 10, 25, 50]}
        
        // onRowSelect={onRowSelect}
        // onRowUnselect={onRowUnselect}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          field="code"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="text"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "45%" }}
        ></Column>
        <Column
          field="note"
          header={translations[selectedLanguage].Note}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>  
      </DataTable>
      {selectedRowsData.length > 0 && (
        <div className="mt-4">
          <h5>Selected Rows Data:</h5>
          <ul>
            {selectedRowsData.map((row, index) => (
              <li key={index}>{JSON.stringify(row)}</li>
            ))}
          </ul>
        </div>
      )}
      {/* <Dialog
        header={translations[selectedLanguage].Link}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicEventattsgrp
            parameter={"inputTextValue"}
            ticEventattsgrp={ticEventattsgrp}
            ticEvent={props.ticEvent}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            eventattsgrpTip={eventattsgrpTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog> */}
    </div>
  );
}
