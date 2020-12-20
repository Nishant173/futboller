import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import {
    ceilBy,
    getTeamNames,
    getPoints,
    getGoalDifferences,
    getMaxOfAbsGoalDiff,
} from './utils';


export function LeagueTableBarChart({ dataObj }) {
    const league = dataObj[0]['league'];
    const season = dataObj[0]['season'];
    const teams = getTeamNames(dataObj);
    const points = getPoints(dataObj);
    const xLow = 0;
    const xHigh = ceilBy(dataObj[0]['points'], 10);
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
    const league = dataObj[0]['league'];
    const season = dataObj[0]['season'];
    const teams = getTeamNames(dataObj);
    const gds = getGoalDifferences(dataObj);
    const maxOfAbsGoalDiff = getMaxOfAbsGoalDiff(gds);
    const xLimit = ceilBy(maxOfAbsGoalDiff, 10);
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