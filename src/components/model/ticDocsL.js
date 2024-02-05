import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicDocsService } from "../../service/model/TicDocsService";
import TicDocs from './ticDocs';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import WebMap from './remoteComponentContainer';
import TicEventProdajaL from './ticEventProdajaL';
import DeleteDialog from '../dialog/DeleteDialog';


export default function TicDocsL(props) {

 //console.log(props,"*******************TicDocsL************************")
  const objName = "tic_docs"
  const objName2 = "tic_event"
  const selectedLanguage = localStorage.getItem('sl')||'en'
  const emptyTicDocs = EmptyEntities[objName]
  const emptyTicEvent = EmptyEntities[objName2]
  emptyTicDocs.doc = props.ticDoc.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticDocss, setTicDocss] = useState([]);
  const [ticDocs, setTicDocs] = useState(emptyTicDocs);
  const [ticEvent, setTicEvent] = useState(emptyTicEvent);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [docsTip, setDocsTip] = useState('');
  const [webMapVisible, setWebMapVisible] = useState(false);
  const [ticEventProdajaLVisible, setTicEventProdajaLVisible] = useState(false);
  let i = 0
  const handleCancelClick = () => {
    props.setTicDocsLVisible(false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const ticDocsService = new TicDocsService();
          const data = await ticDocsService.getLista(props.ticDoc.id);
          //const data = await ticDocsService.getLista("1698042558175121408");
          //console.log(data, "***************** Date ******************")
          setTicDocss(data);

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

    let _ticDocss = [...ticDocss];
    let _ticDocs = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.docsTip === "CREATE") {
      _ticDocss.push(_ticDocs);
    } else if (localObj.newObj.docsTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticDocss[index] = _ticDocs;
    } else if ((localObj.newObj.docsTip === "DELETE")) {
      _ticDocss = ticDocss.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocs Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicDocs ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.docsTip}`, life: 3000 });
    setTicDocss(_ticDocss);
    setTicDocs(emptyTicDocs);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticDocss.length; i++) {
      if (ticDocss[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicDocsDialog(emptyTicDocs);
  };
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const showDeleteDialog = () => {
    setDeleteDialogVisible(true);
};
const hideDeleteDialog = () => {
  setDeleteDialogVisible(false);
};

/*
Web Map *********************************************************************************************************
*/
  const handleWebMapClick = async () => {
    try {
        setWebMapDialog()
    } catch (error) {
        console.error(error);
        toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to fetch cmnPar data",
            life: 3000,
        });
    }
};

const setWebMapDialog = () => {
  setWebMapVisible(true)
}

const handleWebMapDialogClose = (newObj) => {
  setWebMapVisible(false)
};
/*
Event Prodaja *****************************************************************************************************
*/
const handleEventProdajaClick = async (e, destination) => {
  try {
      setTicEventProdajaLDialog();
  } catch (error) {
      console.error(error);
      toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch ticArt data',
          life: 3000
      });
  }
};

const setTicEventProdajaLDialog = (destination) => {
  setTicEventProdajaLVisible(true);
}; 


const handleTicEventProdajaLDialogClose = (newObj) => {
  //setTicEvent(newObj);
  // ticDocs.event = newObj.id;
  // ticDocs.nevent = newObj.text;
  // ticDocs.cevent = newObj.code;
  setTicEventProdajaLVisible(false);
};  
/*
Click Handle *****************************************************************************************************
*/
  const onRowSelect = (event) => {
    //ticDocs.begda = event.data.begda
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
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      text: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],       
      },
      begtm: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],       
      },
      endtm: {
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
        {(props.dialog) ? (<Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised/>): null}
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        {
        <div className="flex flex-wrap gap-1">
            <Button label={translations[selectedLanguage].web} icon="pi pi-table" onClick={handleWebMapClick} severity="info" text raised />
        </div>
        }
        <div className="flex flex-wrap gap-1">
            <Button label={translations[selectedLanguage].selection} icon="pi pi-table" onClick={handleEventProdajaClick} severity="info" text raised />
        </div>  
        <div className="flex flex-wrap gap-1">
        <Button label={translations[selectedLanguage].afterSales} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-warning" raised />     
        </div>         
        <div className="flex flex-wrap gap-1">
        <Button label={translations[selectedLanguage].Storno} icon="pi pi-trash" onClick={showDeleteDialog} className="p-button-outlined p-button-danger" raised />     
        </div> 
        <div className="flex-grow-1"></div>
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
/*
  const formatDateColumn = (rowData, field) => {
    return DateFunction.formatDate(rowData[field]);
  };

  const formatTimeColumn = (rowData, field) => {
    return DateFunction.convertTimeToDisplayFormat (rowData[field]);
  };
*/
  // <--- Dialog
  const setTicDocsDialog = (ticDocs) => {
    setVisible(true)
    setDocsTip("CREATE")
    ticEvent.id = ticDocs.event
    setTicEvent({ ...ticEvent });
    setTicDocs({ ...ticDocs });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const docsTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicDocsDialog(rowData)
            setDocsTip("UPDATE")
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
        selection={ticDocs}
        loading={loading}
        value={ticDocss}
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
        onSelectionChange={(e) => setTicDocs(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={docsTemplate} 
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        {/* <Column
          field="cart"
          header={translations[selectedLanguage].cart}
          sortable
          //filter
          style={{ width: "5%" }}
        ></Column> */}
        {/* 
        <Column
          field="cloc"
          header={translations[selectedLanguage].cloc}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
  */}
        <Column
          field="nevent"
          header={translations[selectedLanguage].nevent}
          sortable
          //filter
          style={{ width: "15%" }}
        ></Column>   
        <Column
          field="nloc"
          header={translations[selectedLanguage].nloc}
          sortable
          //filter
          style={{ width: "15%" }}
        ></Column> 
        <Column
          field="nart"
          header={translations[selectedLanguage].nart}
          sortable
          //filter
          style={{ width: "15%" }}
        ></Column>          
        <Column
          field="price"
          header={translations[selectedLanguage].price}
          sortable
          //filter
          style={{ width: "10%" }}
        ></Column>   
        {/* <Column
          field="taxrate"
          header={translations[selectedLanguage].taxrate}
          sortable
          //filter
          style={{ width: "5%" }}
        ></Column>   */}
        <Column
          field="fee"
          header={translations[selectedLanguage].fee}
          sortable
          //filter
          style={{ width: "5%" }}
        ></Column>         
   {/*     <Column
          field="input"
          header={translations[selectedLanguage].input}
          sortable
          filter
          style={{ width: "10%" }}
  ></Column>  */} 
        <Column
          field="output"
          header={translations[selectedLanguage].output}
          sortable
          //filter
          style={{ width: "10%" }}
        ></Column>   
        <Column
          field="discount"
          header={translations[selectedLanguage].discount}
          sortable
         // filter
          style={{ width: "5%" }}
        ></Column>   
        <Column
          field="potrazuje"
          header={translations[selectedLanguage].potrazuje}
          sortable
          //filter
          style={{ width: "15%" }}
        ></Column>    
        <Column
          field="begtm"
          header={translations[selectedLanguage].begtm}
          sortable
          //filter
          style={{ width: "10%" }}
        ></Column>     
        <Column
          field="endtm"
          header={translations[selectedLanguage].endtm}
          sortable
          //filter
          style={{ width: "10%" }}
        ></Column>                                                      
{/**             
        <Column
          field="date"
          header={translations[selectedLanguage].Date}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "date")}
        ></Column>  
        <Column
          field="begtm"
          header={translations[selectedLanguage].BegTM}
          sortable
          filter
          style={{ width: "7%" }}
          body={(rowData) => formatTimeColumn(rowData, "begtm")}
        ></Column> 
        <Column
          field="endtm"
          header={translations[selectedLanguage].EndTM}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatTimeColumn(rowData, "endtm")}
        ></Column> 
*/}                  
      </DataTable>
      <DeleteDialog visible={deleteDialogVisible} inAction="delete"  onHide={hideDeleteDialog}  />
      <Dialog
        header={translations[selectedLanguage].Link}
        visible={visible}
        style={{ width: '90%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicDocs
            parameter={"inputTextValue"}
            ticDocs={ticDocs}
            ticEvent={ticEvent}
            ticDoc={props.ticDoc}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            docsTip={docsTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <Dialog
                header={translations[selectedLanguage].webMap}
                visible={webMapVisible}
                style={{ width: '90%', height: '1100px' }}
                onHide={() => {
                    setWebMapVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {webMapVisible && (
                    <WebMap
                        remoteUrl= {`http://ws11.ems.local:3000/#/events/?docid=${props.ticDoc.id}&sl=sr_cyr`}
                        queryParams={{ sl: 'sr_cyr', lookUp: false, dialog: false, ticDoc: props.ticDoc, parentOrigin: 'http://192.168.72.96:8354' }} // Dodajte ostale parametre po potrebi
                        onTaskComplete={handleWebMapDialogClose}
                        originUrl="http://192.168.72.96:8353"
                    />
                )}
            </Dialog>   
            <Dialog
                header={translations[selectedLanguage].EventList}
                visible={ticEventProdajaLVisible}
                style={{ width: '90%', height: '1400px' }}
                onHide={() => {
                    setTicEventProdajaLVisible(false);
                    setShowMyComponent(false);
                }}
            >
                {ticEventProdajaLVisible && 
                    <TicEventProdajaL 
                        parameter={'inputTextValue'} 
                        ticDocs={ticDocs} 
                        ticDoc={props.ticDoc} 
                        onTaskComplete={handleTicEventProdajaLDialogClose} 
                        setTicEventProdajaLVisible={setTicEventProdajaLVisible} 
                        dialog={true} 
                        lookUp={true} 
                    />}
            </Dialog>                 
    </div>
  );
}
