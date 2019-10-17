import React, { Component } from 'react';
import Socket from '../websocket';
import apiURl from '../api';
import {
  apiPost, apiGet, apiAuthorize,
} from '../utils';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.socket = new Socket();
    this.onMouseDown = this.onMouseDown.bind(this);

    this.currentColor = 5;
    this.canvasBuffer = new ArrayBuffer(40000);
    this.canvas32 = new Uint32Array(this.canvasBuffer);
    this.canvas8 = new Uint8ClampedArray(this.canvasBuffer);

    this.colorsBuffer = new ArrayBuffer(10000);
    this.colors8 = new Uint8ClampedArray(this.colorsBuffer);
    this.colorMap = new Map([
      [0, 0xFFFFFFFF],
      [1, 0xFFE4E4E4],
      [2, 0xFF888888],
      [3, 0xFF222222],
      [4, 0xFFD1A7FF],
      [5, 0xFF0000E5],
      [6, 0xFF0095E5],
      [7, 0xFF426AA0],
      [8, 0xFF00D9E5],
      [9, 0xFF44E094],
      [10, 0xFF01BE02],
      [11, 0xFFF0E500],
      [12, 0xFFC78300],
      [13, 0xFFEA0000],
      [14, 0xFFFF4AE0],
      [15, 0xFF800082],
    ]);
    this.state = {
      canDraw: false,
      username: '',
    };
  }

  async componentDidMount() {
    this.canvas.width = 100;
    this.canvas.height = 100;
    this.ctx = this.canvas.getContext('2d');


    this.socket.connect((msg) => {
      // const messages = document.getElementById('messages');
      // messages.innerHTML += msg.data;

      let pixel = JSON.parse(msg.data).body;
      pixel = JSON.parse(pixel);
      console.log('PIXEL: ', pixel);

      this.placePixel(pixel.x, pixel.y, pixel.color);
      console.log('Received pixel:');
      console.log(pixel.x, pixel.y, pixel.color);
      this.drawPlace();
    });

    const res = await apiGet('http://localhost:8080/api/place/board-bitmap');
    // buffer of bytes
    if (!res.success) {
      // change state of component, notify of error
    }

    // convert base64 string to array
    const byteCharacters = atob(res.data);
    this.canvasBuffer = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i += 1) {
      this.canvasBuffer[i] = byteCharacters.charCodeAt(i);
    }

    // convert every byte to two colors of 4 bits
    const canvas8 = new Uint8ClampedArray(this.canvasBuffer);
    for (let i = 0; i < 5000; i += 1) {
      const colorOne = canvas8[i] >> 4;// eslint-disable-line no-bitwise
      const colorTwo = canvas8[i] & 0x0F;// eslint-disable-line no-bitwise

      this.colors8[i * 2] = colorOne;
      this.colors8[i * 2 + 1] = colorTwo;
    }

    // fill canvas with buffer
    for (let i = 0; i < 10000; i += 1) {
      this.canvas32[i] = this.colorMap.get(this.colors8[i]);
    }
    this.drawPlace();
    this.VerifyUser();
  }


  async onMouseDown({ nativeEvent }) {
    const { offsetX, offsetY } = nativeEvent;

    // const rect = this.canvas.getBoundingClientRect();
    // const scaleX = rect.width / 100;
    // const scaleY = rect.height / 100;

    // let mouseX = offsetX - rect.left;
    // let mouseY = offsetY - rect.top;

    // console.log(`X: ${mouseX} \nY: ${mouseY}`);

    // mouseX = Math.floor(mouseX / scaleX);
    // mouseY = Math.floor(mouseY / scaleY);

    const res = await apiPost('http://localhost:8080/api/place/draw', {
      x: offsetX,
      y: offsetY,
      color: this.currentColor,
      user_id: 1,
    });
    console.log(res);
  }

  async VerifyUser() {
    try {
      const res = await apiAuthorize(`${apiURl}/auth/session`);
      if (!res.success) {
        this.props.history.push('/login');
      }
      return this.setState((prevState) => ({
        ...prevState, username: res.data.username, canDraw: true,
      }));
    } catch (e) {
      return this.setState((prevState) => ({
        ...prevState, message: e.toString(),
      }));
    }
  }


  drawPlace() {
    const imageData = new ImageData(this.canvas8, 100, 100);

    this.ctx.putImageData(imageData, 0, 0);
  }

  placePixel(x, y, color) {
    this.canvas32[x + 100 * y] = this.colorMap.get(color);
  }

  render() {
    const { canDraw, username } = this.state;
    return (
      <div>
        <canvas
      // We use the ref attribute to get direct access to the canvas element.
          ref={(ref) => { this.canvas = ref; }}
          onMouseDown={this.onMouseDown}
          style={{ imageRendering: 'pixelated' }}
        />
        <h1>{canDraw ? 'TRUE' : 'FALSE'}</h1>
        <h1>{username}</h1>
      </div>
    );
  }
}

export default Canvas;
