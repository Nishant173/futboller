import React from 'react'
import { Radar } from 'react-chartjs-2'


export function RadarChart({
        title="",
        values,
        labels,
        color="#6897EC",
        scaleTicksMin=undefined,
        scaleTicksMax=undefined,
        height=undefined, // Must be a number
    }) {

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Reading",
                data: values,
                backgroundColor: color,
                borderWidth: 1,
                fill: true,
            },
        ]
    }
    const options = {
        title: {
            display: true,
            text: title,
            fontSize: 24,
            fontColor: 'black',
        },
        scale: {
            ticks: {
                beginAtZero: true,
                min: scaleTicksMin,
                max: scaleTicksMax,
            },
            gridLines: {
                lineWidth: 3,
            },
            pointLabels: {
                fontSize: 15,
                fontColor: "black",
            },
        },
    }

    return (
        <>
            <Radar data={data} options={options} height={height} />
        </>
    )
}