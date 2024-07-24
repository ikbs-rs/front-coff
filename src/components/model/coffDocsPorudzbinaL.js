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
import { CoffDocsService } from "../../service/model/CoffDocsService";
import CoffDocsPorudzbinaD from './coffDocsPorudzbinaD';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import env from '../../configs/env';

export default function CoffDocsPorudzbinaL(props) {
  console.log(props, "BMVBMVBMV@@@@@@@@@@@@@@@@@@@@@@@@@ CoffDocsL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@!!!!!@")
  let i = 0
  const objName = "coff_doc"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCoffDocs = EmptyEntities[objName]
  emptyCoffDocs.doctp = props.doctp
  emptyCoffDocs.doc = props.coffDoc.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffDocss, setCoffDocss] = useState([]);
  const [coffDocs, setCoffDocs] = useState(emptyCoffDocs);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [coffDocsVisible, setCoffDocsVisible] = useState(false);
  const [docsTip, setDocsTip] = useState('');
  const [artCurr, setArtCurr] = useState({});
  const [cenaTip, setLocTip] = useState('');
  const [visibleCoffDocsmenu, setVisibleCoffDocsmenu] = useState(false);
  const [visible, setVisible] = useState(false);

  const generateImageUrl = (id) => {
  
    return `assets/img/menu/${id}.jpg`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const coffDocsService = new CoffDocsService();
          const data = await coffDocsService.getCurrCoffOrder(props.coffDoc.id);
          const updatedData = data.map((obj) => {
            return {
                ...obj,
                imageUrl: generateImageUrl(obj.art)
            };
        });
          console.log(data, "##########################getCurrCoffOrder###########################")
          setCoffDocss(updatedData);
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


    let _coffDocss = [...coffDocss];
    let _coffDocs = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.docsTip === "CREATE") {
      _coffDocss.push(_coffDocs);
    } else if (localObj.newObj.docsTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _coffDocss[index] = _coffDocs;
    } else if ((localObj.newObj.docsTip === "DELETE")) {
      _coffDocss = coffDocss.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDocs Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDocs ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docsTip}`, life: 3000 });
    setCoffDocss(_coffDocss);
    setCoffDocs(emptyCoffDocs);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < coffDocss.length; i++) {
      if (coffDocss[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCoffDocsDialog(emptyCoffDocs);
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
        <div className="flex-grow-1" />
        <b>{translations[selectedLanguage].DocsList}</b>
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
    const valid = rowData.valid == 1 ? true : false
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
  const setCoffDocsDialog = (coffDocs) => {
    const _artCurr = {}
    _artCurr.category = "B-SOK"
    _artCurr.code = "3.1"
    _artCurr.id = coffDocs.art
    _artCurr.img = `assets/img/menu/${coffDocs.art}.jpg`
    _artCurr.name = coffDocs.text
    _artCurr.un = coffDocs.c_id
    setArtCurr({ ..._artCurr })
    setVisibleCoffDocsmenu(true)
    setVisible(true)
    setDocsTip("CREATE")
    setCoffDocs({ ...coffDocs });
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
            setCoffDocsDialog(rowData)
            setDocsTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  const handleDataUpdate = (updatedTab) => {
    props.onDataUpdate(updatedTab);
    // setDataTab(updatedTab);
  };

  const imageBodyTemplate = (rowData) => {
    console.log(rowData, "****************************************************************************************************************")
    return <img src={rowData.imageUrl}  className="w-6rem shadow-2 border-round" />;
  };
  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        id="coffDocsL"
        dataKey="id"
        selectionMode="single"
        selection={coffDocs}
        loading={loading}
        value={coffDocss}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="code"
        sortOrder={1}
        scrollHeight="350px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setCoffDocs(e.value)}
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
          field="nart"
          header={translations[selectedLanguage].Text}
          // sortable
          // filter
          style={{ width: "50%" }}
        ></Column>
        <Column
          field="num"
          header={translations[selectedLanguage].num}
          // sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="izlaz"
          header={translations[selectedLanguage].Kol}
          // sortable
          // filter
          style={{ width: "10%" }}
        ></Column>
        <Column body={imageBodyTemplate} header={translations[selectedLanguage].Image} style={{ width: '10%' }}></Column>

      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Stavka}
        visible={visibleCoffDocsmenu}
        style={{ width: '40%' }}
        onHide={() => {
          setVisible = { setVisible }
          setVisibleCoffDocsmenu = { setVisibleCoffDocsmenu }
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffDocsPorudzbinaD
            parameter={"inputTextValue"}
            artCurr={artCurr}
            coffDocs={coffDocs}
            coffDoc={props.coffDoc}
            doctp={props.doctp}
            onDataUpdate={handleDataUpdate}
            handleDialogClose={handleDialogClose}
            setVisibleCoffDocsmenu={setVisibleCoffDocsmenu}
            dialog={true}
            cenaTip={cenaTip}
            docsTip={docsTip}
            setVisible={setVisible}
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
