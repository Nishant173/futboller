import { Line } from 'react-chartjs-2'

import { LengthMismatchError } from '../../jsUtils/errors'
import { generateRandomHexCodes } from '../../jsUtils/general'


/*
Takes in an array of labels, and an array of array of numbers (2D array), wherein each sub-array corresponds to one respective label.
Returns array of objects having data to be used in MultiLineCharts.
Each object in the array will have a `label` (usually a string) and `data` (array of numbers corresponding to said label).
*/
export function getMultiLineChartDatasets(
        lineLabelsArray,
        arrayOfArraysOfNumbers,
        colors=generateRandomHexCodes(lineLabelsArray.length)
    ) {
    if (lineLabelsArray.length !== arrayOfArraysOfNumbers.length) {
        throw LengthMismatchError("The labels array and the 2D array of numbers must be of same length")
    }
    let datasets = []
    for (let i = 0; i < lineLabelsArray.length; i++) {
        datasets.push({
            label: lineLabelsArray[i],
            data: arrayOfArraysOfNumbers[i],
            borderColor: colors[i],
            backgroundColor: colors[i],
            borderWidth: 5,
            fill: false,
        })
    }
    return datasets
}


export function MultiLineChart({
        title="",
        xLabel="",
        yLabel="",
        xTicks=[],
        datasets=[],
        datasetsSlicer=[], // Array of 2 integers, indicating positions to slice `datasets` array
        yLow=undefined,
        yHigh=undefined,
    }) {
    
    datasets = datasets.slice(datasetsSlicer[0] - 1, datasetsSlicer[1])
    const data = {
        labels: xTicks,
        datasets: datasets,
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
                    min: yLow,
                    max: yHigh,
                    fontSize: 15,
                    fontColor: 'black',
                },
            }],
        },
    }

    return (
        <>
            <Line data={data} options={options} />
        </>
    )
}