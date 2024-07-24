import React, { useEffect, useState } from 'react';

const WebSocketManager = ({ children }) => {
  const [websocket, setWebsocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://brztest.ems.local/wsc');

    ws.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    ws.addEventListener('message', (message) => {
      console.log('Primljena poruka od servera!!:', message.data);
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
        ws.send('Poruka sa klijenta');
      }
    }, 5000);

    setWebsocket(ws);

    return () => {
      ws.close();
      clearInterval(messageInterval);
    };
  }, []);

  return <>{React.Children.map(children, child => React.cloneElement(child, { websocket }))}</>;
};

export default WebSocketManager;
