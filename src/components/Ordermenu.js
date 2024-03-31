// src/components/Menu.js
import './Index.css';
import '../assets/css/bootstrap-icons.css'
import React, { useState, useEffect, useRef } from 'react';
import Isotope, { select, on } from 'isotope-layout';
import { FilterMatchMode, FilterOperator } from "primereact/api";
import AOS from 'aos';
import { EmptyEntities } from '../service/model/EmptyEntities';
import { translations } from "../configs/translations";
import 'aos/dist/aos.css';
import { Dialog } from 'primereact/dialog';
import CoffDocsmenu from './model/coffDocsmenu';
import { CoffDocService } from "../service/model/CoffDocService";

const Ordermenu = (props) => {
    let i = 0
    const isotopeOrder = useRef();
    const objName = "tic_docs"
    const selectedLanguage = localStorage.getItem('sl') || 'en'
    
    const emptyTicCena = EmptyEntities[objName]
    const [showMyComponent, setShowMyComponent] = useState(true);
    const [filterKey, setFilterKey] = React.useState('*')
    const [filters, setFilters] = useState('');
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [visibleCoffDocsmenu, setVisibleCoffDocsmenu] = useState(false);
    const [cenaTip, setLocTip] = useState('');
    const [artCurr, setArtCurr] = useState({});
    const [ticCena, setTicCena] = useState(emptyTicCena);
    const [menItems, setMenuItems] = useState([]);
    const [dataTab, setDataTab] = useState('');
    const [docId, setDocId] = useState('');
    

    // const orderItems = [

    useEffect(() => {
        async function fetchData() {
            try {
                ++i
                if (i < 2) {
                    const coffDocService = new CoffDocService();
                    const data = await coffDocService.getMenu();
                    await setMenuItems(data);

                    initFilters();
                }
            } catch (error) {
                console.error(error);
                // Obrada greške ako je potrebna
            }
        }
        fetchData();
    }, []);

    React.useEffect(() => {

        isotopeOrder.current = new Isotope('.order-container', {
            itemSelector: '.order-item',
            layoutMode: 'fitRows',
        })
        return () => isotopeOrder.current.destroy()
    }, [menItems])

    // handling filter key change
    React.useEffect(() => {
        filterKey === '*'
            ? isotopeOrder.current.arrange({ filter: `*` })
            : isotopeOrder.current.arrange({ filter: `.${filterKey}` })
    }, [filterKey])

    const handleDialogClose = (newObj) => {
        console.log("@@@------------------------handleDialogClose--------------------@@@@@@");

    }

    const handleFilterKeyChange = key => () => {
        console.log("@@@------------------------handleFilterKeyChange--------------------@@@@@@");
        setFilterKey(key)
    }


    const handleItemClick = (item, event) => {
        const currCoffOrder = localStorage.getItem('currCoffOrder')
        setDocId(currCoffOrder)
        setArtCurr({ ...item })
        setTicCenaDialog(emptyTicCena);
        event.stopPropagation();
    };

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

    const setTicCenaDialog = (ticCena) => {
        setVisibleCoffDocsmenu(true)
        setLocTip("CREATE")
        setTicCena({ ...ticCena });
    }
    const handleDataUpdate = (updatedTab) => {
        props.onDataUpdate(updatedTab);
        // setDataTab(updatedTab);
    };
  
    return (
        <section id="menu" className="menu section-bg ">
            <div className="container" data-aos="fade-up">
                <div className="section-title">
                    <h2>Мени</h2>
                    {/* <p>Check Our Tasty Menu</p> */}
                </div>

                <div id="mnu01" className="row" data-aos="fade-up" data-aos-delay="800">
                    <div id="mnu02" className="col-lg-12 d-flex justify-content-center">
                        <ul id="order-flters">
                            <li onClick={handleFilterKeyChange('*')} className="filter-active">Све</li>
                            <li onClick={handleFilterKeyChange('B-KAFA')}>Кафа</li>
                            <li onClick={handleFilterKeyChange('B-VODA')}>Вода</li>
                            <li onClick={handleFilterKeyChange('B-SOK')}>Сокови</li>
                            <li onClick={handleFilterKeyChange('B-TN')}>Остало</li>
                        </ul>
                        {/* 
                        <ul id="order-flters">
                            {filterKeys.map((filterKey) => (
                                <li key={filterKey.id} onClick={() => handleFilterKeyChange(filterKey.code)}>
                                    {filterKey.text}
                                </li>
                            ))}
                        </ul> 
                        */}
                    </div>
                </div>

                <div id="mnu03" className="row order-container" data-aos="fade-up" data-aos-delay="200" style={{ position: 'relative', height: '950px ' }}>
                    {menItems.map(item => (
                        <div key={item.id} className={`col-lg-3 menu-item order-item ${item.category}`} onClick={(e) => handleItemClick(item, e)}>
                            <img src={item.img} className="menu-img" alt={item.name} style={{ cursor: 'pointer' }} />
                            <div className="menu-content" style={{ cursor: 'pointer' }} >
                                <aa href="/menu">{item.name}</aa>
                                {/* <span>{item.price}</span> */}
                            </div>
                            <div className="menu-ingredients" style={{ cursor: 'pointer' }} >
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
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
                            ticCena={ticCena}
                            handleDialogClose={handleDialogClose}
                            onDataUpdate={handleDataUpdate}
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
            </div>
        </section>
    );
};

export default Ordermenu;
