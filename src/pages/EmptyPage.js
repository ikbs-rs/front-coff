import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../configs/translations';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import About from '../components/About';
import Carousel from '../components/Carousel';
import AboutDoc from '../components/AboutDoc';
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
    const docRef = useRef(null);
    const statusRef = useRef(null);
    const carouselRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const [dataTab, setDataTab] = useState('1');

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

    const handleDataUpdate = (updatedTab) => {
        setDataTab(updatedTab);
    };


    return (
        <>
            <TopBar />
            <Header scrollToSection={scrollToSection} heroSectionRef={heroSectionRef} aboutRef={aboutRef} menuRef={menuRef} orderRef={orderRef} statusRef={statusRef} docRef={docRef} carouselRef={carouselRef} />
            <div ref={heroSectionRef}><HeroSection scrollToSection={scrollToSection} menuRef={menuRef} orderedRef={orderRef} carouselRef={carouselRef} /></div>
            <div ref={aboutRef}><About /></div>

            <div ref={orderRef} className="menuheight">
                <div className="row " data-aos="fade-up" data-aos-delay="100" >
                    <div className={`col-lg-8 menu-item `}>
                        <Ordermenu onDataUpdate={handleDataUpdate} />
                    </div>
                    <div className={`col-lg-4 menu-item `}>
                        <Tab dataTab={dataTab} onDataUpdate={handleDataUpdate} />
                    </div>
                </div>
            </div>
            <div ref={statusRef} className=""><StatsCounter /> </div>

            <div ref={carouselRef} className="menuheight">
                <div className="row " data-aos="fade-up" data-aos-delay="100" >
                    <div className={`col-lg-9 menu-item `}>
                        <Carousel />
                    </div>
                    <div className={`col-lg-3 menu-item `}>
                        <div className="card" style={{ backgroundColor: "#000000", opacity: "0.7" }}>
                            <div className="container" data-aos="fade-up">
                                <div className="section-title">
                                    <h2>Мисија и визија</h2>
                                </div>
                                <p className="text-white">
                                    <h1>Мисија</h1>
                                    <p>
                                        Сигуран и поуздан пренос електричне енергије, ефикасно управљање преносним системом повезаним са
                                        електроенергетским системима других земаља, оптималан и одржив развој преносног система у циљу
                                        задовољења потреба корисника и друштва у целини, обезбеђивање функционисања и развоја тржишта
                                        електричне енергије у Републици Србији и његово интегрисање у регионално и европско тржиште електричне енергије.
                                    </p>
                                    <h1>Визија</h1>
                                    <p>
                                        Регионални лидер који одговорно и ефикасно обавља функције оператора преносног система у
                                        Републици Србији, унапређујући своје пословање, с циљем достизања највиших стандарда уз примену
                                        принципа одрживог развоја и високе друштвене одговорности.
                                    </p>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={docRef} ><AboutDoc dataTab={dataTab} onDataUpdate={handleDataUpdate} /></div>
            {/* <div ref={menuRef} className="menuheight"><Menu /></div>     */}

        </>
    );
};

export default EmptyPage;
