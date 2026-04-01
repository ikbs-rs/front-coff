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
import CoffDoc from './coffDoc';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import { translations } from "../../configs/translations";

export default function CoffDocL(props) {
  console.log(props, "============================ CoffDocL ============================")
  let i = 0
  const objName = "coff_doc"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const resolvedDocLabel = props.docLabel || ''
  const createEmptyCoffDoc = () => ({
    ...EmptyEntities[objName],
    doctp: props.doctp
  });
  const emptyCoffDoc = createEmptyCoffDoc();
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

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i<2) {  
        const coffDocService = new CoffDocService();
        const data = await coffDocService.getCoffDocsTp(props.doctp);
        // console.log(data, "@@@@@@@@@@@@@@@@@@@@@@@@@@ getCoffDocsTp @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", props.doctp)
        const normalizedDocs = Array.isArray(data) ? data : data ? [data] : [];
        if (normalizedDocs.length > 0) {
          const data0 = normalizedDocs[0]
          setNdoctp(resolvedDocLabel || data0?.ndoctp || '')
        } else {
          setNdoctp(resolvedDocLabel || '')
        }

        const normalizedDocsWithLabel = normalizedDocs.map((item) => ({
          ...item,
          ndoctp: resolvedDocLabel || item.ndoctp
        }));

        setCoffDocs(normalizedDocsWithLabel);
        initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.datarefresh, props.doctp, resolvedDocLabel]);

	  const handleDialogClose = (newObj) => {
	    console.log(newObj, "%%%%%%%%%%###%%%%%%%%%%%%%%%%%%%%%%%%%%######%%%%%%%%%%%%%%%%%%%%%%%####%%%%%%%%%%%%%%%")
	    const localObj = { newObj };
	    const keepDialogOpen = Boolean(localObj.newObj.stayOpen);
	    const nextDocTip = localObj.newObj.nextDocTip || (localObj.newObj.docTip === "CREATE" ? "UPDATE" : localObj.newObj.docTip);

	    let _coffDocs = [...coffDocs];
	    let _coffDoc = { ...localObj.newObj.obj };

	    //setSubmitted(true);
	    if (localObj.newObj.docTip === "CREATE") {
	      _coffDocs.push(_coffDoc);
	    } else if (localObj.newObj.docTip === "UPDATE") {
	      const index = findIndexById(localObj.newObj.obj.id);
	      if (index >= 0) {
	        _coffDocs[index] = _coffDoc;
	      } else {
	        _coffDocs.push(_coffDoc);
	      }
	    } else if ((localObj.newObj.docTip === "DELETE")) {
	      _coffDocs = coffDocs.filter((val) => val.id !== localObj.newObj.obj.id);
	      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDoc Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffDoc ?', life: 3000 });
	    }
		    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docTip}`, life: 3000 });
		    setCoffDocs(_coffDocs);
		    if (keepDialogOpen) {
		      setShowMyComponent(true);
		      setCoffDoc({ ..._coffDoc });
	      setDocTip(nextDocTip);
		      setCoffDocVisible(true);
		      return;
		    }
		    setCoffDoc(createEmptyCoffDoc());
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
	    setCoffDocDialog(createEmptyCoffDoc());
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
        {/* <b>{translations[selectedLanguage].DocsList}</b> */}
	        <b>{resolvedDocLabel || ndoctp || translations[selectedLanguage].DocsList}</b>
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

  // <--- Dialog
	  const setCoffDocDialog = (coffDoc) => {
	    setShowMyComponent(true)
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
    <div className="card model-grid-page model-grid-page-docs">
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
        sortField="vreme" defaultSortOrder={-1}       
        scrollHeight="flex"
        //virtualScrollerOptions={{ itemSize: 46 }}
        //tableStyle={{ minWidth: "50rem" }}
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
          field="nzap1"
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
        // header={translations[selectedLanguage].Docs}
        header={resolvedDocLabel || ndoctp || translations[selectedLanguage].Docs}
        visible={coffDocVisible}
        className="doc-entry-dialog"
        style={{ width: '70%', height: '90vh' }}
        contentStyle={{ height: 'calc(90vh - 5rem)', overflow: 'hidden' }}
        onHide={() => {
          setCoffDocVisible(false);
          setShowMyComponent(false);
        }}
      >
	        {showMyComponent && (
	          <CoffDoc
	            key={`${docTip}-${coffDoc?.id ?? 'new'}`}
	            parameter={"inputTextValue"}
	            coffDoc={coffDoc}
	            handleDialogClose={handleDialogClose}
            setCoffDocVisible={setCoffDocVisible}
            dialog={true}
            docTip={docTip}
            doctp={props.doctp}
            // label={props.docLabel}
            stVisible={true}
            standard={true}
            ndoctp={resolvedDocLabel || ndoctp}
          />
        )}
      </Dialog>
    </div>
  );
}
