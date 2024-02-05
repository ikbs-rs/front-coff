import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import { TicEventobjService } from "../../service/model/TicEventobjService";
import TicEventobj from './ticEventobj';
import { EmptyEntities } from '../../service/model/EmptyEntities';
import { Dialog } from 'primereact/dialog';
import './index.css';
import { translations } from "../../configs/translations";
import DateFunction from "../../utilities/DateFunction";
import { TabView, TabPanel } from 'primereact/tabview';
import TicEventobjL from './ticEventobjL';
import TicEventattsL from './ticEventattsL';
import TicEventrtL from './ticEventartL';
import CmnLoclinkL from './cmn/cmnLoclinkL';
import SaleEvent from './ticSalEvent'
import { CmnLocService } from "../../service/model/cmn/CmnLocService";


export default function TicEventWL(props) {
  console.log(props, "***************************************************************************************************")
  const objName = "tic_eventobj"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicEventobj = EmptyEntities[objName]
  emptyTicEventobj.event = props.ticEvent.id
  const [showMyComponent, setShowMyComponent] = useState(true);
  const [ticEventobjs, setTicEventobjs] = useState([]);
  const [ticEventobj, setTicEventobj] = useState(emptyTicEventobj);
  const [cmnLoc, setCmnLoc] = useState({});
  const [filters, setFilters] = useState('');
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const [visible, setVisible] = useState(false);
  const [eventobjTip, setEventobjTip] = useState('');
  const LOCATION_CODE = "-1"

  let i = 0
  const handleCancelClick = () => {
    props.setTicEventobjLVisible(false);
  };

  useEffect(() => {
    console.log("##########################################useEffect activated with ticEvent:", props.ticEvent);
    async function fetchData() {
      try {
        const cmnLocService = new CmnLocService();
        cmnLoc.id = props.ticEvent.loc
        await setCmnLoc(cmnLoc);
        const data = await cmnLocService.getCmnLoc(props.ticEvent.loc);
        await setCmnLoc(data);
      } catch (error) {
        console.error(error);
        // Obrada greške ako je potrebna
      }
    }
    fetchData();
  }, []);

  const renderHeader = () => {
    return (
      <div className="flex card-container">
        <div className="flex flex-wrap gap-1" />
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={handleCancelClick} text raised
        />
        <div className="flex-grow-1"></div>
        <b>{translations[selectedLanguage].EventobjList}</b>
        <div className="flex-grow-1"></div>
      </div>
    );
  };

  // <--- Dialog
  const setTicEventobjDialog = (ticEventobj) => {
    setVisible(true)
    setEventobjTip("CREATE")
    setTicEventobj({ ...ticEventobj });
  }
  //  Dialog --->

  const header = renderHeader();
  // heder za filter/>


  const handleTaskComplete = (data) => {
    props.onTaskComplete(data);
  };

  return (
    <>
      {/* <div className="card"> */}
      <div className="flex card-container">
        {/* <Button onClick={() => handleTaskComplete()} label={translations[selectedLanguage].Confirm} text raised icon="pi pi-table" /> */}
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={() => handleTaskComplete(false)} text raised />
      </div>
      <TabView>



        <TabPanel header={translations[selectedLanguage].Channels}>
          <TicEventobjL key={"XSCT"} ticEvent={props.ticEvent} TabView={true} dialog={true} setTicEventobjLVisible={props.setTicEventobjLVisible} />
        </TabPanel>
        <TabPanel header={translations[selectedLanguage].Sectors}>
          <CmnLoclinkL key={"LL"} 
          loctpCode={LOCATION_CODE}
          ticEvent={props.ticEvent} 
          cmnLoc={cmnLoc} 
          TabView={true} 
          dialog={true} 
          setTicEventobjLVisible={props.setTicEventobjLVisible} />
        </TabPanel>
        <TabPanel header={translations[selectedLanguage].Setings}>
          <TicEventattsL key={"I"} ticEvent={props.ticEvent} TabView={true} dialog={true} setTicEventattsLVisible={props.setTicEventattsLVisible} />
        </TabPanel>

        <TabPanel header={translations[selectedLanguage].Art}>
          <TicEventrtL key={"II"} ticEvent={props.ticEvent} TabView={true} dialog={true} setTicEventartLVisible={props.setTicEventartLVisible} />
        </TabPanel>

        <TabPanel header={translations[selectedLanguage].drawing}>
          <SaleEvent key={"II"} ticEvent={props.ticEvent} TabView={true} dialog={true} setTicEventartLVisible={props.setTicEventartLVisible} />
        </TabPanel>

      </TabView>
      {/* </div> */}
    </>
  );
}
