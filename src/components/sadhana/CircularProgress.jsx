import React from 'react'
import { motion } from 'framer-motion'

const CircularProgress = ({ current, total, label }) => {
  const percentage = Math.min(current / total, 1)
  const radius = 80
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle 
          cx="96" cy="96" r={radius} 
          stroke="currentColor" strokeWidth="12" fill="transparent" 
          className="text-saffron/10" 
        />
        <motion.circle 
          cx="96" cy="96" r={radius} 
          stroke="currentColor" strokeWidth="12" fill="transparent" 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-saffron" 
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold font-poppins">{current}/{total}</span>
        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{label}</span>
      </div>
    </div>
  )
}

export default CircularProgress
