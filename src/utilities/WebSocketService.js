// wsService.js

const WebSocketService = {
  socket: null,
  connect: function() {
    this.socket = new WebSocket('ws://brztest.ems.local/wsc');
    console.log('Uspešno povezan na WebSocket server ws://localhost:8341.');
    
    this.socket.onopen = () => {
      console.log('Uspešno povezan na WebSocket server.');
    };

    this.socket.onmessage = (message) => {
      console.log('Primljena poruka od servera:', message);
      // Ovde možete dalje rukovati pristiglim podacima, na primer, emitovanjem akcija koje će ažurirati stanje aplikacije.
    };

    this.socket.onclose = () => {
      console.log('Povezivanje servera:');
      this.socket = new WebSocket('ws://brztest.ems.local/wsc');
    };
  },
  disconnect: function() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
};

export default WebSocketService;
