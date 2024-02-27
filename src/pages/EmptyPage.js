import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../configs/translations';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import About from '../components/About';
import Menu from '../components/Menu';
import Tab from '../components/Tab';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import OrderL from '../components/model/ticEventattsgrpL';
import Ordermenu from '../components/Ordermenu';
import StatsCounter from '../components/StatsCounter'

import { useNavigate, useLocation } from 'react-router-dom';

const EmptyPage = () => {
    const selectedLanguage = localStorage.getItem('sl') || 'en';
    const heroSectionRef = useRef(null);
    const aboutRef = useRef(null);
    const menuRef = useRef(null);
    const orderRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        // Postavljanje atributa na <body> tag
        document.body.setAttribute('monica-version', '4.7.6');
        document.body.setAttribute('monica-id', 'ofpnmcalabcbjgholdjcjblkibolbppb');
        document.body.dataset.aosEasing = 'ease-in-out';
        document.body.dataset.aosDuration = '1000';
        document.body.dataset.aosDelay = '0';
    }, []);

    const scrollToSection = (sectionRef) => {
        window.scrollTo({
            top: sectionRef.current.offsetTop,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <TopBar />
            <Header scrollToSection={scrollToSection} heroSectionRef={heroSectionRef} aboutRef={aboutRef} menuRef={menuRef} orderRef={orderRef} />
            <div ref={heroSectionRef}><HeroSection scrollToSection={scrollToSection} menuRef={menuRef} orderedRef={orderRef} /></div>
            <div ><About /></div>   
            <div ref={menuRef} className=""><StatsCounter/> </div>              
            <div ref={orderRef} className="menuheight">
                <div className="row " data-aos="fade-up" data-aos-delay="100" >
                    <div className={`col-lg-8 menu-item `}>
                        <Ordermenu />
                    </div>
                    <div className={`col-lg-4 menu-item `}>                        
                        <Tab />
                    </div>                  
                </div>
            </div>
            <div ref={menuRef} className="menuheight"><Menu /></div>    
                    
        </>
    );
};

export default EmptyPage;
