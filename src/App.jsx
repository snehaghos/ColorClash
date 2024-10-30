// src/App.js
import React from 'react';


function App() {
  const columns = 4; // Number of columns
  const slotsPerColumn = 6; // Number of slots in each column

  return (
    <div className="flex justify-center items-center">
      <h1>ColorClash</h1>
      <div className="grid">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Column key={colIndex} slotsPerColumn={slotsPerColumn} />
        ))}
      </div>
    </div>
  );
}

export default App;
