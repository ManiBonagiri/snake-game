import React from 'react';

const Controls = ({ onDirection, DIRECTIONS }) => (
  <div className="dpad">
    <button className="dpad-btn up" onClick={() => onDirection(DIRECTIONS.UP)}>▲</button>
    <div className="dpad-row">
      <button className="dpad-btn left" onClick={() => onDirection(DIRECTIONS.LEFT)}>◀</button>
      <div className="dpad-center" />
      <button className="dpad-btn right" onClick={() => onDirection(DIRECTIONS.RIGHT)}>▶</button>
    </div>
    <button className="dpad-btn down" onClick={() => onDirection(DIRECTIONS.DOWN)}>▼</button>
  </div>
);

export default Controls;
