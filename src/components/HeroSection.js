// src/components/HeroSection.js
import React from 'react';
import './Index.css'; // Pretpostavimo da imate CSS fajl za stilizovanje

const HeroSection = ({ scrollToSection, orderedRef, carouselRef }) => {
  const openPopup = (url, width, height) => {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const left = (windowWidth - width) / 2;
    const top = (windowHeight - height) / 2;

    window.open(url, '_blank', 'width=' + width + ', height=' + height + ', left=' + left + ', top=' + top);
  };

  return (
    <section id="hero" className="d-flex align-items-center">
      <div className="container position-relative text-center text-lg-start" data-aos="zoom-in" data-aos-delay="100">
        <div className="row">
          <div className="col-lg-8">
            <h1>Добродошли у <span>Бифе ЕМС ад</span></h1>
            <h2>Са вама од почетка више од 50 година!</h2>

            <div className="btns">
              <button onClick={(e) => {e.preventDefault(); scrollToSection(orderedRef);}} className="btn-menu animated fadeInUp scrollto">Поруџбина</button>
              <button onClick={(e) => {e.preventDefault(); scrollToSection(carouselRef);}} className="btn-book animated fadeInUp scrollto">Резервација сале</button>
            </div>
          </div>
          <div className="col-lg-4 d-flex align-items-center justify-content-center position-relative" data-aos="zoom-in" data-aos-delay="200">
            <button
              type="button"
              onClick={() => openPopup('https://www.youtube.com/embed/rVb400kUX5Q?autoplay=1&vq=hd720', 800, 600)}
              className="glightbox play-btn"
              aria-label="Pusti promotivni video"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
