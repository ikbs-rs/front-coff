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
import CoffDocOrder from './coffDocOrder';
import CoffDocsmenu from './coffDocsmenu';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import { buildOrderChangedMessage, useWebSocket } from '../../utilities/WebSocketContext';

const normalizeOrderId = (value) => {
  if (value === null || value === undefined) {
    return "-1";
  }

  const normalizedValue = String(value).trim();
  return normalizedValue === "" ? "-1" : normalizedValue;
};

const isValidOrderId = (value) => normalizeOrderId(value) !== "-1";

export default function OrderL(props) {
  // console.log(props, "@@@@@@+++++++++++++++++++++++ OrderL ++++++++++++++++++++++++++++++++@@@@@")
  let i = 0
  let k = 0
  const objName = "coff_docs"

  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const [currCoffOrder, setCurrCoffOrder] = useState(() => normalizeOrderId(localStorage.getItem('currCoffOrder')))
  const docName = "coff_doc"
  const emptyCoffDoc = EmptyEntities[docName]
  const emptyCoffDocs = EmptyEntities[objName]

  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffDocss, setCoffDocss] = useState([]);
  const [coffDocs, setCoffDocs] = useState(emptyCoffDocs);

  const [coffDoc, setCoffDoc] = useState(emptyCoffDoc);
  const [coffDocI, setCoffDocI] = useState(emptyCoffDoc);

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
  let [refresh, seRefresh] = useState(props.datarefresh);
  const websocket = useWebSocket();
  const bumpRefresh = () => {
    seRefresh((prev) => (Number(prev) || 0) + 1);
  };

  // Setuje docId, tj. id za trenutnu porudzbinu
  useEffect(() => {
    setDocId(currCoffOrder)
  }, [currCoffOrder]);

  // Setujem stavke trenutne porudzbine
  useEffect(() => {
    async function fetchData() {
      try {
        const coffDocsService = new CoffDocsService();
        const effectiveDocId = isValidOrderId(currCoffOrder) ? normalizeOrderId(currCoffOrder) : normalizeOrderId(docId);
        console.log("Effective Doc ID:", effectiveDocId);
        const data = await coffDocsService.getCurrCoffOrder(effectiveDocId);
        console.log("Fetched CoffDocs:", data);
        setCoffDocss(data);
        initFilters();
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [currCoffOrder, docId, refresh, props.datarefresh]);

  // Setujem zaglavlje porudzbine
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        // if (i < 2) {
        const coffDocService = new CoffDocService();
        const data = await coffDocService.getCoffDoc(docId);
        console.log("***************** Fetched CoffDoc:", data);
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
  }, [docId, refresh, props.datarefresh]);

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };
    console.log("Dialog closed with newObj ++++++++++++++++++++++++:", newObj);

    if (newObj.docId !== null && newObj.docId !== undefined && String(newObj.docId).trim() !== "") {
      const nextDocId = normalizeOrderId(newObj.docId);
      localStorage.setItem('currCoffOrder', nextDocId);
      setCurrCoffOrder(nextDocId)
      setDocId(nextDocId)
      setCoffDoc({ ...newObj.obj })
      bumpRefresh()
    }

    let _coffDocss = [...coffDocss];
    let _coffDocs = { ...localObj.newObj.obj };
    const actionType = localObj.newObj.seattpTip ?? localObj.newObj.docTip;

    //setSubmitted(true);
    if (actionType === "CREATE") {
      _coffDocss.push(_coffDocs);
      setCoffDoc({ ...localObj.newObj.obj })
      bumpRefresh()
    } else if (actionType === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      if (index >= 0) {
        _coffDocss[index] = _coffDocs;
      }
      if(newObj?.docC=='Z') {
        setCoffDoc(newObj.obj)
      }
    } else if ((actionType === "DELETE")) {
      _coffDocss = coffDocss.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDocs Delete', life: 500 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDocs ?', life: 500 });
    }
    // toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.seattpTip}`, life: 3000 });
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
    setCoffDocDialog(emptyCoffDoc, "CREATE");
  };

  const openDoc = () => {
    setCoffDocDialog(coffDoc, "UPDATE");
  };


  const handleZavrsi = async () => {
    setCoffDocZavrsi(coffDoc, "UPDATE");
    const _coffDoc = { ... coffDoc}
    _coffDoc.status = 1
    const coffDocService = new CoffDocService();
    const data = await coffDocService.putCoffDoc(_coffDoc);   
    setCoffDoc(_coffDoc)
    localStorage.setItem('currCoffOrder', "-1");
    // console.log("##############################################################")
    bumpRefresh()
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(buildOrderChangedMessage({
        source: 'OrderL.handleZavrsi',
        docId: _coffDoc?.id ?? coffDoc?.id ?? null,
        status: '1',
        objId: _coffDoc?.obj ?? _coffDoc?.coff ?? coffDoc?.obj ?? coffDoc?.coff ?? null,
        userId: _coffDoc?.usr ?? coffDoc?.usr ?? null,
        notify: true
      }));
    }
    props.handleRefreshTab()
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
    // console.log(coffDocs, "-------------------------------------------------setCoffDocsDialog------------------------------------------------------")
    setShowMyComponent(true)
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
  const setCoffDocDialog = (coffDoc, docTip) => {
    const _coffDoc = { ...coffDoc }
    _coffDoc.doctp = "1"
    _coffDoc.obj = null
    setShowMyComponent(true)
    setCoffDocVisible(true)
    setDocTip(docTip)
    setCoffDocI({ ..._coffDoc });
  }
  const setCoffDocZavrsi = (coffDoc, docTip) => {
    setCoffDoc({ ...emptyCoffDoc });
    setCoffDocs({ ...emptyCoffDocs });

    setCurrCoffOrder("-1")
    bumpRefresh()
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
    <div className="card glass-card glass-form model-grid-page model-grid-page-order">
      <Toast ref={toast} />
      {/* <div className="col-12"> */}
      <div >
        <div className="p-fluid formgrid grid">
          <div className="field col-12 md:col-6">
            <label htmlFor="potpisnik">{translations[selectedLanguage].potpisnik}</label>
            <InputText id="nzap"
              value={coffDoc.nzap1}
              disabled={true}
            />
          </div>
          <div className="field col-12 md:col-6">
            <label htmlFor="mesto">{translations[selectedLanguage].Loc}</label>
            <InputText
              id="mesto"
              value={coffDoc.mesto}
              disabled={true}
            />
          </div>
        </div>
        <div className="p-fluid formgrid grid">
          <div className="field col-12 md:col-4">
            <Button label={translations[selectedLanguage].NewPor} 
            // icon="pi pi-plus" 
            severity="warning" onClick={openDocNew} raised />
          </div>
          <div className="field col-12 md:col-4">
            <Button label={translations[selectedLanguage].UpdPor} 
            // icon="pi pi-cog" 
            severity="warning" onClick={openDoc} raised />
          </div>
          <div className="field col-12 md:col-4">
            <Button label={translations[selectedLanguage].EndPor} 
            // icon="pi pi-check" 
            severity="danger" onClick={handleZavrsi} raised />
          </div>

        </div>
      </div>
      {/* </div> */}
      <div className="glass-table-shell">
        <DataTable
          className="glass-datatable order-grid-table"
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
          scrollHeight="flex"
          virtualScrollerOptions={{ itemSize: 46 }}
          tableStyle={{ minWidth: "34rem", width: "max-content", tableLayout: "auto" }}
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
            style={{ width: "3rem", minWidth: "3rem" }}
          // style={{ minWidth: '4rem' }}
          />
          <Column
            field="text"
            header={translations[selectedLanguage].Text}
            // sortable
            // filter
            style={{ minWidth: "11rem" }}
          ></Column>
          <Column
            field="num"
            header={translations[selectedLanguage].um}
            // sortable
            // filter
            style={{ minWidth: "4.5rem" }}
          ></Column>
          <Column
            field="izlaz"
            header={translations[selectedLanguage].Kol}
            // sortable
            // filter
            style={{ minWidth: "4rem" }}
          ></Column>
        </DataTable>
      </div>
      <Dialog
        header={translations[selectedLanguage].Porudzbina}
        visible={coffDocVisible}
        style={{ width: '50%' }}
        onHide={() => {
          setCoffDocVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffDocOrder
            parameter={"inputTextValue"}
            coffDoc={coffDocI}
            handleDialogClose={handleDialogClose}
            setCoffDocVisible={setCoffDocVisible}
            dialog={true}
            docTip={docTip}
            stVisible={false}
            standard={false}
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
