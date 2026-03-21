import React from 'react'
import { motion } from 'framer-motion'

const CircularProgress = ({ current, total, label }) => {
  const percentage = Math.min(current / total, 1)
  const radius = 80
  const circumference = 2 * Math.PI * radius

  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <circle 
          cx="100" cy="100" r={radius} 
          stroke="currentColor" strokeWidth="12" fill="transparent" 
          className="text-saffron/10" 
        />
        <motion.circle 
          cx="100" cy="100" r={radius} 
          stroke="currentColor" strokeWidth="12" fill="transparent" 
          strokeDashoffset={circumference}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percentage) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          className="text-saffron" 
        />
      </svg>
    </div>
  )
}

export default CircularProgress
