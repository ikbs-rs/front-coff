import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { EmptyEntities } from '../../service/model/EmptyEntities';
import './index.css';
import { translations } from "../../configs/translations";



export default function TicDocW(props) {
  console.log(props, "***************************************************************************************************")
  const objName = "tic_eventobj"
  const selectedLanguage = localStorage.getItem('sl') || 'en'
  const emptyTicEventobj = EmptyEntities[objName]
  emptyTicEventobj.event = props.ticEvent.id

  let i = 0
  const handleCancelClick = () => {
    props.handleDialogClose(false);
  };

  const handleTaskComplete = (data) => {
    props.onTaskComplete(data);
  };


  return (
    <>
      <div className="flex card-container">
        {/* <Button onClick={() => handleTaskComplete()} label={translations[selectedLanguage].Confirm} text raised icon="pi pi-table" /> */}
        <Button label={translations[selectedLanguage].Cancel} icon="pi pi-times" onClick={() => handleTaskComplete(false)} text raised />
      </div>
      <div className="card">
        {props.eventTip == "SAL" && (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                <iframe
                  src={`https://82.117.213.106/sal/seatmap/${props.ticEvent.id}/?parent=ADM`}
                  title="Sal iframe"
                  width="100%"
                  height="760px"
                  frameBorder="0"
                // scrolling="no"
                ></iframe>
              </div>
            </div>
          </div>
        )}
        {props.eventTip == "WEB" && (
          <div className="grid">
            <div className="col-12">
              <div className="card">
                <iframe
                  src={`https://dev.ticketline.rs/2023/08/22/sezonska-ulaznica-fk-napredak-2023-2024-vaucer/${props.ticEvent.id}/?parent=ADM`}
                  title="Sal iframe"
                  width="100%"
                  height="760px"
                  frameBorder="0"
                // scrolling="no"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
