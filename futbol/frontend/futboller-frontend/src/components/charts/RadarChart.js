import React from 'react'
import { Radar } from 'react-chartjs-2'


export function RadarChart({
        title="",
        values,
        labels,
        color="#6897EC",
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
            fontSize: 26,
            fontColor: 'black',
        },
        scale: {
            ticks: {
                beginAtZero: true,
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
            <Radar data={data} options={options} />
        </>
    )
}