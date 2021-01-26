import React, { useState } from 'react'

import { getLeagueStandings } from '../api/getApiData'

import { GridTable } from '../components/tables/Table'
import { ColumnsLeagueTable, ColumnsLeagueStats } from '../components/tables/TableColumns'

import { HorizontalBarChart } from '../components/charts/BarChart'
import { MultiLineChart, getMultiLineChartDatasets } from '../components/charts/LineChart'
import { ScatterChart } from '../components/charts/ScatterChart'

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

    const getMaxLimit = (arrayOfNumbers) => {
        const maxOfNumbers = max(arrayOfNumbers)
        const maxLimit = ceilByClosestMultiple(maxOfNumbers, 10)
        return maxLimit
    }
    const getMaxAbsLimit = (arrayOfNumbers) => {
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
                    <option value="EPL">EPL</option>
                    <option value="Bundesliga">Bundesliga</option>
                    <option value="La Liga">La Liga</option>
                    <option value="Ligue 1">Ligue 1</option>
                    <option value="Serie A">Serie A</option>
                </select>
                <select name="season" onChange={updateSeason}>
                    <option>-</option>
                    <option value="2009-10">2009-10</option>
                    <option value="2010-11">2010-11</option>
                    <option value="2011-12">2011-12</option>
                    <option value="2012-13">2012-13</option>
                    <option value="2013-14">2013-14</option>
                    <option value="2014-15">2014-15</option>
                    <option value="2015-16">2015-16</option>
                    <option value="2016-17">2016-17</option>
                    <option value="2017-18">2017-18</option>
                    <option value="2018-19">2018-19</option>
                    <option value="2019-20">2019-20</option>
                    <option value="2020-21">2020-21</option>
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
                        xHigh={getMaxLimit(getPointsArray(data))}
                        color={'#0C7ADE'}
                    />
                    <br /><br />
                    <HorizontalBarChart
                        title={`Goal difference chart - ${league} (${season})`}
                        xLabel="GoalDifference"
                        yLabel="Team"
                        xValues={getGoalDifferencesArray(data)}
                        yValues={getTeamsArray(data)}
                        xLow={-getMaxAbsLimit(getGoalDifferencesArray(data))}
                        xHigh={getMaxAbsLimit(getGoalDifferencesArray(data))}
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
                        yHigh={getMaxLimit(getPointsArray(data))}
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
                        xHigh={getMaxLimit(getPointsArray(data))}
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
                        xHigh={getMaxLimit(getGoalsScoredArray(data))}
                        yLow={0}
                        yHigh={getMaxLimit(getGoalsAllowedArray(data))}
                        color={generateRandomHexCode()}
                    />
                </>
                : null
            }
        </div>
    )
}