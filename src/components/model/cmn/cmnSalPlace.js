import React from 'react';
import { translations } from '../../../configs/translations';

const cmnSalPlace = (props) => {
    console.log(props, "++++++++++++++++++++++++cmnSalPlace++++++++++++++++++++++++++++++++")
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <iframe
                            src={`https://82.117.213.106/sal/wizard/?locid${props.locId}&parent=ADM`}
                            title="Sal iframe"
                            width="100%"
                            height="760px"
                            frameBorder="0"
                            // scrolling="no"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    );
};

export default cmnSalPlace;