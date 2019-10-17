const socket = new WebSocket('ws://localhost:8080/ws');

const connect = (cb) => {
  console.log('Attempting connection...');

  socket.onopen = () => {
    console.log('Succesfully connected');
    // request /api/place/board and draw
  };
  socket.onmessage = (msg) => {
    console.log(msg);
    // draw a pixel
    cb(msg);
  };
  socket.onclose = (event) => {
    console.log('Socket Closed Connection: ', event);
  };
  socket.onerror = (error) => {
    console.log('Socket Error: ', error);
  };
};

const sendMsg = (msg) => {
  console.log('Sending Message: ', msg);
  socket.send(msg);
};

export {connect, sendMsg};

