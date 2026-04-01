// src/components/Header.js
import React, { useEffect, useState } from 'react';
import './Index.css';
import { Badge } from 'primereact/badge';
import { translations } from "../configs/translations";
import CoffZamL from './model/coffZaplinkL';
import { Dialog } from 'primereact/dialog';
import { AdmUserService } from "../service/model/cmn/AdmUserService";
import { Avatar } from 'primereact/avatar';
import { buildKitchenSubscriptionMessage, isOrderChangedMessage, useWebSocket } from '../utilities/WebSocketContext';
import { CoffDocService } from "../service/model/CoffDocService";
import env from '../configs/env';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null') || {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

const Header = ({ scrollToSection, heroSectionRef, aboutRef, statusRef, orderRef, docRef }) => {
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const userId = localStorage.getItem('userId') || -1
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [coffZap] = useState({});
  const [user, setUser] = useState(getStoredUser);
  const [coffZapVisible, setCoffZaplinkLVisible] = useState(false);
  const [slika, setSlika] = useState('');
  const [brojPoruka, setBrojPoruka] = useState(0);
  const [userCoffId, setUserCoffId] = useState(undefined);
  const [userCoffCandidates, setUserCoffCandidates] = useState([]);
  const websocket = useWebSocket();

  const resolveAssignedCoffCandidates = (value) => {
    const normalizedValue = Array.isArray(value) ? value[0] || null : value;
    const candidates = [
      normalizedValue?.coff,
      normalizedValue?.obj,
      normalizedValue?.id,
      normalizedValue?.code,
      normalizedValue?.CODE,
      normalizedValue?.coffcode,
      normalizedValue?.objcode,
    ]
      .map((item) => (item === null || item === undefined ? '' : String(item).trim()))
      .filter(Boolean);

    return [...new Set(candidates)];
  };

  const resolveAssignedCoffId = (value) => resolveAssignedCoffCandidates(value)[0] ?? null;

  const refreshBrojPoruka = async () => {
    try {
      if (userId && userId !== '-1' && userCoffId === undefined) {
        return;
      }

      if (!userCoffId) {
        setBrojPoruka(0);
        return;
      }

      const coffDocService = new CoffDocService();
      const data = await coffDocService.getCoffDocsCountTp(1, userCoffId);
      const count = Number(data?.count ?? data ?? 0);

      setBrojPoruka(Number.isNaN(count) ? 0 : count);
    } catch (error) {
      if (error.response?.status === 403) {
        setBrojPoruka(0);
        return;
      }

      console.error('refreshBrojPoruka error', error);
      setBrojPoruka(0);
    }
  };

  useEffect(() => {
    refreshBrojPoruka();
  }, [userCoffId]);

  useEffect(() => {
    async function fetchUserCoff() {
      try {
        const coffDocService = new CoffDocService();
        const data = await coffDocService.getCoffDocsUserCoff(userId, 'COFFLOC');
        const nextCandidates = resolveAssignedCoffCandidates(data);
        setUserCoffCandidates(nextCandidates);
        setUserCoffId(nextCandidates[0] ?? null);
      } catch (error) {
        console.error(error);
        setUserCoffCandidates([]);
        setUserCoffId(null);
      }
    }

    if (userId && userId !== '-1') {
      fetchUserCoff();
    } else {
      setUserCoffCandidates([]);
      setUserCoffId(null);
    }
  }, [userId]);

  useEffect(() => {
    if (!websocket || userCoffId === undefined || userCoffCandidates.length === 0) {
      return undefined;
    }

    const subscribeToKitchen = () => {
      if (websocket.readyState === WebSocket.OPEN) {
        userCoffCandidates.forEach((candidate) => {
          websocket.send(buildKitchenSubscriptionMessage({
            objId: candidate,
            objTp: 'COFFLOC',
            userId,
            username: user?.username ?? user?.USERNAME ?? null
          }));
        });
      }
    };

    subscribeToKitchen();
    websocket.addEventListener('open', subscribeToKitchen);

    return () => {
      websocket.removeEventListener('open', subscribeToKitchen);
    };
  }, [websocket, userCoffId, userCoffCandidates, userId, user?.username, user?.USERNAME]);

  useEffect(() => {
    if (!websocket) {
      return undefined;
    }

    const handleMessage = async (message) => {
      try {
        if (isOrderChangedMessage(message)) {
          await refreshBrojPoruka();
        }
      } catch (error) {
        console.error(error);
      }
    };

    websocket.addEventListener('message', handleMessage);

    return () => {
      websocket.removeEventListener('message', handleMessage);
    };
  }, [websocket, userCoffId, userId]);

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
    async function fetchUser() {
      try {
        const admUserService = new AdmUserService();
        const data = await admUserService.getAdmUser(userId);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setSlika(`${env.COFF_URL}assets/img/zap/${data.id}.jpg`);
      } catch (error) {
        console.error(error);
      }
    }

    fetchUser();
  }, [userId]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDialogClose = () => {};

  return (
    <>
      <header id="header" className={`fixed-top d-flex align-items-center ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between" style={{ "max-width": "100%" }}>
          {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }} /> */}
          <h1 className="logo me-auto me-lg-0"><a href="/" onClick={(e) => { e.preventDefault(); scrollToSection(heroSectionRef); }} style={{ "padding-left": "50px" }}>ЕМС - БИФЕ </a></h1>
          <nav id="navbar" className={`navbar order-last order-lg-0 ${mobileMenuOpen ? 'navbar-mobile' : ''}`}>
            <ul>
              <li><a href="/hero" onClick={(e) => {
                e.preventDefault();
                scrollToSection(heroSectionRef);
                if (mobileMenuOpen) {
                  toggleMobileMenu();
                }
              }}>Почетна</a></li>
              {/* <li><a href="status/" onClick={(e) => {
                e.preventDefault();
                scrollToSection(statusRef);
                if (mobileMenuOpen) {
                  toggleMobileMenu();
                }
              }}>Статус</a></li> */}
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
              {/* <li><a href="#" onClick={(e) => {
                handleOvlascenjeClick(e);
                // scrollToSection(docRef);
                if (mobileMenuOpen) {
                  toggleMobileMenu();
                }
              }}>Овлашћење</a></li> */}
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
                {brojPoruka === 0 || brojPoruka === '0' ? null : (
                  <Badge 
                    value={brojPoruka} 
                    severity="danger"
                    onClick={(e) => {
                      e.preventDefault(); 
                      scrollToSection(docRef); 
                    }} 
                    style={{ cursor: 'pointer' }}              
                    >
                    </Badge>)}
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

