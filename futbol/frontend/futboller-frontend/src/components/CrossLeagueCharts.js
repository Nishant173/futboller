import React from 'react'
import { Scatter } from 'react-chartjs-2'
import {
    getAvgPtsAndAvgGdCoords,
    filterStandingsByLeague,
} from './utils'
import { getValuesByKey } from '../jsUtils/general'


/*
Returns array of objects containing data to be used in the CrossLeagueScatterChart's datasets.
The actual data will be (x, y) co-ordinates of AvgPoints and AvgGoalDifference (along with some styles).
*/
function getCrossLeagueScatterChartDatasets(crossLeagueStandingsArray) {
    let leagueNames = ['EPL', 'Bundesliga', 'La Liga', 'Ligue 1', 'Serie A']
    let standingsByLeague = filterStandingsByLeague(crossLeagueStandingsArray)
    let colorByLeague = {
        'EPL': '#E6174F',
        'Bundesliga': '#2D2FEA',
        'La Liga': '#1AE27D',
        'Ligue 1': '#D4EE0D',
        'Serie A': '#F17824',
    }
    let datasets = []
    for (let i = 0; i < leagueNames.length; i++) {
        let league = leagueNames[i]
        datasets.push({
            label: league,
            backgroundColor: colorByLeague[league],
            data: getAvgPtsAndAvgGdCoords(standingsByLeague[league]),
            radius: 10,
            hoverRadius: 14,
            borderColor: 'black',
        })
    }
    return datasets
}


// Scatter points colored by league
export function CrossLeagueScatterChartByLeague({ dataObj }) {
    const data = {
        datasets: getCrossLeagueScatterChartDatasets(dataObj)
    }
    const options = {
        title: {
            display: true,
            position: 'top',
            text: "Cross league scatter chart - By league (AvgPoints vs AvgGoalDifference)",
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
    }

    return (
        <>
            <Scatter data={data} options={options} />
        </>
    )
}


// Scatter points having team-name in tooltip
export function CrossLeagueScatterChartAllTeams({ dataObj }) {
    const teams = getValuesByKey(dataObj, "team")
    const coords = getAvgPtsAndAvgGdCoords(dataObj)
    const data = {
        labels: teams,
        datasets: [
            {
                backgroundColor: '#10EC5B',
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
            text: "Cross league scatter chart - With team names (AvgPoints vs AvgGoalDifference)",
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
        legend: {
            display: false,
        },
        tooltips: {
            callbacks: {
               label: function(tooltipItem, data) {
                    let teamName = data.labels[tooltipItem.index]
                    let avgPts = tooltipItem.xLabel
                    let avgGoalDiff = tooltipItem.yLabel
                    return `${teamName} (AvgPoints: ${avgPts}, AvgGoalDiff: ${avgGoalDiff})`
               }
            }
        },
    }

    return (
        <>
            <Scatter data={data} options={options} />
        </>
    )
}