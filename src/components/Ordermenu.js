// src/components/Menu.js
import './Index.css';
import '../assets/css/bootstrap-icons.css'
import React, { useEffect, useRef } from 'react';
import Isotope, { select, on } from 'isotope-layout';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Order = () => {
    const isotopeOrder = useRef();
    const [filterKey, setFilterKey] = React.useState('*')


    const orderItems = [
        { id: 1, category: 'order-starters', name: 'Lobster Bisque', price: '$5.95', img: 'assets/img/menu/lobster-bisque.jpg', description: 'Lorem, deren, trataro, filede, nerada' },
        { id: 2, category: 'order-specialty', name: 'Bread Barrel', price: '$6.95', img: 'assets/img/menu/bread-barrel.jpg', description: 'Lorem, deren, trataro, filede, nerada' },
        { id: 3, category: 'order-starters', name: 'Crab Cake', price: '$7.95', img: 'assets/img/menu/cake.jpg', description: 'A delicate crab cake served on a toasted roll with lettuce and tartar sauce' },
        { id: 4, category: 'order-salads', name: 'Caesar Selections', price: '$8.95', img: 'assets/img/menu/caesar.jpg', description: 'Lorem, deren, trataro, filede, nerada' },
        { id: 5, category: 'order-specialty', name: 'Tuscan Grilled', price: '$9.95', img: 'assets/img/menu/tuscan-grilled.jpg', description: 'Grilled chicken with provolone, artichoke hearts, and roasted red pesto' },
        { id: 6, category: 'order-other', name: 'Mozzarella Stick', price: '$4.95', img: 'assets/img/menu/mozzarella.jpg', description: 'Lorem, deren, trataro, filede, nerada' },
        { id: 7, category: 'order-salads', name: 'Greek Salad', price: '$9.95', img: 'assets/img/menu/greek-salad.jpg', description: 'Fresh spinach, crisp romaine, tomatoes, and Greek olives' },
        { id: 8, category: 'order-salads', name: 'Spinach Salad', price: '$9.95', img: 'assets/img/menu/spinach-salad.jpg', description: 'Fresh spinach with mushrooms, hard boiled egg, and warm bacon vinaigrette' },
        { id: 9, category: 'order-other', name: 'Lobster Roll', price: '$12.95', img: 'assets/img/menu/lobster-roll.jpg', description: 'Plump lobster meat, mayo and crisp lettuce on a toasted bulky roll' },
        { id: 10, category: 'order-starters', name: 'Lobster Bisque', price: '$5.95', img: 'assets/img/menu/lobster-bisque.jpg', description: 'Lorem, deren, trataro, filede, nerada' },
        { id: 12, category: 'order-specialty', name: 'Bread Barrel', price: '$6.95', img: 'assets/img/menu/bread-barrel.jpg', description: 'Lorem, deren, trataro, filede, nerada' },
        { id: 13, category: 'order-starters', name: 'Crab Cake', price: '$7.95', img: 'assets/img/menu/cake.jpg', description: 'A delicate crab cake served on a toasted roll with lettuce and tartar sauce' },
        { id: 14, category: 'order-salads', name: 'Caesar Selections', price: '$8.95', img: 'assets/img/menu/caesar.jpg', description: 'Lorem, deren, trataro, filede, nerada' },
        { id: 15, category: 'order-specialty', name: 'Tuscan Grilled', price: '$9.95', img: 'assets/img/menu/tuscan-grilled.jpg', description: 'Grilled chicken with provolone, artichoke hearts, and roasted red pesto' },
        { id: 16, category: 'order-starters', name: 'Mozzarella Stick', price: '$4.95', img: 'assets/img/menu/mozzarella.jpg', description: 'Lorem, deren, trataro, filede, nerada' },
        { id: 17, category: 'order-salads', name: 'Greek Salad', price: '$9.95', img: 'assets/img/menu/greek-salad.jpg', description: 'Fresh spinach, crisp romaine, tomatoes, and Greek olives' },
        { id: 18, category: 'order-other', name: 'Spinach Salad', price: '$9.95', img: 'assets/img/menu/spinach-salad.jpg', description: 'Fresh spinach with mushrooms, hard boiled egg, and warm bacon vinaigrette' },
        { id: 19, category: 'order-starters', name: 'Lobster Roll', price: '$12.95', img: 'assets/img/menu/lobster-roll.jpg', description: 'Plump lobster meat, mayo and crisp lettuce on a toasted bulky roll' },
    ];

    React.useEffect(() => {
        isotopeOrder.current = new Isotope('.order-container', {
            itemSelector: '.order-item',
            layoutMode: 'fitRows',
        })
        // cleanup
        return () => isotopeOrder.current.destroy()
    }, [])

    // handling filter key change
    React.useEffect(() => {
        filterKey === '*'
            ? isotopeOrder.current.arrange({ filter: `*` })
            : isotopeOrder.current.arrange({ filter: `.${filterKey}` })
    }, [filterKey])

    const handleFilterKeyChange = key => () => setFilterKey(key)    
  

    const handleItemClick = (item, event) => {
        console.log(item, "------------------------handleItemClick--------------------");
        event.stopPropagation();
    };

    return (
        <section id="menu" className="menu section-bg ">
            <div className="container" data-aos="fade-up">
                <div className="section-title">
                    <h2>Мени</h2>
                    {/* <p>Check Our Tasty Menu</p> */}
                </div>

                <div className="row" data-aos="fade-up" data-aos-delay="100">
                    <div className="col-lg-12 d-flex justify-content-center">
                        <ul id="order-flters">
                            <li onClick={handleFilterKeyChange('*')} className="filter-active">Све</li>
                            <li onClick={handleFilterKeyChange('order-starters')}>Кафа</li>
                            <li onClick={handleFilterKeyChange('order-salads')}>Вода</li>
                            <li onClick={handleFilterKeyChange('order-specialty')}>Сокови</li>
                            <li onClick={handleFilterKeyChange('order-other')}>Остало</li>
                        </ul>
                    </div>
                </div>

                <div className="row order-container" data-aos="fade-up" data-aos-delay="200" style={{ position: 'relative', height: '700px ' }}>
                    {orderItems.map(item => (
                        <div key={item.id} className={`col-lg-3 menu-item order-item ${item.category}`} onClick={(e) => handleItemClick(item, e)}>
                            <img src={item.img} className="menu-img" alt={item.name} style={{ cursor: 'pointer' }} />
                            <div className="menu-content" style={{ cursor: 'pointer' }} >
                                <aa href="/menu">{item.name}</aa>
                                {/* <span>{item.price}</span> */}
                            </div>
                            <div className="menu-ingredients" style={{ cursor: 'pointer' }} >
                                {item.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Order;
