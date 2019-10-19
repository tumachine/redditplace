import React, { useState, useEffect, useRef } from 'react';
import Socket from '../../websocket';

import apiURl from '../../api';
import {
  apiPost, apiGet, apiAuthorize,
} from '../../utils';
import './Place.css';

function Place(props) {
  const ref = useRef();

  const [canDraw, setCanDraw] = useState(false);
  const [boardBitmap, setBoardBitmap] = useState('');

  const [username, setUsername] = useState('');

  const socket = new Socket();

  let canvas;
  let ctx;
  const width = 100;
  const height = 100;
  let scale = 1;
  let originx = 0;
  let originy = 0;

  let color = 5;

  let canvasBuffer = new ArrayBuffer(40000);
  const canvas32 = new Uint32Array(canvasBuffer);
  const canvas8 = new Uint8ClampedArray(canvasBuffer);

  const colorsBuffer = new ArrayBuffer(10000);
  const colors8 = new Uint8ClampedArray(colorsBuffer);
  const colorMap = {
    0: 0xFFFFFFFF,
    1: 0xFFE4E4E4,
    2: 0xFF888888,
    3: 0xFF222222,
    4: 0xFFD1A7FF,
    5: 0xFF0000E5,
    6: 0xFF0095E5,
    7: 0xFF426AA0,
    8: 0xFF00D9E5,
    9: 0xFF44E094,
    10: 0xFF01BE02,
    11: 0xFFF0E500,
    12: 0xFFC78300,
    13: 0xFFEA0000,
    14: 0xFFFF4AE0,
    15: 0xFF800082,
  };


  const drawPlace = () => {
    const imageData = new ImageData(canvas8, 100, 100);

    ctx.putImageData(imageData, 0, 0);
  };

  const placePixel = (x, y) => {
    // canvas32[x + 100 * y] = colorMap.get(color);
    canvas32[x + 100 * y] = colorMap[color];
  };

  async function VerifyUser() {
    try {
      const result = await apiAuthorize(`${apiURl}/auth/session`);
      if (!result.success) {
        // props.history.push('/login');
      }

      setUsername(result.data.username);
      setCanDraw(true);
    } catch (e) {
      console.error(e);
    }
  }

  async function GetBoardBitmap() {
    try {
      const res = await apiGet('http://localhost:8080/api/place/board-bitmap');
      if (!res.success) {
      // change state of component, notify of error
        return null;
      }
      setBoardBitmap(atob(res.data));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    canvasBuffer = new Array(boardBitmap.length);
    for (let i = 0; i < boardBitmap.length; i += 1) {
      canvasBuffer[i] = boardBitmap.charCodeAt(i);
    }

    // convert every byte to two colors of 4 bits
    const tempArr = new Uint8ClampedArray(canvasBuffer);
    for (let i = 0; i < 5000; i += 1) {
      const colorOne = tempArr[i] >> 4;// eslint-disable-line no-bitwise
      const colorTwo = tempArr[i] & 0x0F;// eslint-disable-line no-bitwise

      colors8[i * 2] = colorOne;
      colors8[i * 2 + 1] = colorTwo;
    }

    // fill canvas with buffer
    for (let i = 0; i < 10000; i += 1) {
      // canvas32[i] = colorMap.get(colors8[i]);
      canvas32[i] = colorMap[colors8[i]];
    }
  }, [boardBitmap]);

  useEffect(() => {
    canvas = ref.current;
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext('2d');


    // buffer of bytes
    GetBoardBitmap();

    VerifyUser();

    socket.connect((msg) => {
      let pixel = JSON.parse(msg.data).body;
      pixel = JSON.parse(pixel);
      console.log('PIXEL: ', pixel);

      placePixel(pixel.x, pixel.y, pixel.color);
      console.log('Received pixel:');
      console.log(pixel.x, pixel.y, pixel.color);
      drawPlace();
    });

    return () => { socket.disconnect(); };
  }, []);

  const onMouseDown = async ({ nativeEvent }) => {
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
      color,
      user_id: 1,
    });
    console.log(res);
  };


  const draw = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect(originx, originy, width / scale, height / scale);
  };

  const onMouseWheel = (e) => {
    const mousex = e.clientX;
    const mousey = e.clientY;
    const wheel = e.wheelDelta / 120;// n or -n

    const zoom = 1 + wheel / 2;

    ctx.translate(
      originx,
      originy,
    );
    ctx.scale(zoom, zoom);
    ctx.translate(
      -(mousex / scale + originx - mousex / (scale * zoom)),
      -(mousey / scale + originy - mousey / (scale * zoom)),
    );

    originx = (mousex / scale + originx - mousex / (scale * zoom));
    originy = (mousey / scale + originy - mousey / (scale * zoom));
    scale *= zoom;
    draw();
  };

  const hexToRgb = (hex) => {
    const b = (hex >> 16) & 255;// eslint-disable-line no-bitwise
    const g = (hex >> 8) & 255;// eslint-disable-line no-bitwise
    const r = hex & 255;// eslint-disable-line no-bitwise

    console.log('getting color');
    return `rgb(${r},${g},${b})`;
  };

  const buttons = Object.entries(colorMap)
    .map(([key, value]) => (
      <input
        type="button"
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: hexToRgb(value),
        }}
        onClick={() => { color = key; }}
        key={key}
      />
    ));

  return (
    <div>
      <div>
        {buttons}
      </div>
      <canvas
        onWheel={(e) => onMouseWheel(e)}
        ref={ref}
        onMouseDown={onMouseDown}
        style={{ imageRendering: 'pixelated' }}
      />
      <h1>{canDraw ? 'TRUE' : 'FALSE'}</h1>
      <h1>{username}</h1>
    </div>
  );
}

export default Place;
