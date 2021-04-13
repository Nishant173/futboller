import { Scatter } from 'react-chartjs-2'


// Returns array of objects wherein each object represents Cartesian coordinates (x, y)
function getCartesianCoordinates(arrayOfObjects=[], xObj="", yObj="") {
    let coordinates = []
    arrayOfObjects.forEach((obj) => (
        coordinates.push({
            x: obj[xObj],
            y: obj[yObj],
        })
    ))
    return coordinates
}


export function ScatterChart({
        title="",
        xLabel="",
        yLabel="",
        arrayOfObjects,
        scatterLabelsArray,
        xObj="",
        yObj="",
        xLow=undefined,
        xHigh=undefined,
        yLow=undefined,
        yHigh=undefined,
        color="#10EC5B",
        height=125,
    }) {
    
    const coords = getCartesianCoordinates(arrayOfObjects, xObj, yObj)
    const data = {
        labels: scatterLabelsArray,
        datasets: [
            {
                backgroundColor: color,
                data: coords,
                radius: 10,
                hoverRadius: 14,
                borderColor: 'black',
            },
        ],
    }
    const options = {
        title: {
            display: true,
            position: 'top',
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
                    min: yLow,
                    max: yHigh,
                    fontSize: 15,
                    fontColor: 'black',
                },
            }],
        },
        legend: {
            display: false,
        },
        tooltips: {
            callbacks: {
               label: function(tooltipItem, data) {
                    let mainLabel = data.labels[tooltipItem.index]
                    let xLabelValue = tooltipItem.xLabel
                    let yLabelValue = tooltipItem.yLabel
                    return `${mainLabel} (${xLabel}: ${xLabelValue}, ${yLabel}: ${yLabelValue})`
               }
            }
        },
    }

    return (
        <>
            <Scatter data={data} options={options} height={height} />
        </>
    )
}