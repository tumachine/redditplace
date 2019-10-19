import React, { useEffect, useState } from 'react';

function ColorButtons(props) {
  const { handleColorChange, colors } = props;
  const [buttons, setButtons] = useState([]);

  const hexToRgb = (hex) => {
    const b = (hex >> 16) & 255;// eslint-disable-line no-bitwise
    const g = (hex >> 8) & 255;// eslint-disable-line no-bitwise
    const r = hex & 255;// eslint-disable-line no-bitwise

    console.log('getting color');
    return `rgb(${r},${g},${b})`;
  };

  useEffect(() => (
    setButtons(colors.map((value, index) => (
      <input
        type="button"
        style={{
          width: '30px',
          height: '30px',
          backgroundColor: hexToRgb(value),
        }}
        onClick={() => { handleColorChange(index); }}
      />
    )))), []);

  return (
    <div>
      {buttons}
    </div>
  );
}

export default ColorButtons;
