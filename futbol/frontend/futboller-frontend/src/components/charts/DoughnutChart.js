import React from 'react'
import { Doughnut } from 'react-chartjs-2'

import { generateRandomHexCodes } from '../../jsUtils/general'


export function DoughnutChart({
        title="",
        values,
        labels,
        colors=generateRandomHexCodes(values.length),
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
            <h2>{title}</h2>
            <Doughnut data={data} options={options} />
        </>
    )
}