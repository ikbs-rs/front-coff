import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import DocL from './coffDocL';

const CoffDocW = (props) => {
    const { doctp: routeDoctp } = useParams();
    const doctp = routeDoctp;
    const location = useLocation();
    const docVr = new URLSearchParams(location.search).get('docVr') || '';
    const key = `${location.pathname}${location.search}`;

    return <DocL key={key} doctp={doctp} docVr={docVr} docLabel={props.docLabel} />;
};

export default CoffDocW;
