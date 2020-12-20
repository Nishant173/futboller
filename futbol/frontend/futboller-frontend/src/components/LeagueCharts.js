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
    const league = dataObj[0].league
    const season = dataObj[0].season
    const data = {
        labels: getTeamNames(dataObj),
        datasets: [
            {
                label: 'Points',
                data: getPoints(dataObj),
                backgroundColor: '#238DD8',
            }
        ]
    }
    const options = {
        title: {
            display: true,
            text: `${league} (${season}) - Points chart`,
            fontSize: 32,
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
                    min: 0,
                    max: ceilBy(dataObj[0].points, 10),
                    fontSize: 15,
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
                },
            }],
        },
    }

    return (
        <>
            <HorizontalBar
                data={data}
                options={options}
            />
        </>
    )
}


export function LeagueGoalDifferenceBarChart({ dataObj }) {
    const league = dataObj[0].league
    const season = dataObj[0].season
    const xLimit = ceilBy(getMaxOfAbsGoalDiff(dataObj), 10);
    const data = {
        labels: getTeamNames(dataObj),
        datasets: [
            {
                label: 'Goal Difference',
                data: getGoalDifferences(dataObj),
                backgroundColor: '#152B3A',
            }
        ]
    }
    const options = {
        title: {
            display: true,
            text: `${league} (${season}) - Goal Difference chart`,
            fontSize: 32,
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
                },
            }],
        },
    }

    return (
        <>
            <HorizontalBar
                data={data}
                options={options}
            />
        </>
    )
}