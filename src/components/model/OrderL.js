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
import { CoffDocService } from "../../service/model/CoffDocService";
import CoffDoc from './coffDoc';
import CoffDocsmenu from './coffDocsmenu';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function OrderL(props) {
  console.log(props, "@@@@@@+++++++++++++++++++++++ OrderL ++++++++++++++++++++++++++++++++@@@@@")
  let i = 0
  const objName = "coff_docs"

  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const currCoffOrder = localStorage.getItem('currCoffOrder')
  const docName = "coff_doc"
  const emptyCoffDoc = EmptyEntities[docName]
  const emptyCoffDocs = EmptyEntities[objName]

  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffDocss, setCoffDocss] = useState([]);
  const [coffDocs, setCoffDocs] = useState(emptyCoffDocs);

  const [coffDoc, setCoffDoc] = useState(emptyCoffDoc);

  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visibleCoffDocsmenu, setVisibleCoffDocsmenu] = useState(false);
  const [coffDocVisible, setCoffDocVisible] = useState(false);
  const [seattpTip, setDocsTip] = useState('');
  const [docTip, setDocTip] = useState('');
  const [docId, setDocId] = useState(currCoffOrder);

  const [artCurr, setArtCurr] = useState({});
  const [cenaTip, setLocTip] = useState('');

  // Setuje docId, tj. id za trenutnu porudzbinu
  useEffect(() => {
    setDocId(currCoffOrder)
  }, [currCoffOrder]);

  // Setujem stavke trenutne porudzbine
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const coffDocsService = new CoffDocsService();
          const data = await coffDocsService.getCurrCoffOrder(docId);

          setCoffDocss(data);
          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [docId, props.datarefresh]);

  // Setujem zaglavlje porudzbine
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        // if (i < 2) {
        const coffDocService = new CoffDocService();
        const data = await coffDocService.getCoffDoc(docId);
        console.log(data, "!!!!!!!!!!!!!!!!!!!!!!!!!! Setujem zaglavlje porudzbine !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", docId)
        if (data) {
          setCoffDoc(data)
        }

        // initFilters();
        // }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [docId]);

  const handleDialogClose = (newObj) => {

    const localObj = { newObj };

    if (localObj.hasOwnProperty('docTip')) {
      currCoffOrder = localStorage.getItem('currCoffOrder')
      setDocId(currCoffOrder)
    }

    let _coffDocss = [...coffDocss];
    let _coffDocs = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.seattpTip === "CREATE") {
      _coffDocss.push(_coffDocs);
    } else if (localObj.newObj.seattpTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _coffDocss[index] = _coffDocs;
    } else if ((localObj.newObj.seattpTip === "DELETE")) {
      _coffDocss = coffDocss.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDocs Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDocs ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.seattpTip}`, life: 3000 });
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

  const openDocNew = () => {
    setCoffDocDialog(emptyCoffDoc);
  };

  const openDoc = () => {
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
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].OrderList}</b>
        <div className="flex-grow-1"></div>
      </div>
    );
  };


  // <--- Dialog
  const setCoffDocsDialog = (coffDocs) => {
    console.log(coffDocs, "-------------------------------------------------setCoffDocsDialog------------------------------------------------------")
    setVisibleCoffDocsmenu(true)
    setDocsTip("CREATE")
    const _artCurr = {}
    _artCurr.category = "B-SOK"
    _artCurr.code = "3.1"
    _artCurr.id = coffDocs.art
    _artCurr.img = `assets/img/menu/${coffDocs.art}.jpg`
    _artCurr.name = coffDocs.text
    _artCurr.un = coffDocs.c_id
    setArtCurr({ ..._artCurr })
    setCoffDocs({ ...coffDocs });
  }
  const setCoffDocDialog = (coffDoc) => {
    const _coffDoc = { ...coffDoc }
    _coffDoc.doctp = "1"
    setCoffDocVisible(true)
    setDocTip("CREATE")
    setCoffDoc({ ..._coffDoc });
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
  return (
    <div className="card">
      <Toast ref={toast} />
      {/* <div className="col-12"> */}
      <div >
        <div className="p-fluid formgrid grid">
          <div className="field col-12 md:col-6">
            <label htmlFor="potpisnik">{translations[selectedLanguage].potpisnik}</label>
            <InputText id="potpisnik"
              value={coffDoc.potpisnik}
              disabled={true}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="mesto">{translations[selectedLanguage].Mesto}</label>
            <InputText
              id="mesto"
              value={coffDoc.mesto}
              disabled={true}
            />
          </div>

          <div className="field col-12 md:col-6">
            <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openDocNew} text raised />
          </div>
          <div className="field col-12 md:col-6">
            <Button label={translations[selectedLanguage].Update} icon="pi pi-cog" severity="success" onClick={openNew} text raised />
          </div>

        </div>
      </div>
      {/* </div> */}
      <DataTable
        id="OrderL"
        dataKey="id"
        selectionMode="single"
        selection={coffDocs}
        loading={loading}
        value={coffDocss}
        // header={header}
        showGridlines
        // removableSort
        // filters={filters}
        scrollable
        scrollHeight="650px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={50}
        rowsPerPageOptions={[50, 100, 250, 500]}
        onSelectionChange={(e) => setCoffDocs(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={actionTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ width: "2%" }}
        // style={{ minWidth: '4rem' }}
        />
        <Column
          field="text"
          header={translations[selectedLanguage].Text}
          // sortable
          // filter
          style={{ width: "20%" }}
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
          style={{ width: "5%" }}
        ></Column>
        <Column
          field="xxx"
          header={translations[selectedLanguage].xxx}
          // sortable
          // filter
          style={{ width: "60%" }}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Doc}
        visible={coffDocVisible}
        style={{ width: '50%' }}
        onHide={() => {
          setCoffDocVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffDoc
            parameter={"inputTextValue"}
            coffDoc={coffDoc}
            handleDialogClose={handleDialogClose}
            setCoffDocVisible={setCoffDocVisible}
            dialog={true}
            docTip={docTip}
            stVisible={false}
          />
        )}
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].Stavka}
        visible={visibleCoffDocsmenu}
        style={{ width: '40%' }}
        onHide={() => {
          setVisibleCoffDocsmenu(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffDocsmenu
            parameter={"inputTextValue"}
            artCurr={artCurr}
            coffDocs={coffDocs}
            onDataUpdate={handleDataUpdate}
            handleDialogClose={handleDialogClose}
            setVisibleCoffDocsmenu={setVisibleCoffDocsmenu}
            dialog={true}
            cenaTip={cenaTip}
            docId={docId}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      {/* <Dialog
        header={translations[selectedLanguage].Docs}
        visible={visibleCoffDocsmenu}
        style={{ width: '50%' }}
        onHide={() => {
          setVisibleCoffDocsmenu(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffDoc
            parameter={"inputTextValue"}
            coffDocs={coffDocs}
            artCurr={artCurr}
            handleDialogClose={handleDialogClose}
            setVisibleCoffDocsmenu={setVisibleCoffDocsmenu}
            dialog={true}
            seattpTip={seattpTip}
          />
        )}
      </Dialog> */}
    </div>
  );
}
