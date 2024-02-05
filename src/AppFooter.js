import React from 'react';

const AppFooter = () => {
    return (
        <div className="layout-footer">
            <div>
                <img src="assets/layout/images/logo-ikbs.svg" alt="IKBS" />
                <p>IKBS Solutions</p>
            </div>
            <div className="footer-icons">
                <button type="button" className="p-link">
                    <i className="pi pi-home"></i>
                </button>
                <button type="button" className="p-link">
                    <i className="pi pi-globe"></i>
                </button>
                <button type="button" className="p-link">
                    <i className="pi pi-envelope"></i>
                </button>
            </div>
        </div>
    );
};

export default AppFooter;
