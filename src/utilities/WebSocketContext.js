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
    const wsRef = React.useRef(null);
    const mounted = React.useRef(false);
    const reconnectTimer = React.useRef(null);
    const HEARTBEAT_MS = 30000;
    const RECONNECT_MS = 5000;
    const URL = 'ws://brztest.ems.local/wsc';
  
    useEffect(() => {
      if (mounted.current) return; // StrictMode guard
      mounted.current = true;
  
      const connect = () => {
        // ne otvaraj novu ako postoji i nije CLOSED
        if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) return;
  
        const ws = new WebSocket(URL);
        wsRef.current = ws;
        setWebsocket(ws);
  
        ws.addEventListener('open', () => {
          console.log('WS open', URL);
        });
  
        ws.addEventListener('message', (message) => {
          let obj;
          try {
            obj = JSON.parse(message.data);
          } catch {
            console.warn('WS: nije JSON:', message.data);
            return;
          }
          const first = Array.isArray(obj?.data) ? obj.data[0] : null;
          if (first?.id === 'TRECA22') {
            playNotificationSound();
          }
          console.log('WS payload:', obj);
        });
  
        ws.addEventListener('error', (e) => {
          console.warn('WS error:', e?.message || e);
        });
  
        ws.addEventListener('close', () => {
          console.log('WS closed, reconnecting in', RECONNECT_MS, 'ms');
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = setTimeout(connect, RECONNECT_MS);
        });
      };
  
      connect();
  
      // heartbeat ping (ako server odgovara pongom, super; inače samo “activity”)
      const hb = setInterval(() => {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send('{"type":"ping"}');
        }
      }, HEARTBEAT_MS);
  
      // demo: šalje test poruku na 10s
      const demo = setInterval(() => {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send('{"data":[{"id":"PRVA11"}]}');
        }
      }, 10000);
  
      return () => {
        clearInterval(hb);
        clearInterval(demo);
        clearTimeout(reconnectTimer.current);
  
        // zatvori baš aktivnu instancu
        if (wsRef.current) {
          try { wsRef.current.close(); } catch {}
        }
        wsRef.current = null;
      };
    }, []);
  
    return (
      <WebSocketContext.Provider value={websocket}>
        {children}
      </WebSocketContext.Provider>
    );
  };
  

