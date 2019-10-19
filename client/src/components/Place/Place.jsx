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

  return (
    <div>
      <h1>{`${color} ${width} ${height}`}</h1>
      <div>
        <ColorButtons colors={colors} handleColorChange={handleColorChange} />
      </div>

      <div>
        <RangeZoom handleRangeChange={handleRangeChange} />
      </div>
      <Board width={width} height={height} socket={socket} colors={colors} color={color} />
    </div>
  );
}

export default Place;
