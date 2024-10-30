import React, { useState } from 'react';
import Column from './components/Column';

const ColorClash = () => {
    const columns = 5;
    const slotsPerColumn = 6;
    const colors = ['red', 'blue', 'yellow', 'green', 'purple'];

   
    const [tubes, setTubes] = useState(
        colors.map(color => Array(slotsPerColumn - 1).fill(color).concat([null]))
    );
    const [floatingBall, setFloatingBall] = useState(null);

    const handleBallClick = (colIndex) => {
      
        const topIndex = tubes[colIndex].lastIndexOf(null) - 1;

        if (topIndex >= 0 && !floatingBall) {  
            const color = tubes[colIndex][topIndex];
            setFloatingBall({ color, fromCol: colIndex });

            
            setTubes(prev => {
                const newTubes = prev.map((col, index) => [...col]);
                newTubes[colIndex][topIndex] = null;
                return newTubes;
            });
        }
    };

    const handleDrop = (targetColIndex) => {
        if (floatingBall) {
            
            const targetTopIndex = tubes[targetColIndex].lastIndexOf(null);

            if (targetTopIndex >= 0) {
                const targetColor = targetTopIndex < slotsPerColumn - 1 ? tubes[targetColIndex][targetTopIndex + 1] : null;

                if (!targetColor || targetColor === floatingBall.color) {
                    setTubes(prev => {
                        const newTubes = prev.map((col, index) => [...col]);
                        newTubes[targetColIndex][targetTopIndex] = floatingBall.color;
                        return newTubes;
                    });
                    setFloatingBall(null); 
                }
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="flex gap-8">
                {tubes.map((column, colIndex) => (
                    <Column
                        key={colIndex}
                        slots={column}
                        onBallClick={() => handleBallClick(colIndex)}
                        onDrop={() => handleDrop(colIndex)}
                    />
                ))}
            </div>
            {floatingBall && (
                <div
                    className={`absolute top-20 w-12 h-12 rounded-full ${getColorClass(floatingBall.color)} shadow-lg`}
                ></div>
            )}
        </div>
    );
};

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

export default ColorClash;
