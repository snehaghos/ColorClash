// components/WinningModal.jsx
import { motion } from "framer-motion";

const WinningModal = ({ score, onPlayAgain }) => {
  return (
    <motion.div
      className="absolute inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-gradient-to-br from-green-400 via-green-600 to-green-800 border-2 border-white/30 rounded-3xl p-8 text-center text-white shadow-2xl backdrop-blur-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-5xl font-black mb-4">🎉 You Win!</h2>
        <p className="text-lg mb-6">Final Score: <span className="font-bold text-3xl">{score}</span></p>
        <button
          onClick={onPlayAgain}
          className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
};

export default WinningModal;
