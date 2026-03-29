import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { CoffZaplinkService } from "../../service/model/CoffZaplinkService";
import CoffZaplink from "./coffZaplink";
import { EmptyEntities } from "../../service/model/EmptyEntities";
import { Dialog } from "primereact/dialog";
import "./index.css";
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";

export default function CoffZaplinkL(props) {
  const objName = "coff_zaplink";
  const selectedLanguage = localStorage.getItem("sl") || "en";
  const [ownerZap, setOwnerZap] = useState(props.coffZap || props.userZap || null);
  const selectedZapKey = ownerZap?.zap || ownerZap?.ZAP || props.user?.sapuser || null;
  const selectedZapCode = ownerZap?.zap || ownerZap?.ZAP || props.user?.sapuser || "";
  const selectedZapText =
    ownerZap?.nzap ||
    ownerZap?.N2ZAP ||
    [ownerZap?.IME, ownerZap?.PREZIME].filter(Boolean).join(" ");
  const selectedObjId = ownerZap?.obj ?? null;
  const selectedObjText =
    ownerZap?.nobj ||
    ownerZap?.LOK ||
    ownerZap?.lok ||
    "";
  const emptyCoffZaplink = {
    ...EmptyEntities[objName],
    zap2: `${selectedZapKey || ''}`,
    obj: selectedObjId ?? null,
    nazap1: selectedZapText || "",
    nobj: selectedObjText || "",
  };

  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffZaplinks, setCoffZaplinks] = useState([]);
  const [coffZaplink, setCoffZaplink] = useState(emptyCoffZaplink);
  const [filters, setFilters] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [zaplinkTip, setZaplinkTip] = useState("");

  useEffect(() => {
    async function resolveOwnerZap() {
      try {
        if (props.coffZap?.zap || props.coffZap?.ZAP) {
          setOwnerZap(props.coffZap);
          return;
        }

        if (props.userZap?.zap || props.userZap?.ZAP) {
          setOwnerZap(props.userZap);
          return;
        }

        if (props.user?.sapuser) {
          const coffZaplinkService = new CoffZaplinkService();
          const data = await coffZaplinkService.getZapByUser(props.user.sapuser);
          const nextOwnerZap = Array.isArray(data) ? data[0] : data;

          setOwnerZap(nextOwnerZap || null);
        }
      } catch (error) {
        console.error(error);
      }
    }

    resolveOwnerZap();
  }, [props.coffZap, props.userZap, props.user]);

  const handleCancelClick = () => {
    props.setCoffZaplinkLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (!selectedZapKey) {
          console.log("[CoffZaplinkL] Preskacem ucitavanje jer selectedZapKey ne postoji.", {
            selectedZapKey,
            ownerZap,
            coffZap: props.coffZap,
            userZap: props.userZap,
          });
          setCoffZaplinks([]);
          return;
        }

        const coffZaplinkService = new CoffZaplinkService();
        console.log("[CoffZaplinkL] Ucitavam zaplink niz.", { selectedZapKey, ownerZap });
        const data = await coffZaplinkService.getLista(selectedZapKey);
        console.log("[CoffZaplinkL] Ucitani niz objekata:", data);
        // console.log("[CoffZaplinkL] Vracan niz objekata:", data);
        setCoffZaplinks(data || []);
        initFilters();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedZapKey, ownerZap, props.coffZap, props.userZap]);

  useEffect(() => {
    setCoffZaplink((prev) => ({
      ...prev,
      zap2: `${prev?.zap2 || selectedZapKey || ''}`,
      obj: prev?.obj ?? selectedObjId ?? null,
      nazap1: prev?.nazap1 || selectedZapText || "",
      nobj: prev?.nobj || selectedObjText || "",
    }));
  }, [selectedZapKey, selectedObjId, selectedObjText, selectedZapText]);

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };
    let nextCoffZaplinks = [...coffZaplinks];
    const nextCoffZaplink = { ...localObj.newObj.obj };

    if (localObj.newObj.zaplinkTip === "CREATE") {
      nextCoffZaplinks.push(nextCoffZaplink);
    } else if (localObj.newObj.zaplinkTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      nextCoffZaplinks[index] = nextCoffZaplink;
    } else if (localObj.newObj.zaplinkTip === "DELETE") {
      nextCoffZaplinks = coffZaplinks.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: "success", summary: "Successful", detail: "CoffZaplink Delete", life: 3000 });
    } else {
      toast.current.show({ severity: "success", summary: "Successful", detail: "CoffZaplink ?", life: 3000 });
    }

    toast.current.show({ severity: "success", summary: "Successful", detail: `{${objName}} ${localObj.newObj.zaplinkTip}`, life: 3000 });
    setCoffZaplinks(nextCoffZaplinks);
    setCoffZaplink({ ...emptyCoffZaplink });
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < coffZaplinks.length; i++) {
      if (coffZaplinks[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setCoffZaplinkDialog(emptyCoffZaplink);
  };

  const onRowSelect = (event) => {
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.nzap1}`,
      life: 3000,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.nzap1}`,
      life: 3000,
    });
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      zap1: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      nzap1: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      email: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      nobj: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
      begda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      endda: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      descript: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
      },
    });
    setGlobalFilterValue("");
  };

  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    const nextFilters = { ...filters };

    nextFilters.global.value = value;

    setFilters(nextFilters);
    setGlobalFilterValue(value);
  };

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" />
        {props.dialog && <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />}
        <div className="flex flex-wrap gap-1">
          <Button
            label={translations[selectedLanguage].New}
            icon="pi pi-plus"
            severity="success"
            onClick={openNew}
            text
            raised
            disabled={!selectedZapKey}
          />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].ZaplinkList}</b>
        <div className="flex-grow-1"></div>
        <div className="flex flex-wrap gap-1">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder={translations[selectedLanguage].KeywordSearch} />
          </span>
          <Button type="button" icon="pi pi-filter-slash" label={translations[selectedLanguage].Clear} outlined onClick={clearFilter} text raised />
        </div>
      </div>
    );
  };

  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  const objBodyTemplate = (rowData) => {
    return (
      rowData.nobj ||
      rowData.objtext ||
      rowData.objname ||
      rowData.nazivobj ||
      rowData.lok ||
      rowData.LOK ||
      rowData.obj ||
      ""
    );
  };

  const setCoffZaplinkDialog = (currentCoffZaplink) => {
    setShowMyComponent(true);
    setVisible(true);
    setZaplinkTip("CREATE");
    setCoffZaplink({
      ...emptyCoffZaplink,
      ...currentCoffZaplink,
      zap2: `${currentCoffZaplink?.zap2 || selectedZapKey || ''}`,
      obj: currentCoffZaplink?.obj ?? selectedObjId ?? null,
      nazap1: currentCoffZaplink?.nazap1 || selectedZapText || "",
      nobj: currentCoffZaplink?.nobj || selectedObjText || "",
    });
  };

  const header = renderHeader();

  const zaplinkTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">
        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: "24px", height: "24px" }}
          onClick={() => {
            setCoffZaplinkDialog(rowData);
            setZaplinkTip("UPDATE");
          }}
          text
          raised
        ></Button>
      </div>
    );
  };

  return (
    <div className="card model-grid-page">
      <Toast ref={toast} />
      {!props.TabView && (
        <div className="col-12">
          <div className="card">
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                <InputText id="code" value={selectedZapCode} disabled />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                <InputText id="text" value={selectedZapText} disabled />
              </div>
            </div>
          </div>
        </div>
      )}
      <DataTable
        dataKey="id"
        selectionMode="single"
        selection={coffZaplink}
        loading={loading}
        value={coffZaplinks}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="flex"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSelectionChange={(e) => setCoffZaplink(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column body={zaplinkTemplate} exportable={false} headerClassName="w-10rem" style={{ minWidth: "4rem" }} />
        <Column field="zap1" header={translations[selectedLanguage].Zap} sortable filter style={{ width: "12%" }}></Column>
        <Column field="nzap1" header={translations[selectedLanguage].Text} sortable filter style={{ width: "24%" }}></Column>
        <Column field="email" header="Email" sortable filter style={{ width: "18%" }}></Column>
        <Column field="nobj" header={translations[selectedLanguage].Obj} sortable filter style={{ width: "18%" }} body={objBodyTemplate}></Column>
        <Column field="descript" header={translations[selectedLanguage].Descript} sortable filter style={{ width: "15%" }}></Column>
        <Column field="begda" header={translations[selectedLanguage].Begda} sortable filter style={{ width: "10%" }} body={(rowData) => formatDateColumn(rowData, "begda")}></Column>
        <Column field="endda" header={translations[selectedLanguage].Endda} sortable filter style={{ width: "10%" }} body={(rowData) => formatDateColumn(rowData, "endda")}></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Zaplink}
        visible={visible}
        style={{ width: "60%" }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffZaplink
            coffZaplink={coffZaplink}
            coffZap={ownerZap}
            user={props.user}
            userZap={ownerZap}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            zaplinkTip={zaplinkTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: "none" }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
    </div>
  );
}
