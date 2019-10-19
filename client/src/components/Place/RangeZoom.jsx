import React from 'react';

function RangeZoom(props) {
  const { handleRangeChange } = props;


  return (
    <input type="range" min="0" max="40" onChange={(value) => handleRangeChange(value)} />
  );
}

export default RangeZoom;
