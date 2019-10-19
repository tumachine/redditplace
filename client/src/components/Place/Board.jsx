import React, { useEffect, useRef, useState } from 'react';

import {
  apiPost, apiGet,
} from '../../utils';
import './Board.css';

function Board(props) {
  const ref = useRef(null);
  const [boardBitmap, setBoardBitmap] = useState('');

  let canvas;
  let ctx;

  let canvasBuffer = new ArrayBuffer(40000);
  const canvas32 = new Uint32Array(canvasBuffer);
  const canvas8 = new Uint8ClampedArray(canvasBuffer);

  const colorsBuffer = new ArrayBuffer(10000);
  const colors8 = new Uint8ClampedArray(colorsBuffer);
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


  const drawPlace = () => {
    const imageData = new ImageData(canvas8, 100, 100);

    ctx.putImageData(imageData, 0, 0);
  };


  useEffect(() => {
    const getBoard = async () => {
      const res = await apiGet('http://localhost:8080/api/place/board-bitmap');
      setBoardBitmap(atob(res.data));
    };
    getBoard();
  }, []);

  useEffect(() => {
    canvas = ref.current;
    canvas.width = ctx = canvas.getContext('2d');

    // buffer of bytes
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
      canvas32[i] = colors[colors8[i]];
    }

    drawPlace();
    // return () => {};
  }, [boardBitmap]);

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
      color: props.color,
      user_id: 1,
    });
    console.log(res);
  };

  return (
    <canvas
      ref={ref}
      onMouseDown={onMouseDown}
    />
  );
}

export default Board;
