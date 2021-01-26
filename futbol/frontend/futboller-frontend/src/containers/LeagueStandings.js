import React, { useState } from 'react'

import { getLeagueStandings } from '../api/getApiData'

import { GridTable } from '../components/tables/Table'
import { ColumnsLeagueTable, ColumnsLeagueStats } from '../components/tables/TableColumns'

import { HorizontalBarChart } from '../components/charts/BarChart'
import { MultiLineChart, getMultiLineChartDatasets } from '../components/charts/LineChart'
import { ScatterChart } from '../components/charts/ScatterChart'

import LeaguesAvailable from '../Leagues.json'
import SeasonsAvailable from '../Seasons.json'

import {
    arange,
    ceilByClosestMultiple,
    generateRandomHexCode,
    getValuesByKey,
    max,
    maxOfAbsValues,
} from '../jsUtils/general'


export default function LeagueStandings() {
    const [data, setData] = useState([]) // Will contain league standings data (array of objects)
    const [league, setLeague] = useState("")
    const [season, setSeason] = useState("")
    const updateLeague = event => setLeague(event.target.value)
    const updateSeason = event => setSeason(event.target.value)
    const updateData = () => {
        getLeagueStandings(league, season)
            .then(function(response) {
                setData(response)
            })
    }

    const getMaxLimitCeiledBy10 = (arrayOfNumbers) => {
        const maxOfNumbers = max(arrayOfNumbers)
        const maxLimit = ceilByClosestMultiple(maxOfNumbers, 10)
        return maxLimit
    }
    const getMaxAbsLimitCeiledBy10 = (arrayOfNumbers) => {
        const maxOfAbsNumbers = maxOfAbsValues(arrayOfNumbers)
        const maxAbsLimit = ceilByClosestMultiple(maxOfAbsNumbers, 10)
        return maxAbsLimit
    }
    const getTeamsArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "team")
    const getPointsArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "points")
    const getGoalDifferencesArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "goalDifference")
    const getGoalsScoredArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "goalsScored")
    const getGoalsAllowedArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "goalsAllowed")
    const getCumulativePointsArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "cumulativePoints")
    const getCumulativeGoalDifferencesArray = (arrayOfObjects) => getValuesByKey(arrayOfObjects, "cumulativeGoalDifference")

    return (
        <div>
            <h1>League Standings - Top 5 Leagues</h1>
            <br />

            <h3>Enter league and season</h3>
            <form className="league-table-form">
                <select name="league" onChange={updateLeague}>
                    <option>-</option>
                    {
                        LeaguesAvailable.map((LeagueAvailable) => (
                            <option value={LeagueAvailable}>{LeagueAvailable}</option>
                        ))
                    }
                </select>
                <select name="season" onChange={updateSeason}>
                    <option>-</option>
                    {
                        SeasonsAvailable.map((SeasonAvailable) => (
                            <option value={SeasonAvailable}>{SeasonAvailable}</option>
                        ))
                    }
                </select>
                <input
                    type="button"
                    value="Update"
                    onClick={updateData}
                />
            </form>

            {
                data.length > 0 ? 
                <>
                    <br /><br />
                    <GridTable
                        arrayOfObjects={data}
                        columnsData={ColumnsLeagueTable}
                    />
                    <GridTable
                        arrayOfObjects={data}
                        columnsData={ColumnsLeagueStats}
                    />
                    <br /><br />
                    <HorizontalBarChart
                        title={`Points chart - ${league} (${season})`}
                        xLabel={"Points"}
                        yLabel={"Team"}
                        xValues={getPointsArray(data)}
                        yValues={getTeamsArray(data)}
                        xLow={0}
                        xHigh={getMaxLimitCeiledBy10(getPointsArray(data))}
                        color="#0C7ADE"
                    />
                    <br /><br />
                    <HorizontalBarChart
                        title={`Goal difference chart - ${league} (${season})`}
                        xLabel="GoalDifference"
                        yLabel="Team"
                        xValues={getGoalDifferencesArray(data)}
                        yValues={getTeamsArray(data)}
                        xLow={-getMaxAbsLimitCeiledBy10(getGoalDifferencesArray(data))}
                        xHigh={getMaxAbsLimitCeiledBy10(getGoalDifferencesArray(data))}
                        color="#0BEA57"
                    />
                    <br /><br />
                    <MultiLineChart
                        title={`Cumulative Points chart - ${league} (${season})`}
                        xLabel="Matchday"
                        yLabel="Points (Cumulative)"
                        xTicks={arange(0, data[0]['cumulativePoints'].length - 1)}
                        datasets={
                            getMultiLineChartDatasets(
                                getTeamsArray(data),
                                getCumulativePointsArray(data),
                            )
                        }
                        datasetsSlicer={[1, 6]} // For top 6 teams
                        yLow={0}
                        yHigh={getMaxLimitCeiledBy10(getPointsArray(data))}
                    />
                    <br /><br />
                    <MultiLineChart
                        title={`Cumulative GoalDifference chart - ${league} (${season})`}
                        xLabel="Matchday"
                        yLabel="GoalDifference (Cumulative)"
                        xTicks={arange(0, data[0]['cumulativeGoalDifference'].length - 1)}
                        datasets={
                            getMultiLineChartDatasets(
                                getTeamsArray(data),
                                getCumulativeGoalDifferencesArray(data),
                            )
                        }
                        datasetsSlicer={[1, 6]} // For top 6 teams
                    />
                    <br /><br />
                    <ScatterChart
                        title={`Points vs GoalDifference - ${league} (${season})`}
                        xLabel="Points"
                        yLabel="GoalDifference"
                        arrayOfObjects={data}
                        scatterLabelsArray={getTeamsArray(data)}
                        xObj="points"
                        yObj="goalDifference"
                        xLow={0}
                        xHigh={getMaxLimitCeiledBy10(getPointsArray(data))}
                        color={generateRandomHexCode()}
                    />
                    <br /><br />
                    <ScatterChart
                        title={`GoalsScored vs GoalsAllowed - ${league} (${season})`}
                        xLabel="GoalsScored"
                        yLabel="GoalsAllowed"
                        arrayOfObjects={data}
                        scatterLabelsArray={getTeamsArray(data)}
                        xObj="goalsScored"
                        yObj="goalsAllowed"
                        xLow={0}
                        xHigh={getMaxLimitCeiledBy10(getGoalsScoredArray(data))}
                        yLow={0}
                        yHigh={getMaxLimitCeiledBy10(getGoalsAllowedArray(data))}
                        color={generateRandomHexCode()}
                    />
                </>
                : null
            }
        </div>
    )
}