import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import AppFooter from './AppFooter';
// import AppConfig from './AppConfig';
import AppMenu from './AppMenu';
import AppRightMenu from './AppRightMenu';
import './index.css';

import Zaptp from './components/model/coffZaptpL';
import Zap from './components/model/coffZapL';
import Saporg from './components/model/sapOrgl';
import Zapcoff from './components/model/sapZapcoffL';
import DocW from './components/model/coffDocW';
import Coff from './components/model/coffee';
import DocTp from './components/model/ticDoctpL';
import DocVr from './components/model/ticDocvrL';
import EventAtttp from './components/model/ticEventatttpL';
import EventAtt from './components/model/ticEventattL';
import EventCtg from './components/model/ticEventctgL';
import EventTP from './components/model/ticEventtpL';
import AgendaTp from './components/model/ticAgendatpL';
import Agenda from './components/model/ticAgendaL';
import Season from './components/model/ticSeasonL';
import Art from './components/model/ticArtL';
import ArtGrp from './components/model/ticArtgrpL';
import ArtTp from './components/model/ticArttpL';
import Cena from './components/model/ticCenaL';
import CenaTp from './components/model/ticCenatpL';
import Um from './components/model/cmn/cmnUmL';

import Izv01 from './components/model/coffIzv01L';
import Stanje from './components/model/coffIzv01StanjeL';
import Kartica from './components/model/coffIzv01Kartica';

import Atest from './components/model/1test';
import Sal from './components/model/ticSal';

import EmptyPage from './pages/EmptyPage';
import ObjW from './components/model/ticCmnW';

import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';
import { useDispatch } from 'react-redux';
import { setLanguage } from './store/actions';
import { translations } from "./configs/translations";
import WsComponent from './components/model/wsComponent';
// import WebSocketService from './utilities/WebSocketService';
// import WebSocketManager from './utilities/WebSocketManager';
import { WebSocketProvider } from './utilities/WebSocketContext';

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const selectedLanguage = localStorage.getItem('sl') || 'sr_cyr';
    const layoutMode = 'slim';
    const lightMenu = false;
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
    const staticMenuDesktopInactive = false;
    const isRTL = false;
    const [rightPanelMenuActive, setRightPanelMenuActive] = useState(null);
    const [menuActive, setMenuActive] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [activeRootIndex, setActiveRootIndex] = useState(null);
    const topbarColor = 'layout-topbar-blue';
    const inputStyle = 'filled';
    const ripple = false;
    const copyTooltipRef = useRef();
    const location = useLocation();

    let menuClick;
    let rightMenuClick;

    const findRootIndexByPath = (menuItems, path) => {
        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];

            if (item.to === path) {
                return i;
            }

            if (item.items?.length) {
                const hasMatch = item.items.some((child) => {
                    if (child.to === path) {
                        return true;
                    }

                    return child.items?.some((grandChild) => grandChild.to === path);
                });

                if (hasMatch) {
                    return i;
                }
            }
        }

        return null;
    };

    const findMenuLabelByRoute = useCallback((menuItems, route) => {
        for (const item of menuItems) {
            if (item.to === route) {
                return item.label;
            }

            if (item.items?.length) {
                const nestedLabel = findMenuLabelByRoute(item.items, route);
                if (nestedLabel) {
                    return nestedLabel;
                }
            }
        }

        return null;
    }, []);

    // useEffect(() => {
    //     WebSocketService.connect();

    //     return () => {
    //         console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    //     //   WebSocketService.disconnect();
    //     };
    //   }, []);

    useEffect(() => {
        if (selectedLanguage) {
            dispatch(setLanguage(selectedLanguage)); // Postavi jezik iz URL-a u globalni store
        }
    }, [dispatch, selectedLanguage]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    useEffect(() => {
        if (staticMenuMobileActive) {
            blockBodyScroll();
        } else {
            unblockBodyScroll();
        }
    }, [staticMenuMobileActive]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("token");
        sessionStorage.removeItem("isLoggedIn");
        navigate('/login');
    }, [navigate]);

    const menuModel = useMemo(() => ([
        { label: translations[selectedLanguage].Home, icon: 'pi pi-fw pi-home', to: `/` },
        {
            label: translations[selectedLanguage].HR_books,
            icon: 'pi pi-fw pi-database',
            items: [
                { label: translations[selectedLanguage].Zap_type, icon: 'pi pi-fw pi-calendar', to: '/zaptp' },
                { label: translations[selectedLanguage].Zap, icon: 'pi pi-fw pi-calendar', to: '/zap' },
                { label: translations[selectedLanguage].SAP_ORG, icon: 'pi pi-fw pi-calendar', to: '/saporg' },
                { label: translations[selectedLanguage].SAP_ZAP, icon: 'pi pi-fw pi-calendar', to: '/zapcoff' },
            ]
        },
        {
            label: translations[selectedLanguage].Administration_elements,
            icon: 'pi pi-wrench',
            items: [
                { label: translations[selectedLanguage].Um, icon: 'pi pi-database', to: '/um' },
                { label: translations[selectedLanguage].Item_type, icon: 'pi pi-database', to: '/arttp' },
                { label: translations[selectedLanguage].Groups_of_items, icon: 'pi pi-fw pi-clone', to: '/artgrp' },
                { label: translations[selectedLanguage].Item, icon: 'pi pi-fw pi-clone', to: '/art' },
                { label: translations[selectedLanguage].Price_types, icon: 'pi pi-fw pi-clone', to: '/cenatp' },
                { label: translations[selectedLanguage].Price, icon: 'pi pi-fw pi-exclamation-triangle', to: '/cena' },
                { label: translations[selectedLanguage].Document_types, icon: 'pi pi-fw pi-calendar', to: '/doctp' },
                { label: translations[selectedLanguage].Species_documents, icon: 'pi pi-fw pi-calendar', to: '/docvr' },
            ]
        },
        {
            label: translations[selectedLanguage].Processing,
            icon: 'pi pi-cog',
            items: [
                { label: translations[selectedLanguage].Prijem_dokumenta, icon: 'pi pi-fw pi-clone', to: '/doc/2?docVr=ZAD' },
                { label: translations[selectedLanguage].Porudzbine, icon: 'pi pi-fw pi-clone', to: '/doc/1?docVr=ORD' },
                { label: translations[selectedLanguage].Rashod, icon: 'pi pi-fw pi-clone', to: '/doc/1754623618111115264?docVr=RH' },
                { label: translations[selectedLanguage].Pocetno_stanje, icon: 'pi pi-fw pi-clone', to: '/doc/1754623246252511232?docVr=PS' },
                { label: translations[selectedLanguage].Prenos, icon: 'pi pi-fw pi-clone', to: '/doc/2037973410487078912?docVr=PRN' },
                { label: translations[selectedLanguage].Visak, icon: 'pi pi-fw pi-clone', to: '/doc/1754623711912529920?docVr=VI' },
                { label: translations[selectedLanguage].Manjak, icon: 'pi pi-fw pi-clone', to: '/doc/1754623869450588160?docVr=MNJ' },
                { label: translations[selectedLanguage].Rezervacija, icon: 'pi pi-fw pi-clone', to: '/doc/1683550132932841472?docVr=RZ' },               
            ]
        },
        {
            label: translations[selectedLanguage].Reporting,
            icon: 'pi pi-fw pi-print',
            items: [
                {
                    label: translations[selectedLanguage].Reports,
                    icon: 'pi pi-file-pdf',
                    items: [
                        { label: translations[selectedLanguage].Pregled, icon: 'pi pi-database', to: '/izv01' },
                        { label: translations[selectedLanguage].Stanje, icon: 'pi pi-database', to: '/stanje' },
                    ]
                }
            ]
        },
        {
            label: translations[selectedLanguage].Logout,
            icon: 'pi pi-fw pi-power-off',
            command: () => {
                handleLogout();
            }
        }
    ]), [selectedLanguage, handleLogout]);

    const currentDocMenuLabel = useMemo(() => {
        return findMenuLabelByRoute(menuModel, `${location.pathname}${location.search}`) || findMenuLabelByRoute(menuModel, location.pathname);
    }, [findMenuLabelByRoute, menuModel, location.pathname, location.search]);

    useEffect(() => {
        if (location.pathname === '/') {
            setSidebarExpanded(false);
            setActiveRootIndex(null);
            setMenuActive(false);
            return;
        }

        const nextRootIndex = findRootIndexByPath(menuModel, location.pathname);
        if (nextRootIndex !== null) {
            setSidebarExpanded(true);
            setActiveRootIndex(nextRootIndex);
            setMenuActive(true);
        }
    }, [location.pathname, menuModel]);

    const onDocumentClick = () => {
        if (!rightMenuClick) {
            setRightPanelMenuActive(false);
        }

        if (!menuClick) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false);
            }

            if (overlayMenuActive || staticMenuMobileActive) {
                hideOverlayMenu();
            }

            unblockBodyScroll();
        }
        menuClick = false;
        rightMenuClick = false;
    };

    const onMenuClick = () => {
        menuClick = true;
    };

    const blockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };

    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };

    const onRightMenuClick = () => {
        rightMenuClick = true;
    };

    const hideOverlayMenu = () => {
        setOverlayMenuActive(false);
        setStaticMenuMobileActive(false);
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            hideOverlayMenu();
        }
        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false);
        }
    };

    const onRootMenuItemClick = (event) => {
        if (event?.item?.items) {
            setSidebarExpanded(true);
            setActiveRootIndex(event.index);
            setMenuActive(true);
            return;
        }

        if (event?.item?.to === '/') {
            setSidebarExpanded(false);
            setActiveRootIndex(null);
            setMenuActive(false);
            return;
        }

        setMenuActive((prevMenuActive) => !prevMenuActive);
    };

    const isHorizontal = () => {
        return layoutMode === 'horizontal';
    };

    const isSlim = () => {
        return layoutMode === 'slim';
    };

    const layoutClassName = classNames(
        'layout-wrapper',
        {
            'layout-horizontal': layoutMode === 'horizontal',
            'layout-overlay': layoutMode === 'overlay',
            'layout-static': layoutMode === 'static',
            'layout-slim': layoutMode === 'slim',
            'layout-menu-light': lightMenu,
            'layout-menu-dark': !lightMenu,
            'layout-overlay-active': overlayMenuActive,
            'layout-mobile-active': staticMenuMobileActive,
            'layout-static-inactive': staticMenuDesktopInactive,
            'layout-rtl': isRTL,
            'p-input-filled': inputStyle === 'filled',
            'p-ripple-disabled': !ripple,
            'accordion-sidebar': true,
            'accordion-sidebar-expanded': sidebarExpanded
        },
        topbarColor
    );

    return (
        <WebSocketProvider>
            <div className={layoutClassName} onClick={onDocumentClick}>

                <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
                {/* 
            <AppTopbar
                topbarMenuActive={topbarMenuActive}
                activeTopbarItem={activeTopbarItem}
                inlineUser={inlineUser}
                onRightMenuButtonClick={onRightMenuButtonClick}
                onMenuButtonClick={onMenuButtonClick}
                onTopbarMenuButtonClick={onTopbarMenuButtonClick}
                onTopbarItemClick={onTopbarItemClick}
            /> 
            */}

                <AppRightMenu rightPanelMenuActive={rightPanelMenuActive} onRightMenuClick={onRightMenuClick}></AppRightMenu>

                <div className="layout-menu-container" onClick={onMenuClick} >
                    <AppMenu
                        model={menuModel}
                        onMenuItemClick={onMenuItemClick}
                        onRootMenuItemClick={onRootMenuItemClick}
                        layoutMode={layoutMode}
                        active={sidebarExpanded || menuActive}
                        mobileMenuActive={staticMenuMobileActive}
                        accordionMode
                        sidebarExpanded={sidebarExpanded}
                        onSidebarExpand={() => {
                            setSidebarExpanded(true);
                            setMenuActive(true);
                        }}
                        onSidebarCollapse={() => {
                            setSidebarExpanded(false);
                            setActiveRootIndex(null);
                            setMenuActive(false);
                        }}
                        activeRootIndex={activeRootIndex}
                        onActiveRootIndexChange={setActiveRootIndex}
                    />
                </div>

                <div className="layout-main">
                    <div className={classNames('layout-content', { 'home-layout-content': location.pathname === '/' })}>
                        <Routes>
                            <Route path="/" element={<EmptyPage />} />


                            <Route path="/zaptp" element={<Zaptp />} />
                            <Route path="/zap" element={<Zap />} />
                            <Route path="/saporg" element={<Saporg />} />
                            <Route path="/zapcoff" element={<Zapcoff />} />

                            <Route path="/izv01" element={<Izv01 />} />
                            <Route path="/stanje" element={<Stanje />} />
                            <Route path="/kartica" element={<Kartica />} />
                            <Route path="/wsc" element={<WsComponent />} />

                            <Route path="/objtp" element={<ObjW endpoint="objtpend" />} />
                            <Route path="/objpk/:objtpCode" element={<ObjW endpoint="objend" />} />
                            <Route path="/objpm/:objtpCode" element={<ObjW endpoint="objend" />} />
                            <Route path="/objorg/:objtpCode" element={<ObjW endpoint="objend" />} />
                            <Route path="/objtctp/:objtpCode" element={<ObjW endpoint="objend" />} />
                            <Route path="/objdoc/:objtpCode" element={<ObjW endpoint="objend" />} />
                            <Route path="/obj/:objtpCode" element={<ObjW endpoint="objend" />} />
                            <Route path="/objatt" element={<ObjW endpoint="objattend" />} />
                            <Route path="/objatttp" element={<ObjW endpoint="objatttpend" />} />

                            <Route path="/usergrp" element={<EventAtt />} />
                            <Route path="/action" element={<EventAtt />} />

                            {/* <Route path="/doc1" element={<Doc1 doctp={1} />} />
                        <Route path="/doc2" element={<Doc2 doctp={2} />} /> */}

                            <Route path="/doc/:doctp" element={<DocW docLabel={currentDocMenuLabel} />} />

                            <Route path="/coff" element={<Coff />} />
                            <Route path="/doctp" element={<DocTp />} />
                            <Route path="/eventtp" element={<EventTP />} />
                            <Route path="/eventctg" element={<EventCtg />} />
                            <Route path="/eventatttp" element={<EventAtttp />} />
                            <Route path="/eventatt" element={<EventAtt />} />
                            <Route path="/agendatp" element={<AgendaTp />} />
                            <Route path="/agenda" element={<Agenda />} />
                            <Route path="/season" element={<Season />} />
                            <Route path="/artgrp" element={<ArtGrp />} />
                            <Route path="/arttp" element={<ArtTp />} />
                            <Route path="/art" element={<Art />} />
                            <Route path="/cena" element={<Cena />} />
                            <Route path="/cenatp" element={<CenaTp />} />
                            <Route path="/docvr" element={<DocVr />} />
                            <Route path="/um" element={<Um />} />

                            <Route path="/atest" element={<Atest />} />
                            <Route path="/sal" element={<Sal />} />
                            <Route path="/public/assets/img/" element={<Sal />} />

                        </Routes>
                    </div>
                    {/* 
                <AppConfig
                    configActive={configActive}
                    onConfigClick={onConfigClick}
                    onConfigButtonClick={onConfigButtonClick}
                    rippleActive={ripple}
                    onRippleChange={onRippleChange}
                    inputStyle={inputStyle}
                    onInputStyleChange={onInputStyleChange}
                    theme={theme}
                    onThemeChange={onThemeChange}
                    topbarColor={topbarColor}
                    onTopbarColorChange={onTopbarColorChange}
                    inlineUser={inlineUser}
                    onProfileModeChange={onProfileModeChange}
                    isRTL={isRTL}
                    onOrientationChange={onOrientationChange}
                    layoutMode={layoutMode}
                    onLayoutModeChange={onLayoutModeChange}
                    lightMenu={lightMenu}
                    onMenuColorChange={onMenuColorChange}
                ></AppConfig> */}

                    <AppFooter />
                </div>

                <div className="layout-content-mask"></div>

            </div>
        </WebSocketProvider>
    );
};

export default App;
