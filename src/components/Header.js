// src/components/Header.js
import React, { useState, useEffect } from 'react';
import './Index.css';

const Header = ({ scrollToSection, heroSectionRef, aboutRef, statusRef, orderRef, docRef }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleDropdownClick = (event) => {
    console.log(event, "*************event*******************")
    event.preventDefault();
    const childUl = event.currentTarget.querySelector('ul');
    const hasDropdownActiveClass = childUl.classList.contains('dropdown-active')

    console.log(childUl, "*************childUl*******************", childUl.classList.contains('dropdown-active'))

    if (hasDropdownActiveClass) {
      childUl.classList.remove('dropdown-active');
    } else {
      childUl.classList.add('dropdown-active');
    }
    event.stopPropagation();
  };

  return (
    <header id="header" className={`fixed-top d-flex align-items-center ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container-fluid container-xl d-flex align-items-center justify-content-lg-between">
        <h1 className="logo me-auto me-lg-0"><a href="/" onClick={(e) => { e.preventDefault(); scrollToSection(heroSectionRef); }}>ЕМС - БИФЕ </a></h1>
        <nav id="navbar" className={`navbar order-last order-lg-0 ${mobileMenuOpen ? 'navbar-mobile' : ''}`}>
          <ul class>
            <li><a href="/hero" onClick={(e) => {
              e.preventDefault();
              scrollToSection(heroSectionRef);
              if (mobileMenuOpen) {
                toggleMobileMenu();
              }
            }}>Почетна</a></li>
            <li><a href="status/" onClick={(e) => {
              e.preventDefault();
              scrollToSection(statusRef);
              if (mobileMenuOpen) {
                toggleMobileMenu();
              }
            }}>Статус</a></li>
            <li><a href="/order" onClick={(e) => {
              e.preventDefault();
              scrollToSection(orderRef);
              if (mobileMenuOpen) {
                toggleMobileMenu();
              }
            }}>Поруџбина</a></li>
            <li><a href="/doc" onClick={(e) => {
              e.preventDefault();
              scrollToSection(docRef);
              if (mobileMenuOpen) {
                toggleMobileMenu();
              }
            }}>Преглед</a></li>
            {/* <li className={`dropdown`} onClick={handleDropdownClick}>
              <a href="#">
                Администрација<i className="bi bi-chevron-down"></i>
              </a>
              <ul class >


                <li className={`dropdown`} onClick={handleDropdownClick}>
                  <a href="#">
                  ХР ШИФАРНИЦИ <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul class>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Тип запосленог</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Запослени</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Орг. структура</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Систематизација</a></li>
                  </ul>
                </li>

                <li className={`dropdown`} onClick={handleDropdownClick}>
                  <a href="#">
                  АДМИНИСТРАЦИЈА ЕЛЕМЕНАТА<i className="bi bi-chevron-right"></i>
                  </a>
                  <ul class>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Тип артикла</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Група артикала</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Артикал</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Тип цене</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Цена</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Типови докумената</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Врста документа</a></li>                    
                  </ul>
                </li>

                <li className={`dropdown`} onClick={handleDropdownClick}>
                  <a href="#">
                  ОБРАДА <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul class>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Документи</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Бифе</a></li>
                  </ul>
                </li>

                <li className={`dropdown`} onClick={handleDropdownClick}>
                  <a href="#">
                  ИЗВЕШТАВАЉЕ <i className="bi bi-chevron-right"></i>
                  </a>
                  <ul class>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Лагер листа</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Листа задужења</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Извештај 3</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Извештај 4</a></li>
                    <li><a href="#" onClick={(e) => { if (mobileMenuOpen) { toggleMobileMenu(); } }}>Извештај 5</a></li>
                  </ul>
                </li>
              </ul>
            </li>
 */}
          </ul>
          <i className={`bi mobile-nav-toggle ${mobileMenuOpen ? 'bi-x' : 'bi-list'}`} onClick={toggleMobileMenu}></i>
        </nav>
        <a href="/order" className="book-a-table-btn scrollto d-none d-lg-flex"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(orderRef);
            if (mobileMenuOpen) {
              toggleMobileMenu();
            }
          }
          }
        >Поруџбина</a>
      </div>
    </header>
  );
};

export default Header;

