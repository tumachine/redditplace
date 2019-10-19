// const socket = new WebSocket('ws://localhost:8080/ws');

class Socket {
  constructor() {
    this.socket = null;
    // this.socket = new WebSocket('ws://localhost:8080/ws');
  }

  connect(cb) {
    this.socket = new WebSocket('ws://localhost:8080/ws');
    console.log('Attempting connection...');

    this.socket.onopen = () => {
      console.log('Succesfully connected');
      // request /api/place/board and draw
    };
    this.socket.onmessage = (msg) => {
      console.log(msg);
      // draw a pixel
      cb(msg);
    };
    this.socket.onclose = (event) => {
      console.log('Socket Closed Connection: ', event);
    };
    this.socket.onerror = (error) => {
      console.log('Socket Error: ', error);
    };
  }

  disconnect() {
    this.socket.close();
  }

  sendMsg(msg) {
    console.log('Sending Message: ', msg);
    this.socket.send(msg);
  }
}

export default Socket;
