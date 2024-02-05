import React from 'react';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { translations } from "./configs/translations";

const AppTopbar = (props) => {
    const navigate = useNavigate();
    let selectedLanguage = localStorage.getItem('sl')||'en'

    const onTopbarItemClick = (event, item) => {
        if (props.onTopbarItemClick) {
            props.onTopbarItemClick({
                originalEvent: event,
                item: item
            });
        }
    };

    return (        
        <div className="layout-topbar" >
            <button type="button" className="p-link layout-right-panel-button layout-topbar-icon" onClick={props.onRightMenuButtonClick}>
                <i className="pi pi-ellipsis-v" style={{ fontSize: 16 }}></i>
            </button>

            <button type="button" className="p-link layout-menu-button layout-topbar-icon" onClick={props.onMenuButtonClick}>
                <i className="pi pi-bars" style={{ fontSize: 20 }}></i>
            </button>

            <button type="button" className="p-link layout-topbar-logo" onClick={() => navigate('/')}>
                <span className="layout-profile-name" style={{ color: "#ffffff", fontSize: 16 }}>{translations[selectedLanguage].Ticketing_system}</span>
            </button>

            <ul className="topbar-menu" style={{paddingTop: '9px'}}>
                <li className={classNames('user-profile', { 'active-topmenuitem fadeInDown': props.activeTopbarItem === 'profile' })}>
                {!props.inlineUser && (
                        <button type="button" className="p-link" onClick={(e) => onTopbarItemClick(e, 'profile')}>
                            <div className="layout-profile-userinfo">
                                <span className="layout-profile-name">Arlene Welch</span>
                            </div>
                        </button>
                    )}

                    <ul className="fadeInDown">
                        <li role="menuitem">
                            <button type="button" className="p-link">
                                <i className="pi pi-fw pi-user"></i>
                                <span>Profile</span>
                            </button>
                        </li>
                        <li role="menuitem">
                            <button type="button" className="p-link">
                                <i className="pi pi-fw pi-cog"></i>
                                <span>Settings</span>
                            </button>
                        </li>
                        <li role="menuitem">
                            <button type="button" className="p-link">
                                <i className="pi pi-fw pi-envelope"></i>
                                <span>Messages</span>
                            </button>
                        </li>
                        <li role="menuitem">
                            <button type="button" className="p-link">
                                <i className="pi pi-fw pi-bell"></i>
                                <span>Notifications</span>
                            </button>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};

export default AppTopbar;
