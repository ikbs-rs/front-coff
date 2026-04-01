  import React, { createContext, useContext, useEffect, useState } from 'react';
  import notificationSound from './bup.mp3';

  const AudioContextCtor =
      typeof window !== 'undefined'
          ? window.AudioContext || window.webkitAudioContext
          : null;
  const audioContext = AudioContextCtor ? new AudioContextCtor() : null;
  let audioBuffer;

  const ORDER_CHANGED_EVENT_IDS = new Set(['TRECA', 'TRECA22', 'COFF_ORDER_CHANGED']);

  const normalizeWsPayload = (messageOrPayload) => {
      if (!messageOrPayload) {
          return null;
      }

      if (typeof messageOrPayload === 'string') {
          try {
              return JSON.parse(messageOrPayload);
          } catch {
              return null;
          }
      }

      if (typeof messageOrPayload?.data === 'string') {
          try {
              return JSON.parse(messageOrPayload.data);
          } catch {
              return null;
          }
      }

      return messageOrPayload;
  };

  const getFirstWsEvent = (messageOrPayload) => {
      const payload = normalizeWsPayload(messageOrPayload);

      if (!payload) {
          return null;
      }

      return Array.isArray(payload?.data) ? payload.data[0] || null : payload;
  };

  export const isOrderChangedMessage = (messageOrPayload) => {
      const first = getFirstWsEvent(messageOrPayload);
      const eventId = String(first?.id ?? first?.type ?? '').trim().toUpperCase();
      const legacyId = String(first?.legacyId ?? '').trim().toUpperCase();

      return ORDER_CHANGED_EVENT_IDS.has(eventId) || ORDER_CHANGED_EVENT_IDS.has(legacyId);
  };

  export const shouldPlayOrderSound = (messageOrPayload) => {
      const first = getFirstWsEvent(messageOrPayload);

      if (!first || !isOrderChangedMessage(first)) {
          return false;
      }

      const normalizedStatus = String(first?.status ?? '').trim();
      return normalizedStatus === '1' || first?.notify === true || String(first?.id ?? '').trim().toUpperCase() === 'TRECA22';
  };

  export const buildOrderChangedMessage = (payload = {}) => {
      const kitchenRoom = buildKitchenRoomKey(
          payload.objId ?? payload.obj ?? payload.coff,
          payload.objTp ?? 'COFFLOC'
      );
      const userRoom = buildKitchenRoomKey(payload.userId ?? payload.usr, 'USER');
      const rooms = [
          ...(Array.isArray(payload.rooms) ? payload.rooms : []),
          kitchenRoom,
          userRoom,
      ].filter(Boolean);

      return JSON.stringify({
          type: 'COFF_ORDER_CHANGED',
          data: [
              {
                  id: 'COFF_ORDER_CHANGED',
                  legacyId: payload.notify ? 'TRECA22' : 'TRECA',
                  objTp: payload.objTp ?? 'COFFLOC',
                  ...payload,
                  rooms: [...new Set(rooms)]
              }
          ]
      });
  };

  export const buildKitchenRoomKey = (objId, objTp = 'COFFLOC') => {
      const normalizedObjId = String(objId ?? '').trim();

      if (!normalizedObjId) {
          return null;
      }

      return `${String(objTp || 'COFFLOC').trim().toUpperCase()}:${normalizedObjId}`;
  };

  export const buildKitchenSubscriptionMessage = ({ objId, objTp = 'COFFLOC', userId = null, username = null } = {}) =>
      JSON.stringify({
          type: 'subscribe',
          objId,
          objTp,
          userId,
          username,
          room: buildKitchenRoomKey(objId, objTp)
      });

  const fetchSound = async () => {
      if (!audioContext) return;

      const response = await fetch(notificationSound);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  };

  fetchSound();

  const playNotificationSound = async () => {
      if (!audioContext || !audioBuffer) return;

      try {
          if (audioContext.state === 'suspended') {
              await audioContext.resume();
          }

          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start();
      } catch (error) {
          console.warn('WS sound error:', error);
      }
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
          const payload = normalizeWsPayload(message);

          if (!payload) {
            console.warn('WS: nije JSON:', message?.data ?? message);
            return;
          }

          if (shouldPlayOrderSound(payload)) {
            void playNotificationSound();
          }

          console.log('WS payload:', payload);
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
  
      // Demo/test sender ostaje zakomentarisan za kasnije ručno testiranje.
      // const demo = setInterval(() => {
      //   const ws = wsRef.current;
      //   if (ws && ws.readyState === WebSocket.OPEN) {
      //     ws.send('{"data":[{"id":"PRVA11"}]}');
      //   }
      // }, 10000);
  
      return () => {
        clearInterval(hb);
        // clearInterval(demo);
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
  

