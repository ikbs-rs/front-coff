import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

export const Error = () => {
    const navigate = useNavigate();

    return (
        <div className="exception-body error">
            <div className="exception-panel">
                <div className="exception-content">
                    <img src="assets/layout/images/pages/icon-error.svg" alt="roma" />
                    <h1>Error Occured</h1>
                    <p>Something went wrong.</p>
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
