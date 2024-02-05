import React, { useRef, useEffect, useState } from 'react';
import EventService from '../service/EventService';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { ProgressBar } from 'primereact/progressbar';
import { Menu } from 'primereact/menu';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ProductService from '../service/ProductService';

const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Sales',
            data: [12, 19, 3, 5, 2, 3, 9],
            borderColor: ['#0F97C7'],
            borderWidth: 3,
            borderDash: [5, 5],
            fill: false,
            pointRadius: 3,
            tension: 0.4
        },
        {
            label: 'Income',
            data: [1, 2, 5, 3, 12, 7, 15],
            backgroundColor: ['rgba(187,222,251,0.2)'],
            borderColor: ['#578697'],
            borderWidth: 3,
            fill: true,
            tension: 0.4
        },
        {
            label: 'Expenses',
            data: [7, 12, 15, 5, 3, 13, 21],
            borderColor: ['#1BA7AF'],
            borderWidth: 3,
            fill: false,
            pointRadius: [4, 6, 4, 12, 8, 0, 4],
            tension: 0.4
        },
        {
            label: 'New Users',
            data: [3, 7, 2, 17, 15, 13, 19],
            borderColor: ['#E2841A'],
            borderWidth: 3,
            fill: false,
            tension: 0.4
        }
    ]
};

const chartOptions = {
    responsive: true,
    hover: {
        mode: 'index'
    },
    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: 'Month'
            }
        },
        y: {
            display: true,
            title: {
                display: true,
                text: 'Value'
            }
        }
    }
};

const Dashboard = () => {
    const [products, setProducts] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [events, setEvents] = useState(null);

    const menuItems = [
        {
            label: 'Save',
            icon: 'pi pi-fw pi-check'
        },
        {
            label: 'Update',
            icon: 'pi pi-fw pi-refresh'
        },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash'
        }
    ];

    const menu = useRef(null);

    const onTaskChange = (e) => {
        let selectedTasks = [...tasks];
        if (e.checked) selectedTasks.push(e.value);
        else selectedTasks.splice(selectedTasks.indexOf(e.value), 1);

        setTasks(selectedTasks);
    };

    const ImageTemplate = (rowData, column) => {
        var src = 'assets/demo/images/product/' + rowData.image;
        return <img src={src} alt={rowData.brand} width="50px" />;
    };

    const priceBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {formatCurrency(data.price)}
            </>
        );
    };

    const bodyTemplate = (data, props) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                {data[props.field]}
            </>
        );
    };

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const actionTemplate = (rowData, column) => {
        return (
            <>
                <Button icon="pi pi-search" type="button" style={{ marginRight: '.5rem' }}></Button>
                <Button icon="pi pi-times" type="button" className="p-button-danger"></Button>
            </>
        );
    };

    const statusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}>{data.inventoryStatus}</span>
            </>
        );
    };

    useEffect(() => {
        const eventservice = new EventService();
        const productservice = new ProductService();
        productservice.getProducts().then((data) => setProducts(data));
        eventservice.getEvents().then((data) => setEvents(data));
    }, []);

    return (
        <div className="grid layout-dashboard">
            <div className="col-12 md:col-6 lg:col-3">
                <div className="overview-box card">
                    <div className="overview-box-value">90</div>
                    <div className="overview-box-title">TASKS</div>
                    <img src="assets/layout/images/dashboard/graph-tasks.svg" alt="roma" />
                    <div className="overview-box-status">
                        +8.9% <i className="pi pi-arrow-circle-up"></i>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="overview-box card">
                    <div className="overview-box-value">1259</div>
                    <div className="overview-box-title">PURCHASES</div>
                    <img src="assets/layout/images/dashboard/graph-purchases.svg" alt="roma" />
                    <div className="overview-box-status">
                        +67.2% <i className="pi pi-arrow-circle-up"></i>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="overview-box card">
                    <div className="overview-box-value">21</div>
                    <div className="overview-box-title">ISSUES</div>
                    <img src="assets/layout/images/dashboard/graph-issues.svg" alt="roma" />
                    <div className="overview-box-status">
                        +3.0% <i className="pi pi-arrow-circle-up"></i>
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
                <div className="overview-box card">
                    <div className="overview-box-value">42</div>
                    <div className="overview-box-title">MESSAGES</div>
                    <img src="assets/layout/images/dashboard/graph-messages.svg" alt="roma" />
                    <div className="overview-box-status">
                        +12.5% <i className="pi pi-arrow-circle-up"></i>
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-8 lg:col-8">
                <div className="card card-w-title">
                    <h5>Statistics</h5>
                    <Chart type="line" data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="col-12 md:col-4 lg:col-4">
                <div className="timeline card card-w-title">
                    <h5>Timeline</h5>
                    <ul>
                        <li>
                            <i className="pi pi-image"></i>
                            <span className="timeline-event-title">Uploaded Images</span>
                            <span className="timeline-event-time">15m</span>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            <div className="grid">
                                <div className="col-6">
                                    <img src="assets/layout/images/dashboard/image-1.jpg" alt="roma" />
                                </div>
                                <div className="col-6">
                                    <img src="assets/layout/images/dashboard/image-2.jpg" alt="roma" />
                                </div>
                            </div>
                        </li>
                        <li>
                            <i className="pi pi-star-fill"></i>
                            <span className="timeline-event-title">Favorites</span>
                            <span className="timeline-event-time">1h</span>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                        </li>
                        <li>
                            <i className="pi pi-users"></i>
                            <span className="timeline-event-title">Meeting</span>
                            <span className="timeline-event-time">2h</span>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                        </li>
                        <li>
                            <i className="pi pi-money-bill"></i>
                            <span className="timeline-event-title">Payment Received</span>
                            <span className="timeline-event-time">3h</span>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="expenses card card-w-title">
                    <h5>Expenses</h5>
                    <div className="chart">$5500</div>
                    <div className="grid expenses-legend">
                        <div className="col-12 lg:col-4">
                            <i className="pi pi-circle-on"></i>
                            <span className="expenses-title">Printer: Color Cartridge</span>
                            <div className="expenses-price">$420</div>
                            <span className="legend-status">23+ more than last month</span>
                        </div>
                        <div className="col-12 lg:col-4">
                            <i className="pi pi-circle-on"></i>
                            <span className="expenses-title">Printer: B&amp;W Cartridge</span>
                            <div className="expenses-price">$680</div>
                            <span className="legend-status">60+ more than last month</span>
                        </div>
                        <div className="col-12 lg:col-4">
                            <i className="pi pi-circle-on"></i>
                            <span className="expenses-title">Coffee Capsules</span>
                            <div className="expenses-price">$150</div>
                            <span className="legend-status">8% less than last month</span>
                        </div>
                    </div>

                    <div className="expenses-footer">
                        <a href="/">View more details </a>
                    </div>
                </div>
            </div>
            <div className="col-12 xl:col-6">
                <div className="card card-w-title">
                    <h5>Schedule</h5>
                    <FullCalendar events={events} plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} initialDate="2023-01-01" headerToolbar={{ left: 'prev,next', center: 'title', right: '' }} editable />
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card card-w-title tasks">
                    <h5>Tasks</h5>
                    <p>
                        You have <span className="task-highlight">completed</span> 3 tasks out of 6.
                    </p>
                    <ProgressBar value={50} />

                    <ul>
                        <li>
                            <Checkbox value="task1" onChange={onTaskChange} checked={tasks.indexOf('task1') > -1 ? true : false}></Checkbox>
                            <span>Sales Reports</span>
                            <span className="task-badge-open">Open</span>
                        </li>
                        <li>
                            <Checkbox value="task2" onChange={onTaskChange} checked={tasks.indexOf('task2') > -1 ? true : false}></Checkbox>
                            <span>Pay Invoices</span>
                            <span className="task-badge-open">Open</span>
                        </li>
                        <li>
                            <Checkbox value="task3" onChange={onTaskChange} checked={tasks.indexOf('task3') > -1 ? true : false}></Checkbox>
                            <span>Birthday Party</span>
                            <span className="task-badge-open">Open</span>
                        </li>
                        <li>
                            <Checkbox value="task4" onChange={onTaskChange} checked={tasks.indexOf('task4') > -1 ? true : false}></Checkbox>
                            <span>Client Meeting</span>
                            <span className="task-badge-closed">Closed</span>
                        </li>
                        <li>
                            <Checkbox value="task5" onChange={onTaskChange} checked={tasks.indexOf('task5') > -1 ? true : false}></Checkbox>
                            <span>New Themes</span>
                            <span className="task-badge-closed">Closed</span>
                        </li>
                        <li>
                            <Checkbox value="task6" onChange={onTaskChange} checked={tasks.indexOf('task6') > -1 ? true : false}></Checkbox>
                            <span>Flight Ticket</span>
                            <span className="task-badge-closed">Closed</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-4">
                <div className="card card-w-title resolution-center ui-fluid">
                    <h5>Resolution Center</h5>

                    <InputText id="username" type="text" placeholder="Username" />

                    <InputText id="email" type="text" placeholder="Email" />

                    <InputTextarea rows={5} placeholder="Message" />

                    <div className="resolution-button-bar">
                        <Button type="button" label="Send" icon="pi pi-envelope"></Button>
                        <Button type="button" label="Save" icon="pi pi-plus" className="p-button-secondary"></Button>
                    </div>
                </div>
            </div>
            <div className="col-12 xl:col-4">
                <div className="card card-w-title team">
                    <h5>Team</h5>
                    <ul>
                        <li>
                            <img src="assets/layout/images/avatar-1.png" alt="roma-layout" />
                            <div className="team-box">
                                <span className="team-member">John Swisher Welch</span>
                                <span className="team-member-account">@jswisher</span>
                            </div>
                            <a href="/">
                                <i className="pi pi-paperclip"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-comment"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-share-alt"></i>
                            </a>
                        </li>
                        <li>
                            <img src="assets/layout/images/avatar-2.png" alt="roma-layout" />
                            <div className="team-box">
                                <span className="team-member">Bernd Pfefferberg</span>
                                <span className="team-member-account">@pfefferberg</span>
                            </div>
                            <a href="/">
                                <i className="pi pi-paperclip"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-comment"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-share-alt"></i>
                            </a>
                        </li>
                        <li>
                            <img src="assets/layout/images/avatar-3.png" alt="roma-layout" />
                            <div className="team-box">
                                <span className="team-member">Chinaza Akachi</span>
                                <span className="team-member-account">@chinazzza_</span>
                            </div>
                            <a href="/">
                                <i className="pi pi-paperclip"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-comment"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-share-alt"></i>
                            </a>
                        </li>
                        <li>
                            <img src="assets/layout/images/avatar-4.png" alt="roma-layout" />
                            <div className="team-box">
                                <span className="team-member">Luka Miller</span>
                                <span className="team-member-account">@luk4mr</span>
                            </div>
                            <a href="/">
                                <i className="pi pi-paperclip"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-comment"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-share-alt"></i>
                            </a>
                        </li>
                        <li>
                            <img src="assets/layout/images/avatar-5.png" alt="roma-layout" />
                            <div className="team-box">
                                <span className="team-member">Arlene Welch</span>
                                <span className="team-member-account">@arlene</span>
                            </div>
                            <a href="/">
                                <i className="pi pi-paperclip"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-comment"></i>
                            </a>
                            <a href="/">
                                <i className="pi pi-share-alt"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-12 xl:col-8">
                <div className="card card-w-title live-support">
                    <h5>Live Support</h5>
                    <ul>
                        <li className="message-from">
                            <div className="grid">
                                <div className="col-fixed">
                                    <img src="assets/layout/images/avatar-1.png" alt="roma-layout" />
                                </div>
                                <div className="col">
                                    <div className="chat-message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac euismod justo, eget blandit purus.</div>
                                </div>
                            </div>
                        </li>
                        <li className="message-to">
                            <div className="grid">
                                <div className="col">
                                    <div className="chat-message">Mauris malesuada quis risus ut consequat. Maecenas ornare nunc risus, pulvinar euismod mi pellentesque eget.</div>
                                </div>
                                <div className="col-fixed">
                                    <img src="assets/layout/images/avatar-1.png" alt="roma-layout" />
                                </div>
                            </div>
                        </li>
                        <li className="message-from">
                            <div className="grid">
                                <div className="col-fixed">
                                    <img src="assets/layout/images/avatar-2.png" alt="roma-layout" />
                                </div>
                                <div className="col">
                                    <div className="chat-message">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam ac euismod justo, eget blandit purus.</div>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <div className="new-message">
                        <div className="grid grid-nogutter">
                            <div className="col">
                                <InputText id="input" type="text" placeholder="Write a message.." />
                            </div>
                            <div className="col-fixed">
                                <Button type="button" label="Send"></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 xl:col-4">
                <div className="card user-card">
                    <div className="user-card-header">
                        <img src="assets/layout/images/dashboard/bg-header.png" alt="roma-layout" />
                    </div>

                    <div className="user-card-content">
                        <img src="assets/layout/images/avatar.png" alt="roma-layout" />

                        <Menu model={menuItems} popup={true} ref={menu} appendTo={document.body} />
                        <Button icon="pi pi-cog" onClick={(event) => menu.toggle(event)} />

                        <div className="user-card-name">
                            <span>Maria Llescas</span>
                        </div>

                        <div className="user-detail">
                            <div className="grid">
                                <div className="col-4">
                                    <div className="user-detail-box">
                                        <div className="user-detail-box-name">Tasks</div>
                                        <div className="user-detail-box-detail">3 open</div>
                                        <i className="pi pi-list"></i>
                                        <ProgressBar value={60} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="user-detail-box">
                                        <div className="user-detail-box-name">Revenue</div>
                                        <div className="user-detail-box-detail">+20%</div>
                                        <i className="pi pi-dollar"></i>
                                        <ProgressBar value={80} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="user-detail-box">
                                        <div className="user-detail-box-name">Payments</div>
                                        <div className="user-detail-box-detail">24 New</div>
                                        <i className="pi pi-money-bill"></i>
                                        <ProgressBar value={60} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="user-detail-box">
                                        <div className="user-detail-box-name">Clients</div>
                                        <div className="user-detail-box-detail">+80%</div>
                                        <i className="pi pi-users"></i>
                                        <ProgressBar value={50} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="user-detail-box">
                                        <div className="user-detail-box-name">Sales</div>
                                        <div className="user-detail-box-detail">3 open</div>
                                        <i className="pi pi-money-bill"></i>
                                        <ProgressBar value={60} />
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="user-detail-box">
                                        <div className="user-detail-box-name">Tasks</div>
                                        <div className="user-detail-box-detail">3 open</div>
                                        <i className="pi pi-chart-bar"></i>
                                        <ProgressBar value={60} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 xl:col-8">
                <div className="card card-w-title global-sales ui-fluid">
                    <h5>Global Sales</h5>
                    <DataTable value={products} paginator rows={5} className="p-datatable-products" selection={selectedProduct} onSelectionChange={(e) => setSelectedProduct(e.value)}>
                        <Column header="Image" body={ImageTemplate} />
                        <Column field="id" header="ID" sortable body={bodyTemplate} />
                        <Column field="category" body={bodyTemplate} header="Category" sortable />
                        <Column field="price" body={priceBodyTemplate} header="Price" sortable />
                        <Column field="inventoryStatus" body={statusBodyTemplate} header="Status" sortable />
                        <Column bodyStyle={{ textAlign: 'center', justifyContent: 'center' }} body={actionTemplate} />
                    </DataTable>
                </div>
            </div>

            <div className="col-12 xl:col-4">
                <div className="card weather">
                    <div className="weather-header">
                        <img src="assets/layout/images/dashboard/weather.png" alt="roma-layout" />
                    </div>
                    <div className="weather-content">
                        <div className="weather-city">Antalya</div>
                        <div className="weather-status">
                            24&#176; C <i className="pi pi-map-marker"></i>
                        </div>
                        <div className="weather-detail">Feels like 26&#176; Low 14 &#176; High 28 &#176;</div>
                        <a href="/">Change Location</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
