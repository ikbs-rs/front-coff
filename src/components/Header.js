// src/components/Header.js
import React, { useEffect, useState } from 'react';
import './Index.css';
import { Badge } from 'primereact/badge';
import { translations } from "../configs/translations";
import CoffZamL from './model/coffZaplinkL';
import { Dialog } from 'primereact/dialog';
import { AdmUserService } from "../service/model/cmn/AdmUserService";
import { Avatar } from 'primereact/avatar';
import { useWebSocket } from '../utilities/WebSocketContext';
import { CoffDocService } from "../service/model/CoffDocService";

const Header = ({ scrollToSection, heroSectionRef, aboutRef, statusRef, orderRef, docRef }) => {
  let i = 0
  const b = "http://brztest.ems.local/coff/assets/img/zap/1774496601038262272.jpg"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const userId = localStorage.getItem('userId') || -1
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffZap, setCoffZap] = useState({});
  const [user, setUser] = useState({});
  const [coffZapVisible, setCoffZaplinkLVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [slika, setSlika] = useState('');
  let [brojPoruka, setBrojPoruka] = useState(0);
  const websocket = useWebSocket();



  useEffect(() => {
    async function fetchData() {

        const coffDocService = new CoffDocService();
        const data = await coffDocService.getCoffDocsCountTp(1);       
        setBrojPoruka(data.count)

    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      
      if (websocket) {     
        websocket.addEventListener('message', async (message) => {
          const obj = JSON.parse(message.data)
          if (obj.data[0].id == 'TRECA') {
            const coffDocService = new CoffDocService();
            const data = await coffDocService.getCoffDocsCountTp(1);            
            setBrojPoruka(data.count)  
          }
        });
      }
    }
    fetchData();
  }, [websocket]);

  useEffect(() => {
    const handleScroll = () => {
      // Postavite prag skrolovanja, npr. 100px
      const threshold = 100;
      const scrolled = window.scrollY > threshold;

      setIsScrolled(scrolled);
    };

    // Dodajte event listener za skrolovanje
    window.addEventListener('scroll', handleScroll);

    // Očistite event listener kada komponenta više nije montirana
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        ++i
        if (i < 2) {
          const admUserService = new AdmUserService();
          const data = await admUserService.getAdmUser(userId);
          console.log(data, "/////////////////////////////////////////////////////////////getListaLL////////////////////////////////////////////////////////////////////////")
          setUser(data);
          setSlika(`http://brztest.ems.local/coff/assets/img/zap/${data.id}.jpg`)
        }
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleOvlascenjeClick = (e) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send('{"data":[{"id":"TRECA"}]}');
    }
    // setCoffZamDialog(e);
  }

  const setCoffZamDialog = (e) => {
    setCoffZaplinkLVisible(true)
    setShowMyComponent(true)
  }

  const handleDropdownClick = (event) => {
    console.log(event, "*************event*******************")
    event.preventDefault();
    const childUl = event.currentTarget.querySelector('ul');
    const hasDropdownActiveClass = childUl.classList.contains('dropdown-active')

    console.log(childUl, "*************childUl*******************", childUl.classList.contains('dropdown-active'))

    if (hasDropdownActiveClass) {
      childUl.classList.remove('dropdown-active');
    } else {
      childUl.classList.add('dropdown-active');
    }
    event.stopPropagation();
  };

  const handleDialogClose = (newObj) => {
    const localObj = { newObj };
  }

  return (
    <>
      <header id="header" className={`fixed-top d-flex align-items-center ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between" style={{ "max-width": "100%" }}>
          {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }} /> */}
          <h1 className="logo me-auto me-lg-0"><a href="/" onClick={(e) => { e.preventDefault(); scrollToSection(heroSectionRef); }} style={{ "padding-left": "50px" }}>ЕМС - БИФЕ </a></h1>
          <nav id="navbar" className={`navbar order-last order-lg-0 ${mobileMenuOpen ? 'navbar-mobile' : ''}`}>
            <ul class>
              <li><a href="/hero" onClick={(e) => {
                e.preventDefault();
                scrollToSection(heroSectionRef);
                if (mobileMenuOpen) {
                  toggleMobileMenu();
                }
              }}>Почетна</a></li>
              <li><a href="status/" onClick={(e) => {
                e.preventDefault();
                scrollToSection(statusRef);
                if (mobileMenuOpen) {
                  toggleMobileMenu();
                }
              }}>Статус</a></li>
              <li><a href="/order" onClick={(e) => {
                e.preventDefault();
                scrollToSection(orderRef);
                if (mobileMenuOpen) {
                  toggleMobileMenu();
                }
              }}>Поруџбина</a></li>
              <li><a href="/doc" onClick={(e) => {
                e.preventDefault();
                scrollToSection(docRef);
                if (mobileMenuOpen) {
                  toggleMobileMenu();
                }
              }}>Преглед</a></li>



              {/* <li className={`dropdown`} onClick={handleDropdownClick}>
              <a href="#">
                Администрација<i className="bi bi-chevron-down"></i>
              </a>
              <ul class >


                <li className={`dropdown`} onClick={handleDropdownClick}>
                  <a href="#">
                  ХР ШИФАРНИЦИ <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul class>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Тип запосленог</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Запослени</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Орг. структура</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Систематизација</a></li>
                  </ul>
                </li>

                <li className={`dropdown`} onClick={handleDropdownClick}>
                  <a href="#">
                  АДМИНИСТРАЦИЈА ЕЛЕМЕНАТА<i className="bi bi-chevron-right"></i>
                  </a>
                  <ul class>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Тип артикла</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Група артикала</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Артикал</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Тип цене</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Цена</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Типови докумената</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Врста документа</a></li>                    
                  </ul>
                </li>

                <li className={`dropdown`} onClick={handleDropdownClick}>
                  <a href="#">
                  ОБРАДА <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul class>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Документи</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Бифе</a></li>
                  </ul>
                </li>

                <li className={`dropdown`} onClick={handleDropdownClick}>
                  <a href="#">
                  ИЗВЕШТАВАЉЕ <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul class>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Лагер листа</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Листа задужења</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Извештај 3</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Извештај 4</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Извештај 5</a></li>
                  </ul>
                </li>
              </ul>
            </li>
            */}
              <li><a href="#" onClick={(e) => {
                handleOvlascenjeClick(e);
                // scrollToSection(docRef);
                if (mobileMenuOpen) {
                  toggleMobileMenu();
                }
              }}>Овлашћење</a></li>
            </ul>

            <i className={`bi mobile-nav-toggle ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`} onClick={toggleMobileMenu}></i>
          </nav>
          {/* <a href="/order" className="book-a-table-btn scrollto d-none d-lg-flex"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(orderRef);
              if (mobileMenuOpen) {
                toggleMobileMenu();
              }
            }
            }
          >Поруџбина</a> */}




          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', "padding-right": "20px", "padding-top": "8px" }} >
            <div style={{ "padding-right": "5px" }}>
              <i className="pi pi-bell p-overlay-badge" style={{ fontSize: '2rem', color: '#cda45e' }}>
                {brojPoruka == '0' ? (null) : (<Badge value={brojPoruka} severity="danger"></Badge>)}
              </i>
            </div>
            <div>
              <span style={{ color: "rgb(205, 164, 94)" }}>{`${user.firstname} ${user.lastname || ''}`}</span>
            </div>
            <div>
              <Avatar size="large" icon="pi pi-user" shape="circle" className="p-overlay-badge" image={slika} >
                {/* {brojPoruka=='0'?(null):(<Badge value={brojPoruka} severity="danger"></Badge>)} */}
              </Avatar>
            </div>
          </div>

        </div>
      </header>
      <Dialog
        header={translations[selectedLanguage].Zamena}
        visible={coffZapVisible}
        style={{ width: '50%' }}
        onHide={() => {
          setCoffZaplinkLVisible(false);
          setShowMyComponent(false);
        }}
      >
        {showMyComponent && (
          <CoffZamL
            parameter={"inputTextValue"}
            coffZap={coffZap}
            handleDialogClose={handleDialogClose}
            setCoffZaplinkLVisible={setCoffZaplinkLVisible}
            user={user}
            stVisible={false}
            dialog={true}
          />
        )}
      </Dialog>
    </>
  );
};

export default Header;

