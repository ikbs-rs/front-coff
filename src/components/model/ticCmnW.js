import React from 'react';
import { translations } from '../../configs/translations';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import env from "../../configs/env"

const TicCmnW = (params) => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const { objtpCode: routeObjTpCode } = useParams();
    const objtpCode = routeObjTpCode;
    const location = useLocation();
    const key = location.pathname;
    const keyArray = key.split('/'); 
    const desiredElement = keyArray[1];
    const objId = 1;
    let url = `${env.CMN_URL}?endpoint=${params.endpoint}&objcode=${desiredElement}&tp=${objtpCode}&objid=${objId}&sl=${selectedLanguage}`
    //console.log(keyArray, "*****************params*******************", params, "***************params*************", url)

    return (
        <>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <iframe
                            src={url}
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

export default TicCmnW;