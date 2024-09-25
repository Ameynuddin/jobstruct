import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ defaultStats }) => {
    const chartRef = useRef(null);
    const barChartRef = useRef(null);

    useEffect(() => {
        if (defaultStats && defaultStats.length > 0) {
            const statuses = defaultStats.map(app => app._id);
            console.log('Statuses->', statuses)
            const counts = defaultStats.map(app => app.count);
            console.log('Counts->', counts)

            const ctx = chartRef.current.getContext('2d');

            // if (barChartRef.current) {
            //     barChartRef.current.destroy();
            // }

            barChartRef.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: statuses,
                    datasets: [{
                        label: 'Application Status',
                        data: counts,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)'
                        ],
                        hoverOffset: 8
                    }]
                }
            });
        }
    }, [defaultStats]);

    return (
        <>
            <div className="w-full flex flex-col items-center">
                <div className="w-full max-w-6xl">
                    {/* <canvas ref={chartRef} className="h-96"></canvas> */}
                    <canvas ref={chartRef} style={{ height: '400px', width: '400px' }}></canvas>

                </div>
            </div>
        </>
    )
}

export default BarChart;