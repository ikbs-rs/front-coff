import React, { useState, useEffect } from 'react';
import { ProductService } from './service/ProductService';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';

export default function CoffeeV() {
    const [products, setProducts] = useState([]);
    const [layout, setLayout] = useState('grid');

    useEffect(() => {
        ProductService.getProducts().then((data) => setProducts(data.slice(0, 12)));
    }, []);

    const f1 = (param) => {
        console.log('Funkcija f1 je pozvana sa parametrom:', param);
    }

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-1 lg:col-12 xl:col-2 p-2 clickable-item" style={{ minWidth: '150px' }} onClick={() => f1(product.id)}>
                <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`} alt={product.name} />
                    <div className="text-1xl">{product.name}</div>
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
    )
}

