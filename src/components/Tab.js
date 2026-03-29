import React, { useState } from 'react';
import OrderL from '../components/model/OrderL';
// import OrderlistL from '../components/model/ticArttpL';

const Tab = (props) => {
console.log("Tab =================================================================")
    const currCoffOrder = localStorage.getItem('currCoffOrder')

    
    const [activeTab, setActiveTab] = useState('tab-1');

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (tabId === 'tab-1') {
            setTimeout(() => {
                const element = document.getElementById('OrderL').querySelector('.p-virtualscroller.p-virtualscroller-inline');
                if (element) {
                    element.style.height = '650px';
                }
            }, 100);
        } else if (tabId === 'tab-2') {
            setTimeout(() => {
                const element = document.getElementById('coffDocL').querySelector('.p-virtualscroller.p-virtualscroller-inline');
                if (element) {
                    element.style.height = '650px';
                }
            }, 100);
        }        
    };
    const handleDataUpdate = (updatedTab) => {
        props.onDataUpdate(updatedTab); 
        // setDataTab(updatedTab);
    };
    return (
        <section id="specials" className="specials specials-glass">
            <div className="container" data-aos="fade-up">
                <div className="section-title">
                    <h2>Поруџбине</h2>
                    <p></p>
                </div>
                <div className="row" data-aos="fade-up" data-aos-delay="100">
                    <div className="col-lg-12 mt-4 mt-lg-0 specials-glass-panel">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'tab-1' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('tab-1')}
                                >
                                    Креирај
                                </button>
                            </li>
                            {/* <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'tab-2' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('tab-2')}
                                >
                                    Листа поруџбина
                                </button>
                            </li> */}
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'tab-3' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('tab-3')}
                                >
                                    Правилник
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div className={`tab-pane ${activeTab === 'tab-1' ? 'active' : ''}`} id="tab-1">
                                <div className="row">
                                    <div className="col-lg-12 details order-1 order-lg-1">
                                        < OrderL  currCoffOrder={currCoffOrder} datarefresh={props.dataTab} onDataUpdate={handleDataUpdate} handleRefreshTab={props.handleRefreshTab}/>
                                    </div>
                                </div>
                            </div>
                            {/* <div className={`tab-pane ${activeTab === 'tab-2' ? 'active' : ''}`} id="tab-2">
                                <div className="row">
                                    <div className="col-lg-12 details order-1 order-lg-1">
                                        < CoffDocL  doctp={1}/>
                                    </div>
                                </div>
                            </div> */}
                            <div className={`tab-pane ${activeTab === 'tab-3' ? 'active' : ''}`} id="tab-3">
                                <div className="row">
                                    <div className="col-lg-8 details order-2 order-lg-1">
                                        <h3>Правила постоје! 🚫</h3>
                                        <p className="fst-italic">У радно време, уместо алкохола, служимо само добре вибрације и висококвалитетни кофеин! 🚫🍹☕️</p>
                                        <p>У нашем бифеу, алкохол се чува за посебне прилике попут рођендана или постигнућа, док се током радног времена послужују само чаше пуњене ентузијазмом и шоље напуњене креативношћу! Наша тајна састојака? Уместо вискија, ту је доза мотивације, а уместо вина, уживамо у гутљају инспирације. Дакле, ако тражите бар, онда је то бар идеја и иновација. 🚫🍹✨</p>
                                    </div>
                                    <div className="col-lg-4 text-center order-1 order-lg-2">
                                        <img src="assets/img/specials-2.jpg" alt="" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
        </section>
    );
};

export default Tab;
