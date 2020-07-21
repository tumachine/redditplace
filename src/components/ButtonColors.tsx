import React, { useEffect, useRef, useState } from 'react';
import { IPlace, places } from '../services/board';

interface ButtonColorsProps {
  colors: string[],
  activeColor: number,
  setActiveColor: (color: number) => void,
}

interface ButtonColorProps {
  colorHex: string,
  colorIndex: number,
  active: boolean,
  setActiveColor: (color: number) => void,
}

const ButtonColor = (props: ButtonColorProps) => {
  return (
    <div 
      className={`sidebar__buttoncolors__button ${props.active && 'sidebar__buttoncolors__button--active'}`}
      onClick={() => props.setActiveColor(props.colorIndex)}
      style={{backgroundColor: props.colorHex}}>
    </div>
  )
}

const ButtonColors = (props: ButtonColorsProps) => {
  return (
    <div className='sidebar__buttoncolors'>
      {props.colors.map((c, index) => (
        <ButtonColor 
          active={index === props.activeColor}
          colorHex={c} 
          colorIndex={index} 
          setActiveColor={props.setActiveColor}
        ></ButtonColor>
      ))}
    </div>
  )
}

export default ButtonColors;
