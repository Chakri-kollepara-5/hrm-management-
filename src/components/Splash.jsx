import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Splash = ({ onComplete }) => {
  useEffect(() => {
    // Show splash for 3.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, letterSpacing: '0px' }}
        animate={{ scale: 1.5, opacity: 1, letterSpacing: '8px' }}
        transition={{ 
          duration: 2.5, 
          ease: "easeInOut",
          scale: { type: "spring", stiffness: 50 }
        }}
        exit={{ opacity: 0, scale: 2 }}
        className="text-center flex flex-col items-center justify-center"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 mb-6 text-[#FF9933] drop-shadow-[0_0_15px_rgba(255,153,51,0.8)]">
          <path d="M7 3v9c0 2.76 2.24 5 5 5s5-2.24 5-5V3h-2v9c0 1.66-1.34 3-3 3s-3-1.34-3-3V3H7z" />
          <path d="M12 21c-1.1 0-2-.9-2-2s2-3 2-3 2 1.9 2 3-.9 2-2 2z" />
        </svg>
        <h1 className="text-5xl md:text-7xl font-bold text-[#FF9933] uppercase drop-shadow-[0_0_15px_rgba(255,153,51,0.8)] tracking-widest font-['Poppins']">
          HARE
        </h1>
        <h1 className="text-5xl md:text-7xl font-bold text-[#FF9933] uppercase drop-shadow-[0_0_15px_rgba(255,153,51,0.8)] tracking-widest font-['Poppins'] mt-4">
          KRISHNA
        </h1>
      </motion.div>
    </div>
  );
};

export default Splash;
