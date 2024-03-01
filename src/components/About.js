// src/components/About.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // AOS CSS
import './Index.css'; // Pretpostavimo da imate CSS fajl za stilizovanje

const About = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-6 order-1 order-lg-2" data-aos="zoom-in" data-aos-delay="100">
            <div className="about-img">
              <img src="assets/img/about.jpg" alt="" />
            </div>
          </div>
          <div className="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 content">
            <h3>ОДГОВОРНО УПРАВЉАЊЕ ЕЛЕКТРОМАГНЕТНИМ ПОЉЕМ.</h3>
            <p className="fst-italic">
            Већ почетком деветнаестог века било је познато да електрична струја око себе ствара магнетно поље...
            </p>
            <ul>
              <li><i className="bi bi-check-circle"></i> Шта је електромагнетно поље?</li>
              <li><i className="bi bi-check-circle"></i> Шта су извори и како се ствара електромагнетно поље?</li>
              <li><i className="bi bi-check-circle"></i> Природна електрична и магнетна поља. Електрична и магнетна поља која ствара човек.</li>
            </ul>
            <p>
            Намена овог текста је да на здраворазумски, професионалан и стручан начин одговори на често постављана питања, реши недоумице, изврши едукацију и успостави поверење, засновано на чињеницама, пракси и знању.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
