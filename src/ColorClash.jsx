"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Column from "./components/Column"

const ColorClash = () => {
    const columns = 5
    const slotsPerColumn = 6
    const colors = ["red", "blue", "yellow", "green", "purple"]

    const audioRefs = useRef({
        ballClick: new Audio("/sounds/ball-click.mp3"),
        ballDrop: new Audio("/sounds/ball-drop.mp3"),
        completion: new Audio("/sounds/completion.mp3"),
        gameOver: new Audio("/sounds/game-over.mp3"),
        background: new Audio("/sounds/background.mp3"),
        error: new Audio("/sounds/error.mp3"),
    })

    const initializeRandomTubes = () => {
        let ballColors = []
        colors.forEach((color) => ballColors.push(...Array(4).fill(color)))
        ballColors = ballColors.sort(() => Math.random() - 0.5)

        const tubes = Array.from({ length: columns }, (_, col) => {
            const columnBalls = ballColors.slice(col * (slotsPerColumn - 2), (col + 1) * (slotsPerColumn - 2))
            const lastBallColor = colors[col]
            return [null, ...columnBalls, lastBallColor]
        })
        return tubes
    }

    const [tubes, setTubes] = useState(initializeRandomTubes)
    const [floatingBall, setFloatingBall] = useState(null)
    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(60)
    const [gameOver, setGameOver] = useState(false)
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [isPlayingWithTimer, setIsPlayingWithTimer] = useState(false)
    const [showPlayModal, setShowPlayModal] = useState(true)
    const [particles, setParticles] = useState([])
    const [completedTubes, setCompletedTubes] = useState(Array(columns).fill(false));

    // play soundddddddd
    const playSound = (soundName) => {
        try {
            const audio = audioRefs.current[soundName]
            if (audio) {
                audio.currentTime = 0
                audio.play().catch((e) => console.log("Audio play failed:", e))
            }
        } catch (error) {
            console.log("Sound error:", error)
        }
    }

    // create particle effect
    const createParticles = (x, y, color) => {
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            x,
            y,
            color,
            angle: i * 45 * (Math.PI / 180),
            velocity: Math.random() * 3 + 2,
        }))
        setParticles((prev) => [...prev, ...newParticles])
        setTimeout(() => {
            setParticles((prev) => prev.filter((p) => !newParticles.includes(p)))
        }, 1000)
    }

    const reshuffleTubes = () => {
        setTubes(initializeRandomTubes())
        setFloatingBall(null)
        setScore(0)
        setTimer(60)
        setParticles([])
    }

    const handleBallClick = (colIndex) => {
        const topIndex = tubes[colIndex].findIndex((color) => color !== null)
        if (topIndex !== -1 && !floatingBall) {
            const color = tubes[colIndex][topIndex]
            setFloatingBall({ color, fromCol: colIndex })
            playSound("ballClick")

            setTubes((prev) => {
                const newTubes = prev.map((col, index) => [...col])
                newTubes[colIndex][topIndex] = null
                return newTubes
            })
        }
    }

 const handleDrop = (targetColIndex) => {
  if (floatingBall) {
    const emptyIndex = tubes[targetColIndex].lastIndexOf(null);
    if (emptyIndex !== -1) {
      const targetTopColor = emptyIndex > 0 ? tubes[targetColIndex][emptyIndex - 1] : null;
      if (!targetTopColor || targetTopColor === floatingBall.color) {
        setTubes((prev) => {
          const newTubes = prev.map((col, index) => [...col]);
          newTubes[targetColIndex][emptyIndex] = floatingBall.color;

          // checkinfg for completion  after placing the ball
          const column = newTubes[targetColIndex];
          const nonNullBalls = column.filter((ball) => ball !== null);
          if (nonNullBalls.length === 5) {
            const isSameColor = nonNullBalls.every((ball) => ball === nonNullBalls[0]);
            if (isSameColor) {
              setScore((prevScore) => prevScore + 20);
              playSound("completion");
              createParticles(targetColIndex * 120 + 60, 200, nonNullBalls[0]);
              newTubes[targetColIndex] = Array(slotsPerColumn).fill(null);
            }
          }

          return newTubes;
        });
        setFloatingBall(null);
        playSound("ballDrop");
      } else {
        playSound("error");
      }
    } else {
      playSound("error");
    }
  }
};

    const checkCompletion = (colIndex) => {
        const column = tubes[colIndex]

        // 5 balls
        const nonNullBalls = column.filter((ball) => ball !== null)

        if (nonNullBalls.length === 5) {
            const isSameColor = nonNullBalls.every((ball) => ball === nonNullBalls[0])
            if (isSameColor) {
                setScore((prevScore) => prevScore + 20)
                playSound("completion")
                createParticles(colIndex * 120 + 60, 200, nonNullBalls[0])

                // clear completed column(for instant win)
                const newTubes = [...tubes]
                newTubes[colIndex] = Array(slotsPerColumn).fill(null)
                setTubes(newTubes)
            }
        }
    }

    useEffect(() => {
        if (isTimerActive && isPlayingWithTimer) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        setGameOver(true)
                        setIsTimerActive(false)
                        setShowPlayModal(true)
                        playSound("gameOver")
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(interval)
        }
    }, [isTimerActive, isPlayingWithTimer])

    const handleStartGame = (withTimer) => {
        setIsPlayingWithTimer(withTimer)
        setGameOver(false)
        setFloatingBall(null)
        setScore(0)
        setTimer(withTimer ? 120 : 0)
        setTubes(initializeRandomTubes())
        setIsTimerActive(withTimer)
        setShowPlayModal(false)
        setParticles([])

        // start background music
        const bgMusic = audioRefs.current.background
        if (bgMusic) {
            bgMusic.loop = true
            bgMusic.volume = 0.3
            bgMusic.play().catch((e) => console.log("Background music failed:", e))
        }
    }

    const handleCloseGameOverModal = () => {
        setGameOver(false)
        setShowPlayModal(true)
        setIsTimerActive(false)
        reshuffleTubes()

        // stop background music
        const bgMusic = audioRefs.current.background
        if (bgMusic) {
            bgMusic.pause()
            bgMusic.currentTime = 0
        }
    }

    const getColorClass = (color) => {
        switch (color) {
            case "red":
                return "bg-gradient-to-br from-red-400 via-red-500 to-red-700"
            case "blue":
                return "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700"
            case "yellow":
                return "bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600"
            case "green":
                return "bg-gradient-to-br from-green-400 via-green-500 to-green-700"
            case "purple":
                return "bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700"
            default:
                return ""
        }
    }

    return (
        <div className="relative min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 overflow-hidden font-mono">
            {/* background bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute w-20 h-20 bg-white/10 rounded-full"
                    style={{ top: "20%", left: "10%" }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute w-32 h-32 bg-white/10 rounded-full"
                    style={{ top: "60%", right: "15%" }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 2,
                    }}
                />
                <motion.div
                    className="absolute w-16 h-16 bg-white/10 rounded-full"
                    style={{ bottom: "20%", left: "20%" }}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 4,
                    }}
                />
            </div>

            {/* score display */}
            <motion.div
                className="absolute top-8 right-8 bg-black/80 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-4 text-white text-center shadow-2xl z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-sm opacity-80 mb-1">Score</div>
                <div className="text-2xl font-bold">{score}</div>
            </motion.div>

            {/* timer display */}
            {isPlayingWithTimer && (
                <motion.div
                    className={`absolute top-8 left-8 bg-black/80 backdrop-blur-lg border-2 rounded-2xl p-4 text-white text-center shadow-2xl z-10 ${timer <= 10 ? "border-red-500 animate-pulse" : "border-white/20"
                        }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="text-sm opacity-80 mb-1">Time</div>
                    <div className="text-2xl font-bold">{timer}s</div>
                </motion.div>
            )}

            {/* game board */}
            <div className="flex gap-8 z-5 relative">
                {tubes.map((column, colIndex) => (
                    <Column
                        key={colIndex}
                        slots={column}
                        onBallClick={() => handleBallClick(colIndex)}
                        onDrop={() => handleDrop(colIndex)}
                        isActive={floatingBall?.fromCol === colIndex}
                        getColorClass={getColorClass}
                    />
                ))}
            </div>

            {/* floating ball */}
            <AnimatePresence>
                {floatingBall && (
                    <motion.div
                        className={`absolute top-[10%] left-1/2 w-12 h-12 rounded-full z-20 shadow-2xl ${getColorClass(
                            floatingBall.color,
                        )}`}
                        style={{ transform: "translateX(-50%)" }}
                        initial={{ y: -20, opacity: 0, scale: 0.8 }}
                        animate={{
                            y: [-10, 0, -10],
                            opacity: 1,
                            scale: [0.8, 1.1, 1],
                            rotate: [0, 360],
                        }}
                        exit={{ y: -20, opacity: 0, scale: 0.8 }}
                        transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            rotate: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        }}
                    >
                        <div className="absolute top-3 left-4 w-4 h-4 bg-white/60 rounded-full blur-sm" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* particle effects */}
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className={`absolute w-2 h-2 rounded-full z-15 ${getColorClass(particle.color)}`}
                        initial={{
                            x: particle.x,
                            y: particle.y,
                            opacity: 1,
                            scale: 1,
                        }}
                        animate={{
                            x: particle.x + Math.cos(particle.angle) * particle.velocity * 50,
                            y: particle.y + Math.sin(particle.angle) * particle.velocity * 50,
                            opacity: 0,
                            scale: 0,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    />
                ))}
            </AnimatePresence>

            {/* Play modal */}
            <AnimatePresence>
                {showPlayModal && (
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 border-2 border-white/30 rounded-3xl p-8 text-center text-white shadow-2xl backdrop-blur-lg"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-4xl font-black mb-2 text-shadow">Color Clash</h2>
                            <p className="text-lg opacity-80 mb-8">Choose your game mode</p>
                            <div className="flex flex-col gap-4">
                                <motion.button
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                                    onClick={() => handleStartGame(true)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-xl">⏱️</span>
                                    Timed Challenge
                                </motion.button>
                                <motion.button
                                    className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                                    onClick={() => handleStartGame(false)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="text-xl">🧘</span>
                                    Relaxed Mode
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Game over modal */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 border-2 border-white/30 rounded-3xl p-8 text-center text-white shadow-2xl backdrop-blur-lg relative"
                            initial={{ scale: 0.8, opacity: 0, rotateX: -90 }}
                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotateX: 90 }}
                            transition={{ duration: 0.5 }}
                        >
                            <button
                                className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl transition-colors"
                                onClick={handleCloseGameOverModal}
                            >
                                ✖
                            </button>
                            <h2 className="text-5xl font-black mb-6 text-shadow">Game Over!</h2>
                            <div className="flex justify-around mb-8">
                                <div className="flex flex-col items-center">
                                    <span className="text-sm opacity-80 mb-2">Final Score</span>
                                    <span className="text-3xl font-bold">{score}</span>
                                </div>
                                {isPlayingWithTimer && (
                                    <div className="flex flex-col items-center">
                                        <span className="text-sm opacity-80 mb-2">Time Played</span>
                                        <span className="text-3xl font-bold">{120 - timer}s</span>
                                    </div>
                                )}
                            </div>
                            <motion.button
                                className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                                onClick={handleCloseGameOverModal}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Play Again
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ColorClash
