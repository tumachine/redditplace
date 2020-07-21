import React, { useEffect, useRef, useState } from 'react';
import { IPlace, places } from '../services/board';
import ButtonColors from './ButtonColors';

interface Props {
  places: IPlace[],
  activePlace: number,
  colors: string[],
  activeColor: number,
  setActiveColor: (color: number) => void,
  handlePlaceChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Sidebar = (props: Props) => {
  return (
    <div className='sidebar'>
      <h2>{props.places[props.activePlace].name}</h2>
      <h2>Colors</h2>
      <ButtonColors 
        colors={props.colors} 
        activeColor={props.activeColor} 
        setActiveColor={props.setActiveColor} 
      />
      <h2>Places</h2>
      <select value={props.activePlace} className="sidebar__places" onChange={props.handlePlaceChange}>
          {/* // <option value={index}>{p.name}</option> */}
        {props.places.map((p, index) => 
          <option value={index}>{p.name}</option>
        )}
      </select>
    </div>
  )
}

export default Sidebar;
