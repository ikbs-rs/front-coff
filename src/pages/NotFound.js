import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="exception-body notfound">
            <div className="exception-panel">
                <div className="exception-content">
                    <img src="assets/layout/images/pages/icon-404.svg" alt="roma" />
                    <h1>Page Not Found</h1>
                    <p>Requested resource is not available.</p>
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
