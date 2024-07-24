import React, { useState, useEffect, useRef } from "react";
import { Dropdown } from 'primereact/dropdown';
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import './index.css';
import { CoffIzvService } from "../../service/model/CoffIzvService";
import { Calendar } from 'primereact/calendar';
import { translations } from "../../configs/translations";

export default function CoffIzv01L(props) {
  console.log(props, "@@@@@@+++++++++++++++++++++++ OrderL ++++++++++++++++++++++++++++++++@@@@@")
  let i = 0
  const objName = "coff_docs"

  const selectedLanguage = localStorage.getItem('sl') || 'en'

  const [showMyComponent, setShowMyComponent] = useState(true);

  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visibleCoffDocsmenu, setVisibleCoffDocsmenu] = useState(false);

  const [dropdownItem, setDropdownItem] = useState(null);
  const [dropdownItems, setDropdownItems] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [coffIzv01s, setCoffIzv01s] = useState([]);
  const [coffIzv01, setCoffIzv01] = useState({});

  const [ddCoffZapItem, setDdCoffZapItem] = useState(null);
  const [ddCoffZapItems, setDdCoffZapItems] = useState(null);
  const [coffZapItem, setCoffZapItem] = useState(null);
  const [coffZapItems, setCoffZapItems] = useState(null);

  const [coffDocVisible, setCoffDocVisible] = useState(true);

  const [date, setDate] = useState(null);
  const dt = useRef(null);

  const cols = [
    { field: 'username', header: 'Korisnik', width: '10%' },
    { field: 'nart', header: 'Art', width: '15%' },
    { field: 'ulaz', header: 'Ulaz', width: '10%' },
    { field: 'izlaz', header: 'Izlaz', width: '10%' },
    { field: 'stanje', header: 'Stanje', width: '10%' },
    { field: 'num', header: 'JM', width: '5%' }
  ];

  // Setujem stavke trenutne porudzbine
  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        // if (i < 2) {
        const coffIzvService = new CoffIzvService();
        const data = await coffIzvService.getIzv01stanje();
        console.log("@@@@@@@@@@@@@", data)
        setCoffIzv01s(data);
        initFilters();
        // }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, [props.datarefresh]);

  // const findIndexById = (id) => {
  //   let index = -1;

  //   for (let i = 0; i < coffDocss.length; i++) {
  //     if (coffDocss[i].id === id) {
  //       index = i;
  //       break;
  //     }
  //   }

  //   return index;
  // };


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

  const handleClick = async () => {
    try {
      setSubmitted(true);
      console.log("@@@@@@@@@@@@@@@@@@@@@@@handleCreateClick@@@@@@@@@@@@@@@@@@@@@@@@")

    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Action ",
        detail: `${err.response.data.error}`,
        life: 5000,
      });
    }
  };

  const onInputChange = (e, type, name) => {
    let val = ''
    if (type === "options") {
      val = (e.target && e.target.value && e.target.value.code) || '';
      if (name == "potpisnik") {
        setDdCoffZapItem(e.value);
        const foundItem = coffZapItems.find((item) => item.id === val);
        console.log(foundItem, "-*-*-*-*-***-**-*-*-*-*-*-*-*-*--onInputChange000*-*-*-*-*-*-*-*-*--**--*-*-*-*-*-*-*-*-*-*-*-", foundItem.NZAP)
        setCoffZapItem(foundItem || null);
      } else {
        setDropdownItem(e.value);
      }
    } else {
      val = (e.target && e.target.value) || '';
    }

    // let _coffDoc = { ...coffDoc };
    // _coffDoc[`${name}`] = val;
    // if (name === `textx`) _coffDoc[`text`] = val

    // setCoffDoc(_coffDoc);
  };

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Potvrdi} icon="pi pi-plus" severity="success" onClick={handleClick} text raised />
        </div>
        <div className="flex flex-wrap gap-1">
          <Button label={translations[selectedLanguage].Export} icon="pi pi-file-excel" severity="success" onClick={exportExcel} data-pr-tooltip="XLS"  raised />
        </div>
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].PregledList}</b>
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


  const exportExcel = () => {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(coffIzv01s);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

      saveAsExcelFile(excelBuffer, 'products');
    });
  };


  const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data = new Blob([buffer], {
          type: EXCEL_TYPE
        });

        module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
    });
  };

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
            // setCoffDocsDialog(rowData)
            // setDocsTip("UPDATE")
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
            <label htmlFor="potpisnik">{translations[selectedLanguage].potpisnik} *</label>
            <Dropdown id="potpisnik"
              value={ddCoffZapItem}
              options={ddCoffZapItems}
              onChange={(e) => onInputChange(e, "options", 'potpisnik')}
              required
              optionLabel="name"
              placeholder="Select One"
            />
          </div>

          <div className="field col-12 md:col-3">
            <label htmlFor="mesto">{translations[selectedLanguage].Begda}</label>
            <Calendar
              id="begda"
              value={date}
              onChange={(e) => setDate(e.value)}
              showIcon />
          </div>
          <div className="field col-12 md:col-3">
            <label htmlFor="mesto">{translations[selectedLanguage].Endda}</label>
            <Calendar
              id="endda"
              value={date}
              onChange={(e) => setDate(e.value)}
              showIcon />
          </div>

        </div>
      </div>

      <DataTable
        id="OrderL"
        dataKey="id"
        selectionMode="single"
        // selection={coffIzv01s}
        loading={loading}
        value={coffIzv01s}
        header={header}
        showGridlines
        removableSort
        filters={filters}
        scrollable
        scrollHeight="640px"
        virtualScrollerOptions={{ itemSize: 46 }}
        tableStyle={{ minWidth: "50rem" }}
        metaKeySelection={false}
        paginator
        rows={50}
        rowsPerPageOptions={[50, 100, 250, 500]}
        // onSelectionChange={(e) => setCoffIzv01s(e.value)}
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
      >
        {cols.map((col, index) => (
          <Column key={index} field={col.field} header={col.header} style={{ width: col.width }} sortable />
        ))}
        {/* <Column
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
        ></Column> */}
      </DataTable>

    </div>
  );
}
