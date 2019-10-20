import React, { useState, useEffect, useRef } from 'react';
import Socket from '../../websocket';

import apiURl from '../../api';
import Board from './Board';
import ColorButtons from './ColorButtons';
import RangeZoom from './RangeZoom';

import {
  apiPost, apiGet, apiAuthorize,
} from '../../utils';
import './Place.css';

function Place(props) {
  const [canDraw, setCanDraw] = useState(false);
  const [color, setColor] = useState(5);
  const [width, setWidth] = useState(1000);
  const [height, setHeight] = useState(1000);

  const socket = new Socket();

  const [buffer, setBuffer] = useState({
    loading: true,
    data: [],
  });

  const colors = [
    0xFFFFFFFF,
    0xFFE4E4E4,
    0xFF888888,
    0xFF222222,
    0xFFD1A7FF,
    0xFF0000E5,
    0xFF0095E5,
    0xFF426AA0,
    0xFF00D9E5,
    0xFF44E094,
    0xFF01BE02,
    0xFFF0E500,
    0xFFC78300,
    0xFFEA0000,
    0xFFFF4AE0,
    0xFF800082,
  ];

  const handleColorChange = (colorN) => {
    setColor(colorN);
  };

  const handleRangeChange = (e) => {
    console.log(e.target.value);
    setWidth(Number(e.target.value) * 100);
    setHeight(Number(e.target.value) * 100);
  };

  const getBoard = async () => {
    setBuffer({ loading: true });
    await apiGet('/api/place/board-bitmap')
      .then((response) => {
        const boardBitmap = atob(response.data);
        const boardArray = new Array(boardBitmap.length);
        for (let i = 0; i < boardBitmap.length; i += 1) {
          boardArray[i] = boardBitmap.charCodeAt(i);
        }

        // convert every byte to two colors of 4 bits
        const board8 = new Uint8ClampedArray(boardArray);
        const colors8 = new Uint8ClampedArray(new ArrayBuffer(10000));
        for (let i = 0; i < 5000; i += 1) {
          const colorOne = board8[i] >> 4;// eslint-disable-line no-bitwise
          const colorTwo = board8[i] & 0x0F;// eslint-disable-line no-bitwise

          colors8[i * 2] = colorOne;
          colors8[i * 2 + 1] = colorTwo;
        }

        // fill canvas with buffer
        const boardBuffer = new ArrayBuffer(40000);
        const canvas32 = new Uint32Array(boardBuffer);
        for (let i = 0; i < 10000; i += 1) {
          canvas32[i] = colors[colors8[i]];
        }
        console.log(boardBuffer);

        setBuffer({
          loading: false,
          data: boardBuffer,
        });
      });
  };

  const placePixel = (x, y, clr) => {
    setBuffer((prev) => {
      const canvas32 = new Uint32Array(prev.data);
      canvas32[x + 100 * y] = colors[clr];
      return { loading: false, data: canvas32.buffer };
    });
  };


  useEffect(() => {
    getBoard();

    socket.connect((msg) => {
      let pixel = JSON.parse(msg.data).body;
      pixel = JSON.parse(pixel);
      console.log('PIXEL: ', pixel);

      placePixel(pixel.x, pixel.y, pixel.color);
      console.log('Received pixel:');
      console.log(pixel.x, pixel.y, pixel.color);
    });
    return () => { socket.disconnect(); };
  }, []);

  return (
    <div>
      <h1>{`${color} ${width} ${height}`}</h1>
      <div>
        <ColorButtons colors={colors} handleColorChange={handleColorChange} />
      </div>

      <div>
        <RangeZoom handleRangeChange={handleRangeChange} />
      </div>
      <Board
        width={width}
        height={height}
        socket={socket}
        colors={colors}
        color={color}
        buffer={buffer}
      />
    </div>
  );
}

export default Place;
