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
import { CoffDocService } from "../../service/model/CoffDocService";

import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";
import { useWebSocket } from '../../utilities/WebSocketContext';
import CoffDocPorudzbina from "./coffDocPorudzbina";

export default function CoffDocPorudzbineL(props) {
  console.log(props, "@@@@@@@@@@@@@@@@@@@@@@@@@@ CoffDocPorudzbinaL @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
  let i = 0
  const objName = "coff_doc"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCoffDoc = EmptyEntities[objName]
  emptyCoffDoc.doctp = props.doctp
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffDocs, setCoffDocs] = useState([]);
  const [coffDoc, setCoffDoc] = useState(emptyCoffDoc);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [coffDocVisible, setCoffDocVisible] = useState(false);
  const [docTip, setDocTip] = useState('');
  const [ndoctp, setNdoctp] = useState('');
  const websocket = useWebSocket();
  let [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const coffDocService = new CoffDocService();
          const data = await coffDocService.getCoffDocsPorudzbinaTp(props.doctp);
          console.log(data, "@@@@@@@@@@@@@@@@@@@@@@@@@@ getCoffDocsTp @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", props.doctp)
          if (data) {
            const data0 = data[0]
            setNdoctp(data0.ndoctp)
          }

          setCoffDocs(data);
          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.datarefresh, refresh]);

  useEffect(() => {
    if (websocket) {
      websocket.addEventListener('message', (message) => {
        const obj = JSON.parse(message.data)
        if (obj.data[0].id == 'TRECA') {
          setRefresh(++refresh)
        }
      });
    }
  }, [websocket]);

  const handleDialogClose = (newObj) => {
    console.log(newObj, "%%%%%%%%%%###%%%%%%%%%%%%%%%%%%%%%%%%%%######%%%%%%%%%%%%%%%%%%%%%%%####%%%%%%%%%%%%%%%")
    const localObj = { newObj };

    let _coffDocs = [...coffDocs];
    let _coffDoc = { ...localObj.newObj.obj };

    //setSubmitted(true);
    if (localObj.newObj.docTip === "CREATE") {
      _coffDocs.push(_coffDoc);
    } else if (localObj.newObj.docTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _coffDocs[index] = _coffDoc;
    } else if ((localObj.newObj.docTip === "DELETE")) {
      _coffDocs = coffDocs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDoc Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDoc ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docTip}`, life: 3000 });
    setCoffDocs(_coffDocs);
    setCoffDoc(emptyCoffDoc);
    setRefresh(++refresh)
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send('{"data":[{"id":"TRECA"}]}');
    }
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < coffDocs.length; i++) {
      if (coffDocs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCoffDocDialog(emptyCoffDoc);
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
  const setCoffDocDialog = (coffDoc) => {
    setCoffDoc({ ...coffDoc });
    setCoffDocVisible(true)
    setDocTip("CREATE")

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
            setCoffDocDialog(rowData)
            setDocTip("UPDATE")
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
      <DataTable
        id="coffDocL"
        dataKey="id"
        selectionMode="single"
        size={"small"}
        selection={coffDoc}
        loading={loading}
        value={coffDocs}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        sortField="vreme"
        defaultSortOrder={-1}
        scrollHeight="750px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={50}
        rowsPerPageOptions={[50, 100, 250, 500]}
        onSelectionChange={(e) => setCoffDoc(e.value)}
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
          field="ndoctp"
          header={translations[selectedLanguage].ndoctp}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="mesto"
          header={translations[selectedLanguage].Mestoporudzbina}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="nzap"
          header={translations[selectedLanguage].potpisnik}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="vreme"
          header={translations[selectedLanguage].Vreme}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        {/* <Column
          field="status"
          header={translations[selectedLanguage].status}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>                     */}
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Docs}
        visible={coffDocVisible}
        style={{ width: '70%' }}
        onHide={() => {
          setCoffDocVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffDocPorudzbina
            parameter={"inputTextValue"}
            coffDoc={coffDoc}
            handleDialogClose={handleDialogClose}
            setCoffDocVisible={setCoffDocVisible}
            dialog={true}
            docTip={docTip}
            doctp={props.doctp}
            stVisible={true}
            standard={true}
            ndoctp={ndoctp}
          />
        )}
      </Dialog>
    </div>
  );
}
