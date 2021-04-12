import React from 'react'
import { HorizontalBar } from 'react-chartjs-2'


export function HorizontalBarChart({
        title="",
        xLabel="",
        yLabel="",
        xValues,
        yValues,
        xLow,
        xHigh,
        color="#167DEE",
    }) {
    
    const data = {
        labels: yValues,
        datasets: [
            {
                label: xLabel,
                data: xValues,
                backgroundColor: color,
            }
        ]
    }
    const options = {
        title: {
            display: true,
            text: title,
            fontSize: 24,
            fontColor: 'black',
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: xLabel,
                    fontSize: 20,
                    fontColor: 'black',
                },
                ticks: {
                    min: xLow,
                    max: xHigh,
                    fontSize: 15,
                    fontColor: 'black',
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: yLabel,
                    fontSize: 20,
                    fontColor: 'black',
                },
                ticks: {
                    fontSize: 15,
                    fontColor: 'black',
                },
            }],
        },
    }

    return (
        <>
            <HorizontalBar data={data} options={options} />
        </>
    )
}