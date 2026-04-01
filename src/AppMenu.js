import React, { createRef, forwardRef, useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { Ripple } from 'primereact/ripple';
import { Badge } from 'primereact/badge';

const AppSubmenu = forwardRef((props, ref) => {
    const [activeIndex, setActiveIndex] = useState(null);
    const resolvedActiveIndex = props.root && props.accordionMode ? props.controlledActiveIndex : activeIndex;

    const setResolvedActiveIndex = (index) => {
        if (props.root && props.accordionMode) {
            props.onControlledActiveIndexChange?.(index);
            return;
        }

        setActiveIndex(index);
    };

    const onMenuItemClick = (event, item, index) => {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
            if (!item.to && !item.url && !item.items) {
                event.preventDefault();
            }
        }
        if (item.items) {
            event.preventDefault();
        }
        if (props.root) {
            props.onRootMenuItemClick({
                originalEvent: event,
                item,
                index
            });
        }
        if (item.items) {
            if (props.root && props.accordionMode) {
                props.onSidebarExpand?.();
                setResolvedActiveIndex(index);
            } else {
                setResolvedActiveIndex(index === resolvedActiveIndex ? null : index);
            }
        } else if (props.root && props.accordionMode && item.to === '/') {
            props.onSidebarCollapse?.();
            setResolvedActiveIndex(null);
        }

        props.onMenuItemClick({
            originalEvent: event,
            item: item
        });
    };

    const onMenuItemMouseEnter = (index) => {
        if (props.accordionMode) {
            return;
        }

        if (props.root && props.menuActive && isHorizontalOrSlim() && !isMobile()) {
            setResolvedActiveIndex(index);
        }
    };

    const isMobile = () => {
        return window.innerWidth <= 1025;
    };

    const isHorizontalOrSlim = useCallback(() => {
        return props.layoutMode === 'horizontal' || props.layoutMode === 'slim';
    }, [props.layoutMode]);

    const isSlim = useCallback(() => {
        return props.layoutMode === 'slim';
    }, [props.layoutMode]);

    const visible = (item) => {
        return typeof item.visible === 'function' ? item.visible() : item.visible !== false;
    };

    const getLink = (item, index) => {
        const menuitemIconClassName = classNames('layout-menuitem-icon', item.icon);
        const content = (
            <>
                <i className={menuitemIconClassName}></i>
                <span className="layout-menuitem-text">{item.label}</span>
                {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                {item.badge && <Badge value={item.badge} />}
                <Ripple />
            </>
        );
        const commonLinkProps = {
            style: item.style,
            className: classNames(item.class, 'p-ripple', {
                'p-disabled': item.disabled,
                'p-link': !item.to
            }),
            target: item.target,
            onClick: (e) => onMenuItemClick(e, item, index),
            onMouseEnter: () => onMenuItemMouseEnter(index)
        };

        if (item.url) {
            return (
                <a href={item.url} rel="noopener noreferrer" {...commonLinkProps}>
                    {content}
                </a>
            );
        } else if (!item.to) {
            return (
                <button type="button" {...commonLinkProps}>
                    {content}
                </button>
            );
        }

        return (
            <NavLink to={item.to} {...commonLinkProps} className={({ isActive }) => classNames(commonLinkProps.className, isActive ? 'active-menuitem-routelink' : undefined)}>
                {content}
            </NavLink>
        );
    };

    const isMenuActive = (item, index) => {
        if (!item.items) {
            return false;
        }

        if (props.root && props.accordionMode) {
            return props.sidebarExpanded && resolvedActiveIndex === index;
        }

        return props.root && (!isSlim() || (isSlim() && (props.mobileMenuActive || resolvedActiveIndex !== null))) ? true : resolvedActiveIndex === index;
    };

    const getItems = () => {
        const transitionTimeout = props.mobileMenuActive ? 0 : isSlim() && props.root ? { enter: 0, exit: 0 } : props.root ? 0 : { enter: 1000, exit: 450 };
        return props.items.map((item, i) => {
            if (visible(item)) {
                const submenuRef = createRef();
                const isActiveItem = props.root && props.accordionMode ? resolvedActiveIndex === i : activeIndex === i;
                const menuitemClassName = classNames({
                    'layout-root-menuitem': props.root,
                    'has-submenu': !!item.items,
                    'active-menuitem': isActiveItem && !item.disabled
                });
                const rootMenuItem = props.root && !props.accordionMode && item.items ? <div className="layout-menuitem-root-text">{item.label}</div> : null;
                const link = getLink(item, i);
                const tooltip = (
                    <div className="layout-menu-tooltip">
                        <div className="layout-menu-tooltip-arrow"></div>
                        <div className="layout-menu-tooltip-text">{item.label}</div>
                    </div>
                );

                return (
                    <li key={item.label || i} className={menuitemClassName} role="menuitem">
                        {rootMenuItem}
                        {link}
                        {tooltip}
                        <CSSTransition nodeRef={submenuRef} classNames="p-toggleable-content" timeout={transitionTimeout} in={isMenuActive(item, i)} unmountOnExit>
                            <AppSubmenu ref={submenuRef} items={visible(item) && item.items} menuActive={props.menuActive} layoutMode={props.layoutMode} parentMenuItemActive={resolvedActiveIndex === i} onMenuItemClick={props.onMenuItemClick} accordionMode={props.accordionMode} sidebarExpanded={props.sidebarExpanded}></AppSubmenu>
                        </CSSTransition>
                    </li>
                );
            }

            return null;
        });
    };

    useEffect(() => {
        if (!props.menuActive && isHorizontalOrSlim() && !(props.root && props.accordionMode)) {
            setActiveIndex(null);
        }
    }, [props.menuActive, isHorizontalOrSlim, props.root, props.accordionMode]);

    if (!props.items) {
        return null;
    }

    const items = getItems();
    return (
        <ul ref={ref} className={props.className} role="menu">
            {items}
        </ul>
    );
});

const AppMenu = (props) => {
    return (
        <div className="app-sidebar-menu">
            <button
                type="button"
                className="sidebar-collapse-toggle p-ripple"
                onClick={props.sidebarExpanded ? props.onSidebarCollapse : props.onSidebarExpand}
            >
                    <i className="pi pi-bars"></i>
                    <Ripple />
            </button>
            <AppSubmenu
                items={props.model}
                className="layout-menu"
                menuActive={props.active}
                onRootMenuItemClick={props.onRootMenuItemClick}
                mobileMenuActive={props.mobileMenuActive}
                onMenuItemClick={props.onMenuItemClick}
                root
                layoutMode={props.layoutMode}
                parentMenuItemActive
                accordionMode={props.accordionMode}
                sidebarExpanded={props.sidebarExpanded}
                onSidebarExpand={props.onSidebarExpand}
                onSidebarCollapse={props.onSidebarCollapse}
                controlledActiveIndex={props.activeRootIndex}
                onControlledActiveIndexChange={props.onActiveRootIndexChange}
            />
        </div>
    );
};

export default AppMenu;
