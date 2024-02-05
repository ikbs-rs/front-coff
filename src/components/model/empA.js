import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { DataView } from 'primereact/dataview';
import { translations } from '../../configs/translations';
import Event from './ticEventProdajaL';
import Doc from './ticDocL';

export default function EmpA() {
    const navigate = useNavigate();
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const [products, setProducts] = useState([]);
    const [layout] = useState('grid');
    const rootDir = '/tic'

    const localProducts = [
        {
            id: 1,
            name: 'Reservation',
            image: 'rez.jpg'
        },
        {
            id: 2,
            name: 'Bill',
            image: 'rac.png'
        },
        {
            id: 3,
            name: 'Sales',
            image: 'prod.jpg'
        },
        {
            id: 4,
            name: 'Tmp',
            image: 'tmp.jpg'
        }
    ];

    useEffect(() => {
        setProducts(localProducts);
    }, []);

    const f1 = (param) => {
        console.log('Funkcija f1 je pozvana sa parametrom:', param);
        switch (param) {
            case 4:
                navigate('/eventprodaja');
                break;            
            case 3:
                navigate('/sal');
                break;            
            case 2:
                navigate('/doc?docVr=RC');
                break;
            case 1:
                navigate('/doc?docVr=RZ');
                break;
            default:
                break;
        }
    };

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2 clickable-item" onClick={() => f1(product.id)}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={`${rootDir}/images/${product.image}`} alt={product.name} />
                        <div className="text-2xl font-bold">{translations[selectedLanguage]?.[product.name] || product.name}</div>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }
        return gridItem(product);
    };

    return (
        <>
            <div className="card">
                <DataView value={products} itemTemplate={itemTemplate} layout={layout} />
                <style jsx>{`
                    .clickable-item {
                        cursor: pointer;
                    }
                    .clickable-item:hover img,
                    .clickable-item:hover .text-2xl {
                        opacity: 0.6;
                    }
                `}</style>
            </div>

            <div className="layout-content">
                <Routes>
                    <Route path="/eventprodaja" element={<Event />} />
                    <Route path="/doc" element={<Doc />} />
                </Routes>
            </div>
        </>
    );
}
