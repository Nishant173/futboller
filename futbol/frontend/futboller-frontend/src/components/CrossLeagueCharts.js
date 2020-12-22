import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { getRandomHexCode, getAvgPtsAndGdCoordinates, filterByLeagues } from './utils';


/*
Returns array of objects containing data to be used in the CrossLeagueScatterChart's datasets.
The actual data will be (x, y) co-ordinates of AvgPoints and AvgGoalDifference.
*/
function getCrossLeagueScatterChartDatasets(crossLeagueStandingsArray) {
    let leagueNames = ['EPL', 'Bundesliga', 'La Liga', 'Ligue 1', 'Serie A']
    let standingsByLeague = filterByLeagues(crossLeagueStandingsArray)
    let datasets = []
    for (let i = 0; i < 5; i++) {
        let color = getRandomHexCode()
        let league = leagueNames[i]
        datasets.push({
            label: league,
            backgroundColor: color,
            data: getAvgPtsAndGdCoordinates(standingsByLeague[league]),
            radius: 10,
            hoverRadius: 14,
            borderColor: 'black',
        })
    }
    return datasets
}

export function CrossLeagueScatterChart({ dataObj }) {
    const data = {
        datasets: getCrossLeagueScatterChartDatasets(dataObj)
    }
    const options = {
        title: {
            display: true,
            position: 'top',
            text: "Cross league scatter chart (AvgPoints vs AvgGoalDifference)",
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