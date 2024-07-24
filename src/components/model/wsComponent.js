import React, { useEffect } from 'react';
import { useWebSocket } from '../../utilities/WebSocketContext';

const WsComponent = () => {
  const websocket = useWebSocket();

  useEffect(() => {
    if (websocket) {
      websocket.addEventListener('message', (message) => {
        const obj = JSON.parse(message.data)
        console.log("TRECA", obj.data);
      });
    }
  }, [websocket]);

  const sendMessage = () => {
    console.log('{"id":"treca"}')
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send('{"data":[{"id":"TRECA"}]}');
    }
  };

  return (
    <div>
      <button onClick={sendMessage}>Pošalji poruku</button>
    </div>
  );
};

export default WsComponent;
