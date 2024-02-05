import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export const Access = () => {
    const navigate = useNavigate();

    return (
        <div className="exception-body accessdenied">
            <div className="exception-panel">
                <div className="exception-content">
                    <img src="assets/layout/images/pages/icon-access.svg" alt="roma" />
                    <h1>Access Denied</h1>
                    <p>You do not have the necessary permissons.</p>

                    <Button
                        label="Go To Dashboard"
                        icon="pi pi-arrow-left"
                        onClick={() => {
                            navigate('/');
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
