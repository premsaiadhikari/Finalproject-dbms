import React from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

export default function ProgressChart({ data }){
  const chart = {
    labels: ['Completed','Pending'],
    datasets: [{ data: [data, 100-data], backgroundColor:['#6C5CE7','#E2E8F0'] }]
  }
  return (
    <div className="w-full max-w-xs">
      <Pie data={chart} />
    </div>
  )
}
