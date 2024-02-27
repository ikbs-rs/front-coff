// src/components/HeroSection.js
import React from 'react';
import './Index.css'; // Pretpostavimo da imate CSS fajl za stilizovanje

const HeroSection = ({scrollToSection, menuRef, orderedRef}) => {
  // Funkcija za upravljanje klikom na dugme, ako je potrebno
  const handleMenuClick = () => {
    // Implementacija navigacije do sekcije menija
  };

  const handleBookTableClick = () => {
    // Implementacija navigacije do sekcije za rezervaciju
  };

  const openPopup = (url, width, height) => {
    // Izračunajte položaj središta ekrana
    console.log("Otvaram prozor 01")
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const left = (windowWidth - width) / 2;
    const top = (windowHeight - height) / 2;
    
    // Otvorite novi prozor sa određenim dimenzijama i položajem
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
              <button onClick={(e) => {e.preventDefault(); scrollToSection(menuRef);}} className="btn-menu animated fadeInUp scrollto">Поруџбина</button>
              <button onClick={(e) => {e.preventDefault(); scrollToSection(orderedRef);}} className="btn-book animated fadeInUp scrollto">Резервација сале</button>
            </div>
          </div>
          <div className="col-lg-4 d-flex align-items-center justify-content-center position-relative" data-aos="zoom-in" data-aos-delay="200">
            <a onClick={() => openPopup('https://www.youtube.com/watch?v=u6BOC7CDUTQ', 800, 600)} className="glightbox play-btn"></a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
