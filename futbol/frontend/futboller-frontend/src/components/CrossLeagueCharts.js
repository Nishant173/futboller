import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { getAvgPtsAndGdCoordinates } from './utils';


export function CrossLeagueScatterChart({ dataObj }) {
    const scatterChartDataset = getAvgPtsAndGdCoordinates(dataObj);
    const data = {
        datasets: [{
            label: 'AvgPoints vs AvgGoalDifference',
            data: scatterChartDataset,
            radius: 10,
            hoverRadius: 14,
            backgroundColor: '#76AFEE',
            borderColor: '#1D69BD',
        }]
    }
    const options = {
        title: {
            display: true,
            position: 'top',
            text: "Cross league scatter chart",
            fontSize: 32,
            fontColor: 'black',
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Avg Points',
                    fontSize: 20,
                    fontColor: 'black',
                },
                ticks: {
                    min: 0,
                    max: 3,
                    fontSize: 15,
                    fontColor: 'black',
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Avg Goal Difference',
                    fontSize: 20,
                    fontColor: 'black',
                },
                ticks: {
                    fontSize: 15,
                    fontColor: 'black',
                },
            }],
        },
        // tooltips: {
        //     callbacks: {
        //         label: function(tooltipItem, data) {
        //             let label = data.labels[tooltipItem.index];
        //             return label + ': (' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel + ')';
        //         }
        //     }
        // },
    }

    return (
        <>
            <Scatter data={data} options={options} />
        </>
    )
}