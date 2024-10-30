import React from 'react';

function Slot({ color, onClick }) {
  return (
    <div className="flex justify-center items-center w-full h-1/6" onClick={onClick}>
      {color && (
        <div
          className={`w-12 h-12 rounded-full shadow-lg cursor-pointer ${getColorClass(color)}`}
        ></div>
      )}
    </div>
  );
}


function getColorClass(color) {
    switch (color) {
        case 'red':
            return 'bg-red-500';
        case 'blue':
            return 'bg-blue-500';
        case 'yellow':
            return 'bg-yellow-500';
        case 'green':
            return 'bg-green-500';
        case 'purple':
            return 'bg-purple-500';
        default:
            return '';
    }
}

export default Slot;
