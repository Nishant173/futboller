import React from 'react'
import { HorizontalBar, Line } from 'react-chartjs-2'
import {
    generateRandomHexCode,
    ceilByClosestMultiple,
    arange,
    getValuesByKey,
    maxOfAbsValues,
} from '../jsUtils/general'


export function LeaguePointsBarChart({ dataObj }) {
    const league = dataObj[0]['league']
    const season = dataObj[0]['season']
    const teams = getValuesByKey(dataObj, "team")
    const points = getValuesByKey(dataObj, "points")
    const xLow = 0
    const xHigh = ceilByClosestMultiple(dataObj[0]['points'], 10)
    const data = {
        labels: teams,
        datasets: [
            {
                label: 'Points',
                data: points,
                backgroundColor: '#167DEE',
            }
        ]
    }
    const options = {
        title: {
            display: true,
            text: `${league} (${season}) - Points chart`,
            fontSize: 32,
            fontColor: 'black',
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Points',
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
                    labelString: 'Teams',
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


export function LeagueGoalDifferenceBarChart({ dataObj }) {
    const league = dataObj[0]['league']
    const season = dataObj[0]['season']
    const teams = getValuesByKey(dataObj, "team")
    const gds = getValuesByKey(dataObj, "goalDifference")
    const maxOfAbsGoalDiff = maxOfAbsValues(gds)
    const xLimit = ceilByClosestMultiple(maxOfAbsGoalDiff, 10)
    const data = {
        labels: teams,
        datasets: [
            {
                label: 'Goal Difference',
                data: gds,
                backgroundColor: '#1DC591',
            }
        ]
    }
    const options = {
        title: {
            display: true,
            text: `${league} (${season}) - Goal Difference chart`,
            fontSize: 32,
            fontColor: 'black',
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Goal Difference',
                    fontSize: 20,
                    fontColor: 'black',
                },
                ticks: {
                    min: -xLimit,
                    max: xLimit,
                    fontSize: 15,
                    fontColor: 'black',
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Teams',
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


// Returns array of objects containing data to be used in the LeagueTitleRace chart's datasets
function getLeagueTitleRaceDatasets(teamsArray, cumPointsArray) {
    let datasets = []
    for (let i = 0; i < teamsArray.length; i++) {
        let color = generateRandomHexCode()
        datasets.push({
            label: teamsArray[i],
            data: cumPointsArray[i],
            borderColor: color,
            backgroundColor: color,
            borderWidth: 5,
            fill: false,
        })
    }
    return datasets
}


export function LeagueTitleRaceLineChart({ dataObj }) {
    const league = dataObj[0]['league']
    const season = dataObj[0]['season']
    const numTeamsToShow = 6
    const teams = getValuesByKey(dataObj, "team")
    const cumPoints = getValuesByKey(dataObj, "cumulativePoints")
    const cumPointsForFirstTeam = dataObj[0]['cumulativePoints']
    const numMatchdays = cumPointsForFirstTeam.length - 1
    const yLow = 0
    const yHigh = ceilByClosestMultiple(cumPointsForFirstTeam[numMatchdays], 10)
    const data = {
        labels: arange(0, numMatchdays),
        datasets: getLeagueTitleRaceDatasets(teams, cumPoints).slice(0, numTeamsToShow),
    }
    const options = {
        title: {
            display: true,
            text: `${league} (${season}) - League Title Race chart`,
            fontSize: 32,
            fontColor: 'black',
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,  
                    labelString: 'Matchday',
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
                    labelString: 'Points (Cumulative)',
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