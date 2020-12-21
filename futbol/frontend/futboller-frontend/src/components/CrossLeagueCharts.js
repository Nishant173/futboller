import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { getAvgPtsAndGdCoordinates, filterByLeague } from './utils';


export function CrossLeagueScatterChart({ dataObj }) {
    const dataObjEpl = filterByLeague(dataObj, "EPL")
    const dataObjBundesliga = filterByLeague(dataObj, "Bundesliga")
    const dataObjLaLiga = filterByLeague(dataObj, "La Liga")
    const dataObjLigue1 = filterByLeague(dataObj, "Ligue 1")
    const dataObjSerieA = filterByLeague(dataObj, "Serie A")
    const customStyles = {
        radius: 10,
        hoverRadius: 14,
        borderColor: 'black',
    }
    const data = {
        datasets: [
            {
                label: 'EPL',
                backgroundColor: '#76AFEE',
                data: getAvgPtsAndGdCoordinates(dataObjEpl),
                radius: customStyles['radius'],
                hoverRadius: customStyles['hoverRadius'],
                borderColor: customStyles['borderColor'],
            },
            {
                label: 'Bundesliga',
                backgroundColor: '#D41442',
                data: getAvgPtsAndGdCoordinates(dataObjBundesliga),
                radius: customStyles['radius'],
                hoverRadius: customStyles['hoverRadius'],
                borderColor: customStyles['borderColor'],
            },
            {
                label: 'La Liga',
                backgroundColor: '#0DE243',
                data: getAvgPtsAndGdCoordinates(dataObjLaLiga),
                radius: customStyles['radius'],
                hoverRadius: customStyles['hoverRadius'],
                borderColor: customStyles['borderColor'],
            },
            {
                label: 'Ligue 1',
                backgroundColor: '#E8F50F',
                data: getAvgPtsAndGdCoordinates(dataObjLigue1),
                radius: customStyles['radius'],
                hoverRadius: customStyles['hoverRadius'],
                borderColor: customStyles['borderColor'],
            },
            {
                label: 'Serie A',
                backgroundColor: '#EE35D7',
                data: getAvgPtsAndGdCoordinates(dataObjSerieA),
                radius: customStyles['radius'],
                hoverRadius: customStyles['hoverRadius'],
                borderColor: customStyles['borderColor'],
            },
        ]
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