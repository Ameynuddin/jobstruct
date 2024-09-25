import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ monthlyApplications }) => {
  const chartRef = useRef(null); //ref to <canvas> element
  const myChartRef = useRef(null); //holds chart instance

  useEffect(() => {
    if (monthlyApplications && monthlyApplications.length > 0) {
      const labels = monthlyApplications.map(app => app.date);
      const counts = monthlyApplications.map(app => app.count);

      const ctx = chartRef.current.getContext('2d');

      // Destroy previous chart instance if it exists to avoid memory leaks
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }

      // Create new chart instance
      myChartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels, // x-axis labels
          datasets: [{
            label: 'Monthly Applications',
            data: counts, // y-axis data
            backgroundColor: [
              'rgba(153, 102, 255, 0.4)',
              'rgba(255, 99, 132, 0.4)',
              'rgba(255, 159, 64, 0.4)',
              'rgba(54, 162, 235, 0.4)',
              'rgba(255, 205, 86, 0.4)',
              'rgba(75, 192, 192, 0.4)',
              'rgba(201, 203, 207, 0.4)'
            ],
            borderColor: [
              'rgba(153, 102, 255)',
              'rgba(255, 99, 132)',
              'rgba(255, 159, 64)',
              'rgba(54, 162, 235)',
              'rgba(255, 205, 86)',
              'rgba(75, 192, 192)',
              'rgba(201, 203, 207)'
            ],
            borderWidth: 1,
            barThickness: 100, // Set the bar thickness
            maxBarThickness: 100 // Maximum bar thickness
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: Math.ceil(Math.max(...counts) / 12)
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false  // Prevents distortion
        }
      });
    }
  }, [monthlyApplications]);

  return (
    <div>
      <canvas ref={chartRef} className="lg:h-96"></canvas>
    </div>
  )
}

export default ChartComponent;
