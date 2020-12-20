import React from 'react';
import { Line, HorizontalBar } from 'react-chartjs-2';
import { ceilByTen, getTeamNames, getPoints, getGoalDifferences, getXlimitFromGD } from './utils';


export function LeagueTableLineChart({ dataObj }) {
    const data = {
        labels: Array.from(Array(dataObj[0].cumulativePoints.length).keys()), // getTeamNames(dataObj),
        datasets: [
            {
                label: 'Points over time',
                data: dataObj[0].cumulativePoints, // getPoints(dataObj),
                borderColor: '#238DD8',
                fill: true,
            }
        ]
    }

    return (
        <>
            <Line
                data={data}
                options={
                    {
                        title: {
                            display: true,
                            text: 'Points over time',
                            fontSize: 32,
                        },
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Matchday',
                                    fontSize: 20,
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Points',
                                    fontSize: 20,
                                }
                            }],
                        }
                    }
                }
            />
        </>
    )
}


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

    return (
        <>
            <HorizontalBar
                data={data}
                options={
                    {
                        title: {
                            display: true,
                            text: `Points chart - ${league} (${season})`,
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
                                    max: ceilByTen(dataObj[0].points),
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
                        }
                    }
                }
            />
        </>
    )
}


export function LeagueGoalDifferenceBarChart({ dataObj }) {
    const league = dataObj[0].league
    const season = dataObj[0].season
    const xLimit = ceilByTen(getXlimitFromGD(dataObj));
    
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

    return (
        <>
            <HorizontalBar
                data={data}
                options={
                    {
                        title: {
                            display: true,
                            text: `Goal Difference chart - ${league} (${season})`,
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
                        }
                    }
                }
            />
        </>
    )
}