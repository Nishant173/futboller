import React from 'react'
import { Doughnut } from 'react-chartjs-2'

import { generateRandomHexCodes } from '../../jsUtils/general'


export function DoughnutChart({
        title="",
        values,
        labels,
        colors=generateRandomHexCodes(values.length),
        height=undefined,
        width=undefined,
    }) {
    
    const data = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                borderWidth: 1,
            },
        ]
    }
    const options = {
        cutoutPercentage: 65,
        elements: {
            arc: {
                hoverBorderColor: "grey",
                hoverBorderWidth: 5,
            }
        }
    }

    return (
        <>
            <h2 style={{fontSize: 24, fontColor: 'black'}}>
                { title }
            </h2>
            <Doughnut data={data} options={options} height={height} width={width} />
        </>
    )
}