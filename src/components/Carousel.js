import React, { useState, useEffect, useRef } from 'react';
import { Galleria } from 'primereact/galleria';
import { Sale } from './json/Sale.js';
import './Index.css';

const Carousel = (orderedRef) => {
  const [images, setImages] = useState(null);
  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '960px',
      numVisible: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  useEffect(() => {
    Sale.getImages().then(data => setImages(data));
  }, []);

  const itemTemplate = (item) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', objectFit: 'cover' }} />
  }

  const caption = (item) => {
    return (
      <React.Fragment>
        <button onClick={(e) => { e.preventDefault(); alert(`Резервација сале ${item.alt}`) }} className="sala-button">Резервација сале</button>
        <div className="text-xl mb-2 font-bold">{item.title}</div>
        <p className="text-white">{item.alt}</p>
      </React.Fragment>
    );
  }

  const thumbnailTemplate = (item) => {
    return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: 'block' }} />
  }

  return (
    <div className="card" style={{ backgroundColor: "#000000" }}>
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Сале</h2>
          {/* <p>Check Our Tasty Menu</p> */}
        </div>
        <Galleria value={images} responsiveOptions={responsiveOptions} numVisible={5} style={{ width: '100%' }}
          thumbnailsPosition={"right"} item={itemTemplate} thumbnail={thumbnailTemplate} circular autoPlay transitionInterval={2500} caption={caption}

        />
      </div>
    </div>

  )
}

export default Carousel;
