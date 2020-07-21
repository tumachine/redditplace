import React, { useEffect, useState } from 'react';
import { Route, NavLink, HashRouter, BrowserRouter } from 'react-router-dom';
import Board from './components/Board';
import Sidebar from './components/Sidebar';
import { IPlace, places } from './services/board';

function App() {
  const [activeColor, setActiveColor] = useState(0)
  const [activePlace, setActivePlace] = useState(0);

  const [colors, setColors] = useState<string[]>([]);
  const [currentPlaces, setCurrentPlaces] = useState<IPlace[]>(null);

  useEffect(() => {
    init();
  }, [])

  // user needs to log in here

  const init = async () => {
    const resultPlaces = await places.getPlaces();
    console.log(resultPlaces);

    setCurrentPlaces(resultPlaces);
    setColors(resultPlaces[0].colors);
    setActiveColor(0);
    setActivePlace(0);
  }

  useEffect(() => {
    setActivePlace(activePlace);
  }, [currentPlaces])

  useEffect(() => {
    if (currentPlaces) {
      setColors(currentPlaces[activePlace].colors);
      setActiveColor(0);
    }
  }, [activePlace])


  const handlePlaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActivePlace(Number(event.currentTarget.value));
  }

  return (
    <div className='container'>
      { currentPlaces &&
        <Board 
          place={currentPlaces[activePlace]} 
          activeColor={activeColor} 
          colors={colors}
        ></Board>
      }
      {
        currentPlaces &&
        <Sidebar 
          handlePlaceChange={handlePlaceChange}
          setActiveColor={setActiveColor} 
          places={currentPlaces} 
          activePlace={activePlace}
          colors={colors} 
          activeColor={activeColor}
        ></Sidebar>
      }
    </div>
  );
}

export default App;
