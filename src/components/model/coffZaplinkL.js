import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { CoffZaplinkService } from "../../service/model/CoffZaplinkService";
import CoffZaplink from './coffZaplink';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations }  from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
// import ColorPickerWrapper from './ColorPickerWrapper';


export default function CoffZaplinkL(props) {
  console.log(props, "*********props*********************CoffZaplinkL!!!!!!!!!***********************************")
  const objName = "coff_zaplink"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyCoffZaplink = EmptyEntities[objName]
  
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffZaplinks, setCoffZaplinks] = useState([]);
  const [coffZaplink, setCoffZaplink] = useState(emptyCoffZaplink);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [zaplinkTip, setZaplinkTip] = useState('');
  const [userZap, setUserZap] = useState({});
  let i = 0
  const handleCancelClick = () => {
    props.setCoffZaplinkLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const coffZaplinkService = new CoffZaplinkService();
          const data = await coffZaplinkService.getLista(props.user.sapuser);
          console.log(data, "/////////////////////////////////////////////////////////////getListaLL////////////////////////////////////////////////////////////////////////")          
          setCoffZaplinks(data);
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
          const coffZaplinkService = new CoffZaplinkService();
          
          const data = await coffZaplinkService.getZapByUser(props.user.sapuser);
          // console.log(props.coffZap.id, "/////////////////////////////////////////////////////////////getListaLL////////////////////////////////////////////////////////////////////////")
          emptyCoffZaplink.zap2 = data[0].id
          setUserZap(data[0]);

      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _coffZaplinks = [...coffZaplinks];
    let _coffZaplink = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.zaplinkTip === "CREATE") {
      _coffZaplinks.push(_coffZaplink);
    } else if (localObj.newObj.zaplinkTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _coffZaplinks[index] = _coffZaplink;
    } else if ((localObj.newObj.zaplinkTip === "DELETE")) {
      _coffZaplinks = coffZaplinks.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffZaplink Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'CoffZaplink ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.zaplinkTip}`, life: 3000 });
    setCoffZaplinks(_coffZaplinks);
    setCoffZaplink(emptyCoffZaplink);
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
      otext: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
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
        {props.dialog && (
          <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised />
        )}
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].ZaplinkList}</b>
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
    console.log(rowData, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$", field)
    return DateFunction.formatDate(rowData[field]);
  };

  const onoffBodyTemplate = (rowData) => {
    const valid = rowData.onoff == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const hijerarhijaBodyTemplate = (rowData) => {
    const valid = rowData.hijerarhija == 1 ? true : false
    return (
      <i
        className={classNames("pi", {
          "text-green-500 pi-check-circle": valid,
          "text-red-500 pi-times-circle": !valid
        })}
      ></i>
    );
  };
  const onoffFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          {translations[selectedLanguage].On_off}
        </label>
        <TriStateCheckbox
          inputId="verified-filter"
          value={options.value}
          onChange={(e) => options.filterCallback(e.value)}
        />
      </div>
    );
  };
  const hijerarhijaFilterTemplate = (options) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          {translations[selectedLanguage].Hijerarhija}
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
  const setCoffZaplinkDialog = (coffZaplink) => {
    setVisible(true)
    setZaplinkTip("CREATE")
    setCoffZaplink({ ...coffZaplink });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const zaplinkTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setCoffZaplinkDialog(rowData)
            setZaplinkTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };

  // const colorBodyTemplate = (rowData) => {
  //   return (
  //     <>
  //       <ColorPickerWrapper value={rowData.color} format={"hex"}/>
  //       {/* <ColorPicker format="hex" id="color" value={rowData.color} readOnly={true} /> */}
  //     </>
  //   );
  // };

  return (
    <div className="card">
      <Toast ref={toast} />
      {!props.TabView && (
        <div className="col-12">
          <div className="card">
            <div className="p-fluid formgrid grid">
              <div className="field col-12 md:col-6">
                <label htmlFor="code">{translations[selectedLanguage].Code}</label>
                <InputText id="code"
                  value={props.user?.firstname}
                  disabled={true}
                />
              </div>
              <div className="field col-12 md:col-6">
                <label htmlFor="text">{translations[selectedLanguage].Text}</label>
                <InputText
                  id="text"
                  value={props.user?.lastname}
                  disabled={true}
                />
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
        scrollHeight="550px"
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
        <Column
          //bodyClassName="text-center"
          body={zaplinkTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="nzap1"
          header={translations[selectedLanguage].Zap}
          sortable
          filter
          style={{ width: "60%" }}
        ></Column>
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "20%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column>
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "20%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
        ></Column>
        {/* <Column
          field="color"
          header={translations[selectedLanguage].Color}
          body={colorBodyTemplate}
          style={{ width: "20%" }}
        ></Column>         */}
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Zaplink}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffZaplink
            parameter={"inputTextValue"}
            coffZaplink={coffZaplink}
            coffZap={props.coffZap}
            user={props.user}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            zaplinkTip={zaplinkTip}
            userZap={userZap}
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
