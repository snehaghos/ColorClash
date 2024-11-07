import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Column from './components/Column';

const ColorClash = () => {
    const columns = 5;
    const slotsPerColumn = 6;
    const colors = ['red', 'blue', 'yellow', 'green', 'purple'];

    const initializeRandomTubes = () => {
        let ballColors = [];
        colors.forEach(color => ballColors.push(...Array(4).fill(color)));
        ballColors = ballColors.sort(() => Math.random() - 0.5);
        
        const tubes = Array.from({ length: columns }, (_, col) => {
            const columnBalls = ballColors.slice(col * (slotsPerColumn - 2), (col + 1) * (slotsPerColumn - 2));
            const lastBallColor = colors[col];
            return [null, ...columnBalls, lastBallColor];
        });

        return tubes;
    };

    const [tubes, setTubes] = useState(initializeRandomTubes);
    const [floatingBall, setFloatingBall] = useState(null);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(60);
    const [gameOver, setGameOver] = useState(false);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isPlayingWithTimer, setIsPlayingWithTimer] = useState(false);
    const [showPlayModal, setShowPlayModal] = useState(true);

    const reshuffleTubes = () => {
        setTubes(initializeRandomTubes());
        setFloatingBall(null);
        setScore(0);
        setTimer(60);
    };

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

        if (color && column.slice(1, -1).every(ball => ball === color)) {
            setScore(prevScore => prevScore + 20);
        }
    };

    useEffect(() => {
        if (isTimerActive && isPlayingWithTimer) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setGameOver(true);
                        setIsTimerActive(false);
                        setShowPlayModal(true);
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isTimerActive, isPlayingWithTimer]);

    const handleStartGame = (withTimer) => {
        setIsPlayingWithTimer(withTimer);
        setGameOver(false);
        setFloatingBall(null);
        setScore(0);
        setTimer(withTimer ? 120 : 0); 
        setTubes(initializeRandomTubes());
        setIsTimerActive(withTimer);
        setShowPlayModal(false);
    };

    const handleCloseGameOverModal = () => {
        setGameOver(false);
        setShowPlayModal(true);
        setIsTimerActive(false); 
        reshuffleTubes();
    };

    return (
        <>
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="absolute top-4 right-4 text-white text-xl">Score: {score}</div>
                {isPlayingWithTimer && (
                    <div className="absolute top-4 left-4 text-white text-xl bg-gray-700 p-2 rounded">
                        Timer: {timer}s
                    </div>
                )}

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
                    <motion.div
                        className={`absolute top-20 w-12 h-12 rounded-full ${getColorClass(floatingBall.color)} shadow-lg`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    ></motion.div>
                )}

                {showPlayModal && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-white p-6 rounded-md text-center text-black shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Choose Game Mode</h2>
                            <button
                                className="text-white bg-purple-500 p-2 rounded mb-2 w-full"
                                onClick={() => handleStartGame(true)}
                            >
                                Play with Timer
                            </button>
                            <button
                                className="text-white bg-green-500 p-2 rounded w-full"
                                onClick={() => handleStartGame(false)}
                            >
                                Play without Timer
                            </button>
                        </div>
                    </motion.div>
                )}

                {gameOver && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-white p-6 rounded-md text-center text-black shadow-lg relative w-80">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                onClick={handleCloseGameOverModal}
                            >
                                ✖
                            </button>
                            <h2 className="text-xl font-bold mb-4">Game Over</h2>
                            <p className="text-lg">Your score: {score}</p>
                            <p>Time played: {isPlayingWithTimer ? `${60 - timer}s` : 'N/A'}</p>
                            <button
                                className="mt-4 p-2 bg-purple-500 rounded text-white"
                                onClick={handleCloseGameOverModal}
                            >
                                Restart Game
                            </button>
                        </div>
                    </motion.div>
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
