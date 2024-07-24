import React, { useEffect } from 'react';

const WebSocketManager = () => {
  useEffect(() => {
    let websocket = new WebSocket('ws://brztest.ems.local/wsc');

    console.log('Povezivanje na WebSocket server...');

    let sendMessageInterval;

    websocket.addEventListener('open', () => {
      console.log('WebSocket konekcija uspostavljena');

      const messageInterval = 10000;

      sendMessageInterval = setInterval(() => {
        if (websocket.readyState === WebSocket.OPEN) {
          const message = JSON.stringify({ action: 'NO' });;
          websocket.send(message);
          console.log(`Poslata poruka serveru!!!!: ${message}`);
        }
      }, messageInterval);
    });

    websocket.addEventListener('close', () => {
      console.log('WebSocket konekcija zatvorena');
      clearInterval(sendMessageInterval);

      setTimeout(() => {
        console.log('Ponovno povezivanje na WebSocket server...');
        websocket = new WebSocket('ws://brztest.ems.local/wsc');
      }, 5000);
    });

    // Cleanup funkcija koja se poziva kada se komponenta demontira
    return () => {
      console.log('Čišćenje WebSocket konekcije...');
      websocket.close(); // Zatvaranje WebSocket konekcije
      clearInterval(sendMessageInterval);
    };
  }, []);

  return null; // WebSocketManager komponenta ne renderuje nikakav JSX
};

export default WebSocketManager;
