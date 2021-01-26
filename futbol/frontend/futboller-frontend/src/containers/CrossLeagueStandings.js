import React, { useState } from 'react'

import { getCrossLeagueStandings } from '../api/getApiData'

import { GridTable } from '../components/tables/Table'
import { ColumnsCrossLeagueTable, ColumnsCrossLeagueStats } from '../components/tables/TableColumns'

import { ScatterChart } from '../components/charts/ScatterChart'

import {
    ceil,
    generateRandomHexCode,
    getValuesByKey,
    max,
} from '../jsUtils/general'


export default function CrossLeagueStandings() {
    const [data, setData] = useState([]) // Will contain cross league standings data (array of objects)
    const updateData = () => {
        getCrossLeagueStandings()
            .then(function(response) {
                setData(response)
            })
    }

    const numberOfTopTeamsToShowInCharts = 50
    const getTopTeamsData = (arrayOfObjects) => arrayOfObjects.slice(0, numberOfTopTeamsToShowInCharts)
    const getTeamsArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "team")
    const getAvgPointsArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "avgPoints")
    
    return (
        <div>
            <h1>Cross League Standings - Top 5 Leagues</h1>
            <br />

            <form className="cross-league-table-form">
                <input
                    type="button"
                    value="Re-load"
                    onClick={updateData}
                />
            </form>

            {
                data.length > 0 ? 
                <>
                    <br /><br />
                    <GridTable
                        arrayOfObjects={data}
                        columnsData={ColumnsCrossLeagueTable}
                    />
                    <br /><br />
                    <GridTable
                        arrayOfObjects={data}
                        columnsData={ColumnsCrossLeagueStats}
                    />
                    <br /><br />
                    <ScatterChart
                        title={`AvgPoints vs AvgGoalDifference`}
                        xLabel="AvgPoints"
                        yLabel="AvgGoalDifference"
                        arrayOfObjects={getTopTeamsData(data)}
                        scatterLabelsArray={getTeamsArray(getTopTeamsData(data))}
                        xObj="avgPoints"
                        yObj="avgGoalDifference"
                        xLow={0}
                        xHigh={ceil(max(getAvgPointsArray(getTopTeamsData(data))))}
                        color={generateRandomHexCode()}
                    />
                    <br /><br />
                    <ScatterChart
                        title={`AvgGoalsScored vs AvgGoalsAllowed`}
                        xLabel="AvgGoalsScored"
                        yLabel="AvgGoalsAllowed"
                        arrayOfObjects={getTopTeamsData(data)}
                        scatterLabelsArray={getTeamsArray(getTopTeamsData(data))}
                        xObj="avgGoalsScored"
                        yObj="avgGoalsAllowed"
                        color={generateRandomHexCode()}
                    />
                </>
                : null
            }
        </div>
    )
}