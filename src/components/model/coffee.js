import React, { useState } from 'react';
import { translations } from "../../configs/translations";
import CoffeeV from "./coffeeV"
import EmpA from "./empA"
import KkDocL from "./kkDocL"
import KkDoc from "./kkDoc"

import { TabView, TabPanel } from 'primereact/tabview';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';

import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Divider } from 'primereact/divider';


export default function TemplateDemo() {

    const [action, setAction] = useState(null);

    const selectedLanguage = localStorage.getItem('sl') || 'en'
    const tab1HeaderTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2 p-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
                <span className="font-bold white-space-nowrap">Onyama Limba</span>
            </div>
        )
    };
    const tab2HeaderTemplate = (options) => {
        return (
            <div className="flex align-items-center px-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" className="mx-2" />
                Amy Elsner
            </div>
        )
    };

    const tab3HeaderTemplate = (options) => {
        return (
            <div className="flex align-items-center gap-2 p-3" style={{ cursor: 'pointer' }} onClick={options.onClick}>
                <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/ionibowcher.png" shape="circle" />
                <span className="font-bold white-space-nowrap">Ioni Bowcher</span>
                {/* <Badge value="2" /> */}
            </div>
        )
    };


    const handleAction = (actionType) => {
        // Postavite akciju na osnovu tipa akcije
        setAction(actionType);
      };

    const f1 = (param) => {
        console.log('Funkcija f1 je pozvana sa parametrom:', param);
    }

    return (
        <Splitter >
            <SplitterPanel className="flex flex-column" size={70} style={{ height: '780px', overflowY: 'auto' }}>
                <div className="card">
                    <div className="flex flex-wrap gap-1">
                        {('CREATE' == 'CREATE') ? (
                            <Button
                                label={translations[selectedLanguage].Create}
                                icon="pi pi-check"
                                onClick={() => handleAction('CREATE')}
                                severity="success"
                                outlined
                            />
                        ) : null}
                        {('CREATE' == 'CREATE') ? (
                            <Button
                                label={translations[selectedLanguage].Delete}
                                icon="pi pi-trash"
                                onClick={() => f1(2)}
                                className="p-button-outlined p-button-danger"
                                outlined
                            />
                        ) : null}
                        {('CREATE' == 'CREATE') ? (
                            <Button
                                label={translations[selectedLanguage].Save}
                                icon="pi pi-check"
                                onClick={() => f1(3)}
                                severity="success"
                                outlined
                            />
                        ) : null}
                    </div>
                    <Divider />
                    <TabView>
                        <TabPanel header="Header I" headerTemplate={tab1HeaderTemplate}>
                            <EmpA />
                        </TabPanel>
                        <TabPanel headerTemplate={tab2HeaderTemplate} headerClassName="flex align-items-center">
                            <CoffeeV />
                        </TabPanel>
                        <TabPanel headerTemplate={tab3HeaderTemplate} headerClassName="flex align-items-center">
                            <p className="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti
                                quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in
                                culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                            </p>
                        </TabPanel>
                    </TabView>
                </div>
            </SplitterPanel>
            <SplitterPanel className="flex flex-column" size={30} style={{ height: '780px', overflowY: 'auto' }}>
                {action === 'CREATE' ? <KkDoc par="POR" /> : <KkDocL />}
            </SplitterPanel>
        </Splitter>
    )
}

