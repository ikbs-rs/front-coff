import React from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import DocL from './coffDocL';

const CoffDocW = () => {
    const { doctp: routeDoctp } = useParams();
    const doctp = routeDoctp;
    const location = useLocation();
    const key = location.pathname;

    return <DocL key={key} doctp={doctp} />;
};

export default CoffDocW;
