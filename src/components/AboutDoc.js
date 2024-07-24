// src/components/About.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS CSS
import './Index.css'; // Pretpostavimo da imate CSS fajl za stilizovanje
import CoffDocPorudzbineL from '../components/model/coffDocPorudzbineL';

const AboutDoc = (props) => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  const handleDataUpdate = (updatedTab) => {
    props.onDataUpdate(updatedTab);
    // setDataTab(updatedTab);
  };
  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-12 pt-4 pt-lg-0 order-2 order-lg-1 content">
            < CoffDocPorudzbineL datarefresh={props.dataTab} doctp={1} onDataUpdate={handleDataUpdate} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDoc;
