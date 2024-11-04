import React, { useState, useEffect } from 'react';
import Column from './components/Column';

const ColorClash = () => {
    const columns = 5;
    const slotsPerColumn = 6;
    const colors = ['red', 'blue', 'yellow', 'green', 'purple'];
    const totalBalls = columns * (slotsPerColumn - 1);


    const initializeRandomTubes = () => {
        let ballColors = [];
        colors.forEach(color => ballColors.push(...Array(5).fill(color)));
        ballColors = ballColors.sort(() => Math.random() - 0.5);

        const tubes = Array.from({ length: columns }, (_, col) =>
            [null, ...ballColors.slice(col * (slotsPerColumn - 1), (col + 1) * (slotsPerColumn - 1))]
        );

        return tubes;
    };

    const [tubes, setTubes] = useState(initializeRandomTubes);
    const [floatingBall, setFloatingBall] = useState(null);
    const [score, setScore] = useState(0);

    const handleBallClick = (colIndex) => {
        const topIndex = tubes[colIndex].findIndex(color => color !== null);
        if (topIndex !== -1 && !floatingBall) {
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
            const emptyIndex = tubes[targetColIndex].lastIndexOf(null);

            if (emptyIndex !== -1) {
                const targetTopColor = emptyIndex > 0
                    ? tubes[targetColIndex][emptyIndex - 1]
                    : null;

                if (!targetTopColor || targetTopColor === floatingBall.color) {
                    setTubes(prev => {
                        const newTubes = prev.map((col, index) => [...col]);
                        newTubes[targetColIndex][emptyIndex] = floatingBall.color;
                        return newTubes;
                    });
                    setFloatingBall(null);
                    checkCompletion(targetColIndex);
                }
            }
        }
    };

    const checkCompletion = (colIndex) => {
        const column = tubes[colIndex];
        const color = column[1];

        if (color && column.slice(1).every(ball => ball === color)) {
            setScore(prevScore => prevScore + 20);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="absolute top-4 right-4 text-white text-xl">Score: {score}</div>
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
                 <div className="absolute  text-white text-xl">Reshuffle</div>
                {/* <div className='px-6 py-8 bg-slate-100/50 rounded-md flex justify-center items-center w-16 h-6'>
                        Reshuffle
                    </div> */}
                {floatingBall && (
                    <div
                        className={`absolute top-20 w-12 h-12 rounded-full ${getColorClass(floatingBall.color)} shadow-lg`}
                    ></div>
                )}
            </div>

        </>
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
