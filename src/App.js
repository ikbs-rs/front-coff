import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import AppTopbar from './AppTopbar';
import AppFooter from './AppFooter';
import AppConfig from './AppConfig';
import AppMenu from './AppMenu';
import AppRightMenu from './AppRightMenu';
import './index.css';

import Discount from './components/model/ticDiscountL';
import Condtp from './components/model/ticCondtpL';
import DiscountTp from './components/model/ticDiscounttpL';
import PrivilegeTp from './components/model/ticPrivilegetpL';
import Privilege from './components/model/ticPrivilegeL';
import Doc from './components/model/ticDocL';
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
import SeattpAtt from './components/model/ticSeattpattL';
import SeatTp from './components/model/ticSeattpL';
import Atest from './components/model/1test';
import Sal from './components/model/ticSal';

import Event from './components/model/ticEventL';
import EventProdaja from './components/model/ticEventProdajaL';
import Transaction from './components/model/ticTransactionL';
import Delivery from './components/model/ticDocdeliveryL';
import EmptyPage from './pages/EmptyPage';
import ObjW from './components/model/ticCmnW';

import PrimeReact from 'primereact/api';
import { Tooltip } from 'primereact/tooltip';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';
import env from "./configs/env"
import { useDispatch } from 'react-redux';
import { setLanguage } from './store/actions';
import { translations } from "./configs/translations";
import TicArtgrp from './components/model/ticArtgrp';

const App = () => {
    const dispatch = useDispatch();
    const urlParams = new URLSearchParams(window.location.search);
    let selectedLanguage = localStorage.getItem('sl')
    //let selectedLanguage = urlParams.get('sl');
    const [layoutMode, setLayoutMode] = useState('static');
    const [lightMenu, setLightMenu] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [staticMenuMobileActive, setStaticMenuMobileActive] = useState(false);
    const [staticMenuDesktopInactive, setStaticMenuDesktopInactive] = useState(false);
    const [isRTL, setIsRTL] = useState(false);
    const [inlineUser, setInlineUser] = useState(false);
    const [topbarMenuActive, setTopbarMenuActive] = useState(false);
    const [activeTopbarItem, setActiveTopbarItem] = useState(null);
    const [rightPanelMenuActive, setRightPanelMenuActive] = useState(null);
    const [inlineUserMenuActive, setInlineUserMenuActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [topbarColor, setTopbarColor] = useState('layout-topbar-blue');
    const [theme, setTheme] = useState('blue');
    const [configActive, setConfigActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('filled');
    const [ripple, setRipple] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();
    const inlineUserRef = useRef();

     const menu = [
        {
            label: translations[selectedLanguage].Code_books,
            icon: 'pi pi-fw pi-bars',
            items: [
                //{ label: translations[selectedLanguage].Sales_channels, icon: 'pi pi-fw pi-calendar', to: '/action' },
                {
                    label: translations[selectedLanguage].Settings_seats,
                    icon: 'pi pi-fw pi-bars',
                    items: [
                        { label: translations[selectedLanguage].Seat_type, icon: 'pi pi-fw pi-calendar', to: '/seattp' },
                       // { label: translations[selectedLanguage].Seats, icon: 'pi pi-fw pi-calendar', to: '/seat'  },
                        { label: translations[selectedLanguage].Properties_seat, icon: 'pi pi-fw pi-calendar' , to: '/seattpatt'}
                    ]
                },
                {
                    label: translations[selectedLanguage].Privileges,
                    icon: 'pi pi-fw pi-bars',
                    items: [
                        { label: translations[selectedLanguage].Privilege_type, icon: 'pi pi-fw pi-calendar', to: '/privilegetp' },
                        { label: translations[selectedLanguage].Privileges, icon: 'pi pi-fw pi-calendar', to: '/privilege'  },
                        { label: translations[selectedLanguage].Discount_type, icon: 'pi pi-fw pi-calendar' , to: '/discounttp'},
                        { label: translations[selectedLanguage].Discount, icon: 'pi pi-fw pi-calendar' , to: '/discount'},
                        { label: translations[selectedLanguage].Conditional, icon: 'pi pi-fw pi-calendar' , to: '/condtp'}
                    ]
                },
                {
                    label: translations[selectedLanguage].Objects_administration,
                    icon: 'pi pi-cog',
                    items: [
                        { action: 'objtpMenu', label: translations[selectedLanguage].Objects_type, icon: 'pi pi-clone', to: '/objtp' },
                        { action: 'pobjMenu', label: translations[selectedLanguage].ObjectsXPK, icon: 'pi pi-fw pi-clone', to: '/objpk/XPK' },
                        { action: 'pobjMenu', label: translations[selectedLanguage].ObjectsXPM, icon: 'pi pi-fw pi-clone', to: '/objpm/XPM' },
                        { action: 'pobjMenu', label: translations[selectedLanguage].ObjectsXTCTP, icon: 'pi pi-fw pi-clone', to: '/objtctp/XTCTP' },
                        { action: 'pobjMenu', label: translations[selectedLanguage].ObjectsXDOC, icon: 'pi pi-fw pi-clone', to: '/objdoc/XDOC' },
                        { action: 'pobjMenu', label: translations[selectedLanguage].ObjectsXBL, icon: 'pi pi-fw pi-clone', to: '/objdoc/XBL' },
                        { action: 'pobjMenu', label: translations[selectedLanguage].Objects, icon: 'pi pi-fw pi-clone', to: '/obj/-1' },                      
                        { action: 'objattMenu', label: translations[selectedLanguage].Properties_object, icon: 'pi pi-fw pi-clone', to: '/objatt' },
                        { action: 'objatttpMenu', label: translations[selectedLanguage].Group_of_properties, icon: 'pi pi-fw pi-clone', to: '/objatttp' },
                        //{ action: 'linkMenu', label: translations[selectedLanguage].Type_of_relationship, icon: 'pi pi-fw pi-exclamation-triangle', to: '/link' },
                        //{ action: 'objtreeMenu', label: translations[selectedLanguage].ObjectsTree, icon: 'pi pi-fw pi-clone', to: '/objtree' },
                        // { action: 'objconMenu', label: translations[selectedLanguage].ObjCon, icon: 'pi pi-fw pi-clone', to: '/objcon' },
                        // { action: 'objdMenu', label: translations[selectedLanguage].ObjectsD, icon: 'pi pi-fw pi-clone', to: '/objd' },
                    ]
                },
                {
                    label: translations[selectedLanguage].Events_administration,
                    icon: 'pi pi-fw pi-cog',
                    items: [
                        { label: translations[selectedLanguage].Eventctg, icon: 'pi pi-fw pi-th-large', to: '/eventctg' },
                        { label: translations[selectedLanguage].Event_type, icon: 'pi pi-fw pi-table', to: '/eventtp' },
                        { label: translations[selectedLanguage].Eventatt_type, icon: 'pi pi-fw pi-table', to: '/eventatttp' },
                        { label: translations[selectedLanguage].Properties_event, icon: 'pi pi-fw pi-align-right', to: '/eventatt'  },
                        { label: translations[selectedLanguage].Agenda_type, icon: 'pi pi-fw pi-table' , to: '/agendatp'},
                        { label: translations[selectedLanguage].Agenda, icon: 'pi pi-fw pi-align-justify' , to: '/agenda'},
                        { label: translations[selectedLanguage].Season, icon: 'pi pi-fw pi-sun' , to: '/season'}
                    ]
                },
                {
                    label: translations[selectedLanguage].Processing_elements,
                    icon: 'pi pi-wrench',
                    items: [
                        { label: translations[selectedLanguage].Item_type, icon: 'pi pi-database', to: '/arttp' },
                        { label: translations[selectedLanguage].Groups_of_items, icon: 'pi pi-fw pi-clone', to: '/artgrp' },
                        { label: translations[selectedLanguage].Item, icon: 'pi pi-fw pi-clone', to: '/art' },
                        { label: translations[selectedLanguage].Price_types, icon: 'pi pi-fw pi-clone', to: '/cenatp' },
                        { label: translations[selectedLanguage].Price, icon: 'pi pi-fw pi-exclamation-triangle', to: '/cena' }
                    ]
                },
                {
                    label: translations[selectedLanguage].Documents_administration,
                    icon: 'pi pi-fw pi-bars',
                    items: [
                        { label: translations[selectedLanguage].Species_documents, icon: 'pi pi-fw pi-calendar' , to: '/docvr'},
                        { label: translations[selectedLanguage].Document_types, icon: 'pi pi-fw pi-calendar' , to: '/doctp'}
                    ]
                }
            ]
        },
        {
            // label: translations[selectedLanguage].Processing,
            // icon: 'pi pi-fw pi-bars',
            // items: [
            //     {
                    label: translations[selectedLanguage].Event_processing,
                    icon: 'pi pi-prime',
                    items: [
                        { label: translations[selectedLanguage].Events, icon: 'pi pi-database', to: '/event' },
                        { label: translations[selectedLanguage].Document, icon: 'pi pi-fw pi-clone', to: '/doc' },
                        { label: translations[selectedLanguage].Transaction, icon: 'pi pi-fw pi-book', to: '/transaction' },
                        { label: translations[selectedLanguage].Delivery, icon: 'pi pi-fw pi-truck', to: '/delivery' },
                    ]
            //     }
            // ]
        },
        {
            label: translations[selectedLanguage].Reporting,
            icon: 'pi pi-fw pi-bars',
            items: [
                {
                    label: translations[selectedLanguage].Reports,
                    icon: 'pi pi-file-pdf',
                    items: [
                        { label: translations[selectedLanguage].Test, icon: 'pi pi-database', to: '/atest' }
                    ]
                },
                {
                    label: translations[selectedLanguage].Reports,
                    icon: 'pi pi-chart-bar',
                    items: [
                        { label: translations[selectedLanguage].Report, icon: 'pi pi-chart-bar', to: '/izv2' }
                    ]
                }
            ]
        },        
        {
            label: translations[selectedLanguage].Moduleselection,
            icon: 'pi pi-fw pi-compass',
            items: [
                { label: translations[selectedLanguage].Back, icon: 'pi pi-sign-out', url: `${env.START_URL}?sl=${selectedLanguage}` }
            ]
        }
    ];


    let topbarItemClick;
    let menuClick;
    let rightMenuClick;
    let userMenuClick;
    let configClick = false;

    useEffect(() => {      
      if (selectedLanguage) {
        dispatch(setLanguage(selectedLanguage)); // Postavi jezik iz URL-a u globalni store
      }
    }, [dispatch]);

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

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRippleChange = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onDocumentClick = () => {
        if (!topbarItemClick) {
            setActiveTopbarItem(null);
            setTopbarMenuActive(false);
        }

        if (!rightMenuClick) {
            setRightPanelMenuActive(false);
        }

        if (!userMenuClick && isSlim() && !isMobile()) {
            setInlineUserMenuActive(false);
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

        if (configActive && !configClick) {
            setConfigActive(false);
        }

        topbarItemClick = false;
        menuClick = false;
        rightMenuClick = false;
        userMenuClick = false;
        configClick = false;
    };

    const onMenuButtonClick = (event) => {
        menuClick = true;
        setTopbarMenuActive(false);
        setRightPanelMenuActive(false);

        if (layoutMode === 'overlay') {
            setOverlayMenuActive((prevOverlayMenuActive) => !prevOverlayMenuActive);
        }

        if (isDesktop()) setStaticMenuDesktopInactive((prevStaticMenuDesktopInactive) => !prevStaticMenuDesktopInactive);
        else {
            setStaticMenuMobileActive((prevStaticMenuMobileActive) => !prevStaticMenuMobileActive);
            if (staticMenuMobileActive) {
                blockBodyScroll();
            } else {
                unblockBodyScroll();
            }
        }

        event.preventDefault();
    };

    const onTopbarMenuButtonClick = (event) => {
        topbarItemClick = true;
        setTopbarMenuActive((prevTopbarMenuActive) => !prevTopbarMenuActive);
        hideOverlayMenu();
        event.preventDefault();
    };

    const onTopbarItemClick = (event) => {
        topbarItemClick = true;

        if (activeTopbarItem === event.item) setActiveTopbarItem(null);
        else setActiveTopbarItem(event.item);

        event.originalEvent.preventDefault();
    };

    const onMenuClick = () => {
        menuClick = true;
    };

    const onInlineUserClick = () => {
        userMenuClick = true;
        setInlineUserMenuActive((prevInlineUserMenuActive) => !prevInlineUserMenuActive);
        setMenuActive(false);
    };

    const onConfigClick = () => {
        configClick = true;
    };

    const onConfigButtonClick = () => {
        setConfigActive((prevConfigActive) => !prevConfigActive);
        configClick = true;
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

    const onRightMenuButtonClick = (event) => {
        rightMenuClick = true;
        setRightPanelMenuActive((prevRightPanelMenuActive) => !prevRightPanelMenuActive);

        hideOverlayMenu();

        event.preventDefault();
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

    const onRootMenuItemClick = () => {
        setMenuActive((prevMenuActive) => !prevMenuActive);
        setInlineUserMenuActive(false);
    };

    const isDesktop = () => {
        return window.innerWidth > 896;
    };

    const isMobile = () => {
        return window.innerWidth <= 1025;
    };

    const isHorizontal = () => {
        return layoutMode === 'horizontal';
    };

    const isSlim = () => {
        return layoutMode === 'slim';
    };

    const onLayoutModeChange = (layoutMode) => {
        setLayoutMode(layoutMode);
        setStaticMenuDesktopInactive(false);
        setOverlayMenuActive(false);

        if (layoutMode === 'horizontal' && inlineUser) {
            setInlineUser(false);
        }
    };

    const onMenuColorChange = (menuColor) => {
        setLightMenu(menuColor);
    };

    const onThemeChange = (theme) => {
        setTheme(theme);
    };

    const onProfileModeChange = (profileMode) => {
        setInlineUser(profileMode);
    };

    const onOrientationChange = (orientation) => {
        setIsRTL(orientation);
    };

    const onTopbarColorChange = (color) => {
        setTopbarColor(color);
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
            'p-ripple-disabled': !ripple
        },
        topbarColor
    );

    const inlineUserTimeout = layoutMode === 'slim' ? 0 : { enter: 1000, exit: 450 };

    return (
        <div className={layoutClassName} onClick={onDocumentClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar
                topbarMenuActive={topbarMenuActive}
                activeTopbarItem={activeTopbarItem}
                inlineUser={inlineUser}
                onRightMenuButtonClick={onRightMenuButtonClick}
                onMenuButtonClick={onMenuButtonClick}
                onTopbarMenuButtonClick={onTopbarMenuButtonClick}
                onTopbarItemClick={onTopbarItemClick}
            />

            <AppRightMenu rightPanelMenuActive={rightPanelMenuActive} onRightMenuClick={onRightMenuClick}></AppRightMenu>

            <div className="layout-menu-container"  onClick={onMenuClick} >
                {inlineUser && (
                    <div className="layout-profile">
                        <button type="button" className="p-link layout-profile-button" onClick={onInlineUserClick}>
                            <img src="assets/layout/images/avatar.png" alt="roma-layout" />
                            <div className="layout-profile-userinfo">
                                <span className="layout-profile-name">Arlene Welch</span>
                                <span className="layout-profile-role">Design Ops</span>
                            </div>
                        </button>
                        <CSSTransition nodeRef={inlineUserRef} classNames="p-toggleable-content" timeout={inlineUserTimeout} in={inlineUserMenuActive} unmountOnExit>
                            <ul ref={inlineUserRef} className={classNames('layout-profile-menu', { 'profile-menu-active': inlineUserMenuActive })}>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-user"></i>
                                        <span>Profile</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-cog"></i>
                                        <span>Settings</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-envelope"></i>
                                        <span>Messages</span>
                                    </button>
                                </li>
                                <li>
                                    <button type="button" className="p-link">
                                        <i className="pi pi-fw pi-bell"></i>
                                        <span>Notifications</span>
                                    </button>
                                </li>
                            </ul>
                        </CSSTransition>
                    </div>
                )}
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} layoutMode={layoutMode} active={menuActive} mobileMenuActive={staticMenuMobileActive} />
            </div>

            <div className="layout-main">
                <div className="layout-content">
                    <Routes>
                        <Route path="/" element={<EmptyPage />} />
                        
                        <Route path="/seattpatt" element={<SeattpAtt />} />
                        <Route path="/seattp" element={<SeatTp />} />
                        <Route path="/discounttp" element={<DiscountTp />} />
                        <Route path="/privilegetp" element={<PrivilegeTp />} />
                        <Route path="/privilege" element={<Privilege />} />
                        <Route path="/discount" element={<Discount />} />
                        <Route path="/condtp" element={<Condtp />} />

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
                        <Route path="/event" element={<Event />} />
                        <Route path="/eventprodaja" element={<EventProdaja />} />
                        <Route path="/doc" element={<Doc />} />
                        <Route path="/doctp" element={<DocTp />} />
                        <Route path="/docvr" element={<DocVr />} />
                        <Route path="/eventtp" element={<EventTP />} />
                        <Route path="/eventctg" element={<EventCtg />} />
                        <Route path="/eventatttp" element={<EventAtttp />} />
                        <Route path="/eventatt" element={<EventAtt />} />
                        <Route path="/agendatp" element={<AgendaTp />} />
                        <Route path="/agenda" element={<Agenda />} />
                        <Route path="/season" element={<Season />} /> 
                        <Route path="/art" element={<Art />} />
                        <Route path="/artgrp" element={<ArtGrp />} />
                        <Route path="/arttp" element={<ArtTp />} />
                        <Route path="/cena" element={<Cena />} />
                        <Route path="/cenatp" element={<CenaTp />} />
                        <Route path="/docvr" element={<DocVr />} />
                        <Route path="/transaction" element={<Transaction />} />
                        <Route path="/delivery" element={<Delivery />} />

                        <Route path="/atest" element={<Atest />} />
                        <Route path="/sal" element={<Sal />} />
                    </Routes>
                </div>

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
                ></AppConfig>

                <AppFooter />
            </div>

            <div className="layout-content-mask"></div>
        </div>
    );
};

export default App;
