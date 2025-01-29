import React from 'react';
import { motion } from 'framer-motion';
import './colorClash.css'

function Slot({ color, onClick }) {
  return (
    <div className="flex justify-center items-center w-full h-1/6" onClick={onClick}>
      {color && (
        <motion.div
          className={`w-12 h-12 rounded-full cursor-pointer ${getColorClass(color)} shadow-lg ball`}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        />
      )}
    </div>
  );
}

function getColorClass(color) {
  switch (color) {
    case 'red':
      return 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-800';
    case 'blue':
      return 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-800';
    case 'yellow':
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-700';
    case 'green':
      return 'bg-gradient-to-br from-green-500 to-green-700 shadow-green-800';
    case 'purple':
      return 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-800';
    default:
      return '';
  }
}

export default Slot;
