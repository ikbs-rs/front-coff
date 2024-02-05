import React from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';

const AppConfig = (props) => {
    const topbarColors = [
        { label: 'layout-topbar-light', logo: 'logo-roma', color: '#ffffff' },
        { label: 'layout-topbar-dark', logo: 'logo-roma-white', color: '#252529' },
        { label: 'layout-topbar-blue', logo: 'logo-roma-white', color: '#0772B3' },
        { label: 'layout-topbar-green', logo: 'logo-roma-white', color: '#0F8C50' },
        { label: 'layout-topbar-orange', logo: 'logo-roma-white', color: '#C76D09' },
        { label: 'layout-topbar-magenta', logo: 'logo-roma-white', color: '#972BB1' },
        { label: 'layout-topbar-bluegrey', logo: 'logo-roma-white', color: '#406E7E' },
        { label: 'layout-topbar-deeppurple', logo: 'logo-roma-white', color: '#543CD9' },
        { label: 'layout-topbar-brown', logo: 'logo-roma-white', color: '#794F36' },
        { label: 'layout-topbar-lime', logo: 'logo-roma-white', color: '#849201' },
        { label: 'layout-topbar-rose', logo: 'logo-roma-white', color: '#8F3939' },
        { label: 'layout-topbar-cyan', logo: 'logo-roma-white', color: '#0C8990' },
        { label: 'layout-topbar-teal', logo: 'logo-roma-white', color: '#337E59' },
        { label: 'layout-topbar-deeporange', logo: 'logo-roma-white', color: '#D74A1D' },
        { label: 'layout-topbar-indigo', logo: 'logo-roma-white', color: '#3D53C9' },
        { label: 'layout-topbar-pink', logo: 'logo-roma-white', color: '#BF275B' },
        { label: 'layout-topbar-purple', logo: 'logo-roma-white', color: '#7F32DA' }
    ];

    const themeColors = [
        { label: 'blue', color: '#0f97c7' },
        { label: 'green', color: '#10B163' },
        { label: 'orange', color: '#E2841A' },
        { label: 'magenta', color: '#B944D6' },
        { label: 'bluegrey', color: '#578697' },
        { label: 'deeppurple', color: '#6952EC' },
        { label: 'brown', color: '#97664A' },
        { label: 'lime', color: '#A5B600' },
        { label: 'rose', color: '#AB5353' },
        { label: 'cyan', color: '#1BA7AF' },
        { label: 'teal', color: '#4EA279' },
        { label: 'deeporange', color: '#F96F43' },
        { label: 'indigo', color: '#435AD8' },
        { label: 'pink', color: '#E93A76' },
        { label: 'purple', color: '#9643F9' }
    ];

    const onTopbarColorChange = (topbarColor, logo) => {
        props.onTopbarColorChange(topbarColor);
        const topbarLogoLink = document.getElementById('topbar-logo');
        //topbarLogoLink.src = 'assets/layout/images/' + logo + '.svg';
    };

    const onThemeChange = (theme) => {
        props.onThemeChange(theme);
        changeStyleSheetUrl('layout-css', theme, 'layout');
        changeStyleSheetUrl('theme-css', theme, 'theme');
    };

    const changeStyleSheetUrl = (id, value, prefix) => {
        let element = document.getElementById(id);
        let urlTokens = element.getAttribute('href').split('/');
        urlTokens[urlTokens.length - 1] = prefix + '-' + value + '.css';
        let newURL = urlTokens.join('/');

        replaceLink(element, newURL);
    };

    const replaceLink = (linkElement, href) => {
        const id = linkElement.getAttribute('id');
        const cloneLinkElement = linkElement.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

        cloneLinkElement.addEventListener('load', () => {
            linkElement.remove();
            const _linkElement = document.getElementById(id);
            _linkElement && _linkElement.remove();
            cloneLinkElement.setAttribute('id', id);
        });
    };

    const getTopbarColors = () => {
        return (
            <div className="layout-themes topbar-colors">
                {topbarColors.map((t) => {
                    return (
                        <div key={t.label}>
                            <button type="button" className="p-link layout-config-option-color" style={{ cursor: 'pointer', backgroundColor: t.color }} onClick={() => onTopbarColorChange(t.label, t.logo)} title={t.label}>
                                {props.topbarColor === t.label && <i className="pi pi-check"></i>}
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    const getComponentThemes = () => {
        return (
            <div className="layout-themes">
                {themeColors.map((t) => {
                    return (
                        <div key={t.label}>
                            <button type="button" className="p-link layout-config-option-color" style={{ cursor: 'pointer', backgroundColor: t.color }} onClick={() => onThemeChange(t.label)} title={t.label}>
                                {props.theme === t.label && <i className="pi pi-check"></i>}
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    const componentThemesElement = getComponentThemes();
    const topbarColorsElement = getTopbarColors();
    const configClassName = classNames('layout-config', { 'layout-config-active': props.configActive });
    return (
        <div id="layout-config" className={configClassName} onClick={props.onConfigClick}>
            <button type="button" className="layout-config-button p-link" id="layout-config-button" onClick={(e) => props.onConfigButtonClick(e)}>
                <i className="pi pi-cog"></i>
            </button>

            <div className="layout-config-header">
                <h3>Theme Customization</h3>
                <span>Roma offers different themes for layout, topbar, menu etc.</span>
            </div>

            <div className="layout-config-content">
                <div className="layout-config-section options">
                    <span className="section-name">Menu Mode</span>
                    <div className="formgroup-inline menu-type grid grid-nogutter">
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="static" name="layoutMode" value="static" checked={props.layoutMode === 'static'} onChange={(e) => props.onLayoutModeChange(e.value)} />
                            <label htmlFor="static">Static</label>
                        </div>
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="overlay" name="layoutMode" value="overlay" checked={props.layoutMode === 'overlay'} onChange={(e) => props.onLayoutModeChange(e.value)} />
                            <label htmlFor="overlay">Overlay</label>
                        </div>
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="horizontal" name="layoutMode" value="horizontal" checked={props.layoutMode === 'horizontal'} onChange={(e) => props.onLayoutModeChange(e.value)} />
                            <label htmlFor="horizontal">Horizontal</label>
                        </div>
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="slim" name="layoutMode" value="slim" checked={props.layoutMode === 'slim'} onChange={(e) => props.onLayoutModeChange(e.value)} />
                            <label htmlFor="slim">Slim</label>
                        </div>
                    </div>
                </div>

                <div className="layout-config-section options">
                    <span className="section-name">Menu Color</span>
                    <div className="formgroup-inline grid grid-nogutter">
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="dark" name="layoutColorMode" value={false} checked={!props.lightMenu} onChange={(e) => props.onMenuColorChange(e.value)} />
                            <label htmlFor="dark">Dark</label>
                        </div>
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="light" name="layoutColorMode" value={true} checked={props.lightMenu} onChange={(e) => props.onMenuColorChange(e.value)} />
                            <label htmlFor="light">Light</label>
                        </div>
                    </div>
                </div>

                <div className="layout-config-section options">
                    <span className="section-name">User Profile</span>
                    <div className="formgroup-inline grid grid-nogutter">
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="inline" name="inlineUser" value={true} checked={props.inlineUser} disabled={props.layoutMode === 'horizontal'} onChange={(e) => props.onProfileModeChange(e.value)} />
                            <label htmlFor="inline">Inline</label>
                        </div>
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="overlayUser" name="inlineUser" value={false} checked={!props.inlineUser} disabled={props.layoutMode === 'horizontal'} onChange={(e) => props.onProfileModeChange(e.value)} />
                            <label htmlFor="overlayUser">Overlay</label>
                        </div>
                    </div>
                </div>

                <div className="layout-config-section options">
                    <span className="section-name">Input Background</span>
                    <div className="formgroup-inline">
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="input_outlined" name="inputstyle" value="outlined" checked={props.inputStyle === 'outlined'} onChange={(e) => props.onInputStyleChange(e.value)} />
                            <label htmlFor="input_outlined">Outlined</label>
                        </div>
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="input_filled" name="inputstyle" value="filled" checked={props.inputStyle === 'filled'} onChange={(e) => props.onInputStyleChange(e.value)} />
                            <label htmlFor="input_filled">Filled</label>
                        </div>
                    </div>
                </div>

                <div className="layout-config-section dark">
                    <span className="section-name">Ripple Effect</span>
                    <InputSwitch checked={props.rippleActive} onChange={props.onRippleChange} />
                </div>

                <div className="layout-config-section options">
                    <span className="section-name">Orientation</span>
                    <div className="formgroup-inline grid grid-nogutter">
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="ltr" name="isRTL" value={false} checked={!props.isRTL} onChange={(e) => props.onOrientationChange(e.value)} />
                            <label htmlFor="ltr">LTR</label>
                        </div>
                        <div className="field-radiobutton md:col-6">
                            <RadioButton inputId="rtl" name="isRTL" value={true} checked={props.isRTL} onChange={(e) => props.onOrientationChange(e.value)} />
                            <label htmlFor="rtl">RTL</label>
                        </div>
                    </div>
                </div>

                <div className="layout-config-section colors">
                    <span className="section-name">Topbar Colors</span>
                    {topbarColorsElement}
                </div>

                <div className="layout-config-section colors">
                    <span className="section-name">Component Themes</span>
                    {componentThemesElement}
                </div>
            </div>
        </div>
    );
};

export default AppConfig;
