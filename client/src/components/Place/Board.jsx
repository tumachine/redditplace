import React, { useEffect, useRef, useState } from 'react';

import {
  apiPost, apiGet,
} from '../../utils';
import './Board.css';

function Board(props) {
  const ref = useRef(null);

  const {
    width,
    height,
    colors,
    socket,
    color,
    buffer,
    loading,
  } = props;

  let canvas;
  let ctx;


  const drawPlace = () => {
    canvas = ref.current;
    ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    if (buffer) {
      const arr8 = new Uint8ClampedArray(buffer.data);
      const imageData = new ImageData(arr8, 100, 100);
      // console.log(buffer);

      ctx.putImageData(imageData, 0, 0);
      createImageBitmap(imageData).then((imgBitmap) => {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(imgBitmap, 0, 0, 100, 100, 0, 0, canvas.width, canvas.height);
      });
      console.log('Creating place from array');
      // }
    }
  };

  useEffect(() => {
    if (!buffer?.loading) {
      drawPlace();
    }
  }, [buffer]);


  useEffect(() => {
    if (!buffer?.loading) {
      drawPlace();
    }
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
    const res = await apiPost('/api/place/draw', {
      x: Math.floor(offsetX / (width / 100)),
      y: Math.floor(offsetY / (width / 100)),
      color,
      user_id: 1,
    });
  };

  // <canvas ref={ref} onMouseDown={onMouseDown} />

  return (
    <div>
      <canvas ref={ref} onMouseDown={onMouseDown} />
    </div>
  );
}

export default Board;
