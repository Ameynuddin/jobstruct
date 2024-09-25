import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ defaultStats }) => {
    const chartRef = useRef(null);
    const barChartRef = useRef(null);

    useEffect(() => {
        if (defaultStats && Object.keys(defaultStats).length > 0) {
            const statuses = Object.keys(defaultStats);
            // console.log('Statuses->', statuses)
            const counts = Object.values(defaultStats);
            // console.log('Counts->', counts)

            const ctx = chartRef.current.getContext('2d');

            if (barChartRef.current) {
                barChartRef.current.destroy();
            }

            barChartRef.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: statuses,
                    datasets: [{
                        label: 'Application Status',
                        data: counts,
                        backgroundColor: [
                            'rgb(255, 205, 86)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 99, 132)'
                        ],
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,  
                    maintainAspectRatio: false 
                }
            });
        }
    }, [defaultStats]);

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-6xl">
                    <canvas ref={chartRef} className="h-96"></canvas>
                </div>
            </div>
        </>
    )
}

export default BarChart;