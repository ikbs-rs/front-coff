import React, { useState, useEffect, useRef } from "react";
import { useParams } from 'react-router-dom';
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CmnLocService } from "../../../service/model/cmn/CmnLocService";
import { CmnLoctpService } from "../../../service/model/cmn/CmnLoctpService";
import CmnLoc from './cmnLoc';
import { EmptyEntities } from '../../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../../configs/translations";
import DateFunction from "../../../utilities/DateFunction";
import CmnLocartL from "./cmnLocartL"
import CmnTerrlocL from "./cmnTerrlocL"
import CmnLoclinkL from "./cmnLoclinkL"


export default function CmnLocL(props) {
  const { loctpId: propsLocTpId } = props;
  const { loctpId: routeLocTpId } = useParams();
  const loctpCode = propsLocTpId || routeLocTpId;
  const LOCATION_CODE = "-1"
  const objName = "cmn_loc"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCmnLoc = EmptyEntities[objName]
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [cmnLocs, setCmnLocs] = useState([]);
  const [cmnLoc, setCmnLoc] = useState(emptyCmnLoc);
  const [cmnLoctpId, setCmnLoctpId] = useState(null);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [locTip, setLocTip] = useState('');
  const [cmnLocartLVisible, setCmnLocartLVisible] = useState(false);
  const [cmnLoclinkLVisible, setCmnLoclinkLVisible] = useState(false);

  const [cmnTerrlocLVisible, setCmnTerrlocLVisible] = useState(false);

  let i = 0
  const handleCancelClick = () => {
    props.setCmnLocLVisible(false);
  };

  const handleConfirmClick = () => {
    if (cmnLoc) {
      props.onTaskComplete(cmnLoc);
    } else {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No row selected', life: 3000 });
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const cmnLocService = new CmnLocService();
          const data = await cmnLocService.getListaLL(loctpCode);
          setCmnLocs(data);

          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const cmnLoctpService = new CmnLoctpService();
        const data = await cmnLoctpService.getIdByItem(loctpCode);
        console.log(data, "**********CmnLoctpService************")
        setCmnLoctpId(data.id);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _cmnLocs = [...cmnLocs];
    let _cmnLoc = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.locTip === "CREATE") {
      _cmnLocs.push(_cmnLoc);
    } else if (localObj.newObj.locTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _cmnLocs[index] = _cmnLoc;
    } else if ((localObj.newObj.locTip === "DELETE")) {
      _cmnLocs = cmnLocs.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoc Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CmnLoc ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.locTip}`, life: 3000 });
    setCmnLocs(_cmnLocs);
    setCmnLoc(emptyCmnLoc);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < cmnLocs.length; i++) {
      if (cmnLocs[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const handleCmnLocartLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleCmnTerrlocLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const handleCmnLoclinkLDialogClose = (newObj) => {
    const localObj = { newObj };
  };

  const openNew = () => {
    setCmnLocDialog(emptyCmnLoc);
  };

  const openLocart = () => {
    setCmnLocartDialog();
  };

  const openTerrloc = () => {
    setCmnTerrlocDialog();
  };

  const openLocLink = () => {
    setCmnLoclinkLDialog();
  };

  const onRowSelect = (event) => {
    //cmnLoc.begda = event.data.begda
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

  const setCmnLocartDialog = () => {
    setShowMyComponent(true);
    setCmnLocartLVisible(true);

  }

  const setCmnTerrlocDialog = () => {
    setShowMyComponent(true);
    setCmnTerrlocLVisible(true);

  }

  const setCmnLoclinkLDialog = () => {
    setShowMyComponent(true);
    setCmnLoclinkLVisible(true);

  }

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" />
        {(props.dialog) ? (
          <>
            <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />
            <div className="flex flex-wrap gap-1" />
            <Button label={translations[selectedLanguage].Confirm} icon="pi pi-times" onClick={handleConfirmClick} text raised disabled={!cmnLoc} />
          </>
        ) : null}
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Links} icon="pi pi-sitemap" onClick={openLocLink} text raised disabled={!cmnLoc} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].art} icon="pi pi-shield" onClick={openLocart} text raised disabled={!cmnLoc} />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Terr} icon="pi pi-building" onClick={openTerrloc} text raised disabled={!cmnLoc} />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].LocationList}</b>
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

  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  // <--- Dialog
  const setCmnLocDialog = (cmnLoc) => {
    setShowMyComponent(true)
    setVisible(true)
    setLocTip("CREATE")
    setCmnLoctpId(cmnLoctpId)
    setCmnLoc({ ...cmnLoc, cmnLoctpId, loctpCode });
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
            setCmnLocDialog(rowData)
            setLocTip("UPDATE")
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
        selection={cmnLoc}
        loading={loading}
        value={cmnLocs}
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
        rows={50}
        rowsPerPageOptions={[10, 25, 50, 100]}
        onSelectionChange={(e) => setCmnLoc(e.value)}
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
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "15%" }}
        ></Column>
        <Column
          field="ntp"
          header={translations[selectedLanguage].Text}
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
        header={translations[selectedLanguage].Location}
        visible={visible}
        style={{ width: '95%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLoc
            parameter={"inputTextValue"}
            cmnLoctpId={cmnLoctpId}
            loctpCode={loctpCode}
            cmnLoc={cmnLoc}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            locTip={locTip}

          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].LocartList}
        visible={cmnLocartLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setCmnLocartLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLocartL
            parameter={"inputTextValue"}
            cmnLoc={cmnLoc}
            handleCmnLocartLDialogClose={handleCmnLocartLDialogClose}
            setCmnLocartLVisible={setCmnLocartLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].LoclinkList}
        visible={cmnLoclinkLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setCmnLoclinkLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnLoclinkL
            parameter={"inputTextValue"}
            cmnLoc={cmnLoc}
            handleCmnLoclinkLDialogClose={handleCmnLoclinkLDialogClose}
            setCmnLoclinkLVisible={setCmnLoclinkLVisible}
            dialog={true}
            loctpCode={LOCATION_CODE}
            cmnLoctpId={null}
            lookUp={false}
          />
        )}
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].LocterrList}
        visible={cmnTerrlocLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setCmnLocartLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CmnTerrlocL
            parameter={"inputTextValue"}
            cmnLoc={cmnLoc}
            handleCmnTerrlocLDialogClose={handleCmnTerrlocLDialogClose}
            setCmnTerrlocLVisible={setCmnTerrlocLVisible}
            dialog={true}
            lookUp={false}
          />
        )}
      </Dialog>
    </div>
  );
}
