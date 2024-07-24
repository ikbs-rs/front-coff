import React, { createContext, useContext, useEffect, useState } from 'react';
import notificationSound from './bup.mp3';

const audioContext = new AudioContext();
let audioBuffer;

const fetchSound = async () => {
    const response = await fetch(notificationSound);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
};

fetchSound();

const playNotificationSound = () => {
    if (!audioBuffer) return; // Provera da li je zvuk učitan

    // Kreiranje audio izvora
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Povezivanje izvora sa izlazom audio konteksta
    source.connect(audioContext.destination);

    // Pokretanje reprodukcije
    source.start();
};

/******************************************************************************* */
const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [websocket, setWebsocket] = useState(null);
  //const notificationSound = new Audio('http://brztest.ems.local/coff/assets/img/bup.mp3');

  useEffect(() => {
    const ws = new WebSocket('ws://brztest.ems.local/wsc');

    ws.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    ws.addEventListener('message', (message) => {
        const obj = JSON.parse(message.data)
      console.log("BEL", obj.data);
      if (obj.data[0].id == 'TRECA') {
        playNotificationSound();
      }

    //   notificationSound.play();
    });

    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      // Ponovno povezivanje na WebSocket server nakon 5 sekundi
      setTimeout(() => {
        console.log('Ponovno povezivanje na WebSocket server...');
        const newWs = new WebSocket('ws://brztest.ems.local/wsc');
        setWebsocket(newWs);
      }, 5000);
    });

    // Interval za slanje poruke svakih 5 sekundi
    const messageInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('{"data":[{"id":"PRVA"}]}');
      }
    }, 10000);

    setWebsocket(ws);

    return () => {
      ws.close();
      clearInterval(messageInterval);
    };
  }, []);

  return (
    <WebSocketContext.Provider value={websocket}>
      {children}
    </WebSocketContext.Provider>
  );
};

