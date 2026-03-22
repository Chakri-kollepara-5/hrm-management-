import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Splash = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // 4.5 seconds for full animation experience
    return () => clearTimeout(timer);
  }, [onComplete]);

  const leafVariants = {
    initial: { scale: 0, rotate: -20, opacity: 0 },
    animate: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: "easeOut",
        delay: 0.5
      }
    }
  };

  const textVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: { 
        duration: 1, 
        ease: "easeOut",
        delay: 1.5 + (i * 0.4)
      }
    })
  };

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center z-[100] overflow-hidden">
      {/* Spiritual Aura / Glow */}
      <motion.div 
        variants={glowVariants}
        animate="animate"
        className="absolute w-[500px] h-[500px] bg-saffron/10 rounded-full blur-[120px]"
      />
      
      <div className="relative flex flex-col items-center">
        {/* Sacred Tilak & Tulasi Symbol - Precise Geometric Match */}
        <motion.div
          variants={leafVariants}
          initial="initial"
          animate="animate"
          className="mb-8 relative"
        >
          <svg width="180" height="250" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_40px_rgba(255,215,0,0.4)]">
            {/* The Tilak - Correct U-Shape from Reference */}
            <motion.path 
              d="M30 10 V60 C30 75 40 85 50 85 C60 85 70 75 70 60 V10" 
              stroke="url(#tilakGradient)" 
              strokeWidth="10" 
              strokeLinecap="butt"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
            
            {/* The connection point */}
            <motion.circle 
              cx="50" cy="85" r="5" 
              fill="url(#tilakGradient)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            />

            {/* The Tulasi Leaf - Teardrop shape from Reference */}
            <motion.path 
              d="M50 85 C50 85 70 100 70 115 C70 130 50 145 50 145 C50 145 30 130 30 115 C30 100 50 85 50 85Z" 
              fill="url(#tilakGradient)"
              initial={{ scale: 0, opacity: 0, y: -20 }}
              animate={{ scale: 0.85, opacity: 1, y: -15 }}
              transition={{ duration: 1.2, ease: "backOut", delay: 1.8 }}
            />

            <defs>
              <linearGradient id="tilakGradient" x1="50" y1="10" x2="50" y2="145" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F6C365" />
                <stop offset="1" stopColor="#EAB34F" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Divine Ripple Effect */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", delay: 2.5 }}
            className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-[#F6C365]/20 rounded-full"
          />
        </motion.div>

        {/* Devotional Text */}
        <div className="text-center">
          <motion.h1 
            custom={0}
            variants={textVariants}
            initial="initial"
            animate="animate"
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-saffron to-gold font-cinzel tracking-[0.3em] drop-shadow-sm"
          >
            HARE
          </motion.h1>
          <motion.h1 
            custom={1}
            variants={textVariants}
            initial="initial"
            animate="animate"
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-saffron to-gold font-cinzel tracking-[0.3em] mt-2 drop-shadow-sm"
          >
            KRISHNA
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 3, duration: 1 }}
            className="mt-8 text-white uppercase tracking-[0.5em] text-[10px] font-bold"
          >
            Experience the Divine
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Splash;

