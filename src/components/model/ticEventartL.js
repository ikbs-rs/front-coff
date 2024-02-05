import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicEventartService } from "../../service/model/TicEventartService";
import TicEventart from './ticEventart';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import TicEventrtcenaL from './ticEventartcenaL';
import { TicEventartcenaService } from "../../service/model/TicEventartcenaService";
import ColorPickerWrapper from './cmn/ColorPickerWrapper';

export default function TicEventartL(props) {

  const objName = "tic_eventart"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicEventart = EmptyEntities[objName]
  emptyTicEventart.event = props.ticEvent.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticEventarts, setTicEventarts] = useState([]);
  const [ticEventart, setTicEventart] = useState(emptyTicEventart);
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [eventartTip, setEventartTip] = useState('');
  const [ticEventartcenaLVisible, setTicEventartcenaLVisible] = useState(false);
  const [refreshForm, setRefreshForm] = useState('');
  let i = 0
  const handleCancelClick = () => {
    props.setTicEventartLVisible(false);
  };

  const handleRefresh = (uId) => {
    setRefreshForm(uId);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        ++i;
        if (i < 2) {
          const ticEventartService = new TicEventartService();
          const data = await ticEventartService.getLista(props.ticEvent.id);
  
          // Kreiraj niz obećanja za dohvat cena
          const pricePromises = data.map(async (item) => {
            const ticEventartcenaService = new TicEventartcenaService();
            const prices = await ticEventartcenaService.getLista(item.id);
            return prices.map((price) => ({
              ccurr: price.ccurr,
              ncena: price.ncena,
              value: price.value, // Prilagodite kako konvertujete cenu
              begda: price.begda,
            }));
          });
  
          // Sačekaj da sva obećanja budu ispunjena
          const pricesArray = await Promise.all(pricePromises);
  
          // Dodajte polje 'products' u svaki red podataka sa vrednostima proizvoda
          const updatedData = data.map((item, index) => ({
            ...item,
            products: pricesArray[index],
          }));
  console.log(updatedData, "************************************************************")
          setTicEventarts(updatedData);
          initFilters();
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
  
    fetchData();
  }, [refreshForm]);
  

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       ++i
  //       if (i < 2) {
  //         const ticEventartService = new TicEventartService();
  //         const data = await ticEventartService.getLista(props.ticEvent.id);
  //     // Dodajte polje 'products' u svaki red podataka sa vrednostima proizvoda
  //     const updatedData = data.map((item) => ({
  //       ...item,
  //       products: [
  //         {
  //           id: '1029',
  //           code: 'gwuby345v',
  //           name: '1500'
  //         },
  //         {
  //           id: '1027',
  //           code: 'acvx872gc',
  //           name: '750'
  //         }
  //       ],
  //     }));

  //     setTicEventarts(updatedData);          
  //         //setTicEventarts(data);

  //         initFilters();
  //       }
  //     } catch (error) {
  //       console.error(error);
  //       // Obrada greške ako je potrebna
  //     }
  //   }
  //   fetchData();
  // }, []);
  const handleConfirmClick = () => {
    console.log(ticEventart, "7777777777777777777777777777777777777777777777777777")
    if (ticEventart) {
      ticEventart.price = 1000;
      ticEventart.loc1 = "1707106091126886400";
      props.onTaskComplete(ticEventart);
      // DODATI MIN LOKACIJU ZA KOJU JE VEZANA KATEGORIJA CENA
      // DODATI I REGULARNU CENU
    } else {
      toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'No row selected', life: 3000 });
    }
  };
  const handleDialogClose = (newObj) => {
    const localObj = { newObj };

    let _ticEventarts = [...ticEventarts];
    let _ticEventart = { ...localObj.newObj.obj };
    //setSubmitted(true);
    if (localObj.newObj.eventartTip === "CREATE") {
      _ticEventarts.push(_ticEventart);
    } else if (localObj.newObj.eventartTip === "UPDATE") {
      const index = findIndexById(localObj.newObj.obj.id);
      _ticEventarts[index] = _ticEventart;
    } else if ((localObj.newObj.eventartTip === "DELETE")) {
      _ticEventarts = ticEventarts.filter((val) => val.id !== localObj.newObj.obj.id);
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventart Delete', life: 3000 });
    } else {
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'TicEventart ?', life: 3000 });
    }
    toast.current.show({ severity: 'success', summary: 'Successful', detail: `{${objName}} ${localObj.newObj.eventartTip}`, life: 3000 });
    setTicEventarts(_ticEventarts);
    setTicEventart(emptyTicEventart);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < ticEventarts.length; i++) {
      if (ticEventarts[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const openNew = () => {
    setTicEventartDialog(emptyTicEventart);
  };

  /*
  Event Prodaja *****************************************************************************************************
  */
  const handleEventartcenaLClick = () => {
    setTicEventartcenaLDialog();
  };

  const setTicEventartcenaLDialog = (destination) => {
    setShowMyComponent(true);
    setTicEventartcenaLVisible(true);
  };


  const handleTicEventCenaLDialogClose = (newObj) => {
    setTicEventart(newObj);
    // ticDocs.event = newObj.id;
    // ticDocs.nevent = newObj.text;
    // ticDocs.cevent = newObj.code;
    //*******setTicEventCenaLVisible(false);
  };
  /*
  Click Handle *****************************************************************************************************
  */
  const onRowSelect = (event) => {
    //ticEventart.begda = event.data.begda
    toast.current.show({
      severity: "info",
      summary: "Action Selected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 300,
    });
  };

  const onRowUnselect = (event) => {
    toast.current.show({
      severity: "warn",
      summary: "Action Unselected",
      detail: `Id: ${event.data.id} Name: ${event.data.text}`,
      life: 300,
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
      endda: {
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
        {props.lookUp && (
          <>
            <div className="flex flex-wrap gap-1" />
            <Button label={translations[selectedLanguage].Confirm} icon="pi pi-times" onClick={handleConfirmClick} text raised disabled={!ticEventart} />
          </>
        )}
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].New} icon="pi pi-plus" severity="success" onClick={openNew} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Cena} icon="pi pi-dollar" onClick={handleEventartcenaLClick} severity="info" text raised />
        </div>
               
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventartList}</b>
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
    return DateFunction.formatDate(rowData[field]);
  };

  // <--- Dialog
  const setTicEventartDialog = (ticEventart) => {
    setVisible(true)
    setEventartTip("CREATE")
    setTicEventart({ ...ticEventart });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>

  const eventartTemplate = (rowData) => {
    return (
      <div className="flex flex-wrap gap-1">

        <Button
          type="button"
          icon="pi pi-pencil"
          style={{ width: '24px', height: '24px' }}
          onClick={() => {
            setTicEventartDialog(rowData)
            setEventartTip("UPDATE")
          }}
          text
          raised ></Button>

      </div>
    );
  };


  const cenaTemplate = (rowData) => {
    // Proveri da li postoji niz proizvoda
    if (rowData.products && rowData.products.length > 0) {
      return (
        <div>
          <table className="p-datatable" style={{ minWidth: "20rem" }}>
            <tbody>
              {rowData.products.map((product) => (
                <tr key={product.id}>
                  <td style={{ width: '50%' }}>{product.ncena}</td>
                  <td style={{ width: '30%' }}>{product.value}</td>
                  <td style={{ width: '20%' }}>{DateFunction.formatDate(product.begda)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // Ako nema proizvoda, možete prikazati odgovarajuću poruku ili ništa
      return null;
    }
  };
  
  
  
  const colorBodyTemplate = (rowData) => {
    return (
      <>
        <ColorPickerWrapper value={rowData.color} format={"hex"}/>
        {/* <ColorPicker format="hex" id="color" value={rowData.color} readOnly={true} /> */}
      </>
    );
  };
  

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
        dataKey="id"
        selectionMode="single"
        selection={ticEventart}
        loading={loading}
        value={ticEventarts}
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
        onSelectionChange={(e) => setTicEventart(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        <Column
          //bodyClassName="text-center"
          body={eventartTemplate}
          exportable={false}
          headerClassName="w-10rem"
          style={{ minWidth: '4rem' }}
        />
        <Column
          field="cart"
          header={translations[selectedLanguage].Code}
          sortable
          filter
          style={{ width: "10%" }}
        ></Column>
        <Column
          field="nart"
          header={translations[selectedLanguage].Text}
          sortable
          filter
          style={{ width: "30%" }}
        ></Column>
        <Column
          field="discount"
          header={translations[selectedLanguage].Discount}
          sortable
          filter
          style={{ width: "20%" }}
        ></Column>
        <Column
          field="descript"
          header={translations[selectedLanguage].Description}
          sortable
          filter
          style={{}}
        ></Column>
        <Column
          field="begda"
          header={translations[selectedLanguage].Begda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "begda")}
        ></Column>
        <Column
          field="endda"
          header={translations[selectedLanguage].Endda}
          sortable
          filter
          style={{ width: "10%" }}
          body={(rowData) => formatDateColumn(rowData, "endda")}
        ></Column>        
        <Column
          //bodyClassName="text-center"
          header={translations[selectedLanguage].Cena}
          body={cenaTemplate}
          exportable={false}
          // headerClassName="w-10rem"
          style={{ width: "20%" }}
        />
        <Column
          field="color"
          header={translations[selectedLanguage].Color}
          body={colorBodyTemplate}
          style={{ width: "20%" }}
        ></Column>
      </DataTable>
      <Dialog
        header={translations[selectedLanguage].Link}
        visible={visible}
        style={{ width: '60%' }}
        onHide={() => {
          setVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <TicEventart
            parameter={"inputTextValue"}
            ticEventart={ticEventart}
            ticEvent={props.ticEvent}
            handleDialogClose={handleDialogClose}
            setVisible={setVisible}
            dialog={true}
            eventartTip={eventartTip}
          />
        )}
        <div className="p-dialog-header-icons" style={{ display: 'none' }}>
          <button className="p-dialog-header-close p-link">
            <span className="p-dialog-header-close-icon pi pi-times"></span>
          </button>
        </div>
      </Dialog>
      <Dialog
        header={translations[selectedLanguage].EventartcanaList}
        visible={ticEventartcenaLVisible}
        style={{ width: '90%' }}
        onHide={() => {
          setTicEventartcenaLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent &&
          <TicEventrtcenaL
            parameter={'inputTextValue'}
            ticEventart={ticEventart}
            //setTicArtLVisible={setTicArtLVisible} 
            setTicEventartcenaLVisible={setTicEventartcenaLVisible}
            dialog={true}
            lookUp={true}
            eventArtcena={true}
            handleRefresh={handleRefresh}
          />}
      </Dialog>
    </div>
  );
}
