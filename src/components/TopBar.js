// src/components/TopBar.js
import React, { useState, useEffect } from 'react';
import './Index.css'; // Ako imate dodatne stilove


const TopBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Postavite prag skrolovanja, npr. 100px
            const threshold = 100;
            const scrolled = window.scrollY > threshold;

            setIsScrolled(scrolled);
        };

        // Dodajte event listener za skrolovanje
        window.addEventListener('scroll', handleScroll);

        // Očistite event listener kada komponenta više nije montirana
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div id="topbar" className={`d-flex align-items-center fixed-top ${isScrolled ? 'topbar-scrolled' : ''}`}>
            <div className="container d-flex justify-content-center justify-content-md-between">
                <div className="contact-info d-flex align-items-center">
                    <i className="bi bi-phone d-flex align-items-center"><span>+381 64 84088 xx</span></i>
                    <i className="bi bi-clock d-flex align-items-center ms-4"><span> Пон-Пет: 08 - 16</span></i>
                </div>

                <div className="languages d-none d-md-flex align-items-center">
                    <ul>
                        <li>Рс</li>
                        <li><a href="#">Ен</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
