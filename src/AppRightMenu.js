import React from 'react';
import { classNames } from 'primereact/utils';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';

const AppRightMenu = (props) => {
    return (
        <div className={classNames('layout-right-panel', { 'layout-right-panel-active': props.rightPanelMenuActive })} onClick={props.onRightMenuClick}>
            <TabView>
                <TabPanel header="Status">
                    <div className="status-title">
                        <span>Datacenter Status</span>
                        <i className="pi pi-download"></i>
                    </div>
                    <div>
                        <ProgressBar value={88} showValue={false} />
                    </div>
                    <div className="status-content">
                        <span className="percentage-1">65</span>
                        <span className="percentage-2">/88</span> Servers Online
                    </div>

                    <div className="status-title">
                        <span>Performance Status</span>
                        <i className="pi pi-clock"></i>
                    </div>
                    <div>
                        <ProgressBar value={65} showValue={false} />
                    </div>
                    <div className=" status-content">
                        <span className=" percentage-1">4</span>
                        <span className=" percentage-2">/5</span>
                        Active Pipeline
                    </div>

                    <div className=" status-title">
                        <span>Drivers on Way</span>
                        <i className="pi pi-cloud"></i>
                    </div>
                    <div>
                        <ProgressBar value={35} showValue={false} />
                    </div>
                    <div className=" status-content">
                        <span className="percentage-1">12</span>
                        <span className="percentage-2">/40</span>
                        Drivers
                    </div>

                    <div className="status-title">
                        <span>Datacenter Status</span>
                        <i className="pi pi-map-marker"></i>
                    </div>
                    <div>
                        <ProgressBar value={85} showValue={false} />
                    </div>
                    <div className="status-content">
                        <span className="percentage-1">65</span>
                        <span className=" percentage-2">/88</span>
                        Servers Online
                    </div>
                </TabPanel>

                <TabPanel header="Messages">
                    <div className="messages-title">
                        <span>November 13, 2018</span>
                    </div>
                    <div className="messages-content grid col">
                        <div className="time col-4">00:00 GMT+03:00</div>
                        <div className="message-1 col-8">All systems reporting at 100%</div>
                    </div>

                    <div className="messages-title">
                        <span>November 12, 2018</span>
                    </div>
                    <div className="messages-content grid col">
                        <span className="time col-4">00:00 GMT+03:00</span>
                        <span className="message-1 col-8">All systems reporting at 100%</span>
                    </div>

                    <div className="messages-title">
                        <span>November 7, 2018</span>
                    </div>
                    <div className="messages-content grid col">
                        <span className="time col-4">09:23 GMT+03:00</span>
                        <span className="message-1 col-8">Everything operating normally.</span>

                        <span className="time col-4">08:58 GMT+03:00</span>
                        <span className="message-2 col-8">We're investigating delays inupdates to PrimeFaces.org.</span>

                        <span className="time col-4">08:50 GMT+03:00</span>
                        <span className="message-2 col-8">We are investigating reports of elevated error rates.</span>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default AppRightMenu;
