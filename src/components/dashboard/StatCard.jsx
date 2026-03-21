import React from 'react'
import Card from '../ui/Card'

const StatCard = ({ label, value, sub, color = 'saffron' }) => {
  return (
    <Card 
      className="border-b-4"
      style={{ borderBottomColor: `var(--${color})` }}
    >
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold mt-2 font-poppins">{value}</h3>
      <p className="text-xs text-gray-400 mt-1 italic">{sub}</p>
    </Card>
  )
}

export default StatCard
