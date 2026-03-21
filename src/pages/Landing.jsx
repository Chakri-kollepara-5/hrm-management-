import React from 'react';
import { motion } from 'framer-motion';

const Landing = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-[#FFF8E7] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center max-w-4xl px-4"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-8 border-4 border-saffron"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-saffron">
            <path d="M7 3v9c0 2.76 2.24 5 5 5s5-2.24 5-5V3h-2v9c0 1.66-1.34 3-3 3s-3-1.34-3-3V3H7z" />
            <path d="M12 21c-1.1 0-2-.9-2-2s2-3 2-3 2 1.9 2 3-.9 2-2 2z" />
          </svg>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-['Poppins']">
          Welcome to <span className="text-saffron">Folkvizag</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Your spiritual journey and community engagement, beautifully managed in one place. Connect, track your sadhana, and participate in enriching events.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLoginClick}
            className="px-8 py-4 bg-saffron text-white rounded-xl font-semibold shadow-lg shadow-saffron/30 hover:scale-105 transition-all text-lg w-full sm:w-auto flex items-center justify-center gap-2"
          >
            Sign In / Sign Up
            <span className="text-xl">→</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
