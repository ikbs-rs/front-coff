import React from 'react';
import { translations } from '../configs/translations';
import EmpA from "../components/model/empA"

const EmptyPage = () => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>{translations[selectedLanguage].Ticketing_system} </h5>
                        <p>{translations[selectedLanguage]._eptyPage}</p>
                    </div>
                </div>
            </div>
            <div>
                <EmpA />
            </div>
        </>
    );
};

export default EmptyPage;
