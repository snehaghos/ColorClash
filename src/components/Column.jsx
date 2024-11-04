import React from 'react';
import Slot from './Slot';

function Column({ slots, onBallClick, onDrop }) {
  return (
    <div
      className="relative w-20 h-[320px] flex flex-col items-center bg-gray-800 rounded-t-lg border-4 border-white cursor-pointer"
      onClick={onDrop}
    >
      {slots.map((color, slotIndex) => (
        <Slot
          key={slotIndex}
          color={color}
          onClick={() => slotIndex === slots.findIndex(slot => slot !== null) && color && onBallClick()}
        />
      ))}
    </div>
  );
}

export default Column;
