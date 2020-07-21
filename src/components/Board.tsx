import React, { useEffect, useRef, useState } from 'react';
import Canvas from '../utils/canvas';
import { places, IPlace, IPixel } from '../services/board';
import Ws from '../services/websocket';

interface Props {
  place: IPlace,
  activeColor: number,
  colors: string[],
}

const Board = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = useRef<Canvas>(null);

  useEffect(() => {
    canvas.current = new Canvas(canvasRef.current);

    return () => {
      canvas.current.dispose();
    }
  }, []);


  useEffect(() => {
    if (!props.place) return;

    const url = `http://localhost:3001/${props.place.url}`;
    const randomNumber = Math.floor(Math.random() * 10000);
    const ws = new Ws(randomNumber.toString());

    ws.onPixelsMessage = (pixels: IPixel[]) => {
      canvas.current.placePixels(pixels);
    }

    ws.socket.onopen = (event) => {
      ws.joinPlace(props.place.name);
    }

    canvas.current.setPlace(url, props.place.colors);
  }, [props.place])

  useEffect(() => {
    canvas.current.onPlacingPixel = async (x: number, y: number) => {
      const pixel = await places.postPixel(props.place.name, x, y, props.activeColor);
    }
  }, [props.activeColor, props.place])


  return (
    <div className='canvas'>
      <canvas
        id='canvas'
        ref={canvasRef}
      ></canvas>
    </div>
  )
}

export default Board;