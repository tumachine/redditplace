import React, { useEffect, useRef, useState } from 'react';

import {
  apiPost, apiGet,
} from '../../utils';
import './Board.css';

function Board(props) {
  const ref = useRef(null);
  const [boardBitmap, setBoardBitmap] = useState('');

  const {
    width, height, colors, socket, color,
  } = props;

  let canvas;
  let ctx;

  const [buffer, setBuffer] = useState(null);

  const drawPlace = () => {
    canvas = ref.current;
    ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    console.log(buffer);

    if (buffer) {
      const canvas8 = new Uint8ClampedArray(buffer);
      const imageData = new ImageData(canvas8, 100, 100);
      console.log(canvas8);

      ctx.putImageData(imageData, 0, 0);
      createImageBitmap(imageData).then((imgBitmap) => {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(imgBitmap, 0, 0, 100, 100, 0, 0, canvas.width, canvas.height);
      });
      console.log('Creating place from array');
    }
  };

  const placePixel = (x, y) => {
    const canvas32 = new Uint32Array(buffer);
    canvas32[x + 100 * y] = colors[color];
  };


  useEffect(() => {
    const getBoard = async () => {
      const res = await apiGet('http://localhost:8080/api/place/board-bitmap');
      setBoardBitmap(atob(res.data));
    };
    getBoard();
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    canvas = ref.current;
    ctx = canvas.getContext('2d');


    // buffer of bytes
    if (boardBitmap) {
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
      setBuffer(boardBuffer);

      drawPlace();
    // return () => {};
    }
  }, [boardBitmap]);

  useEffect(() => {
    drawPlace();
  }, [width, height]);

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

    console.log(
      Math.floor(offsetX / (width / 100)),
      Math.floor(offsetY / (width / 100)),
    );
    const res = await apiPost('http://localhost:8080/api/place/draw', {
      x: Math.floor(offsetX / (width / 100)),
      y: Math.floor(offsetY / (width / 100)),
      color,
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
