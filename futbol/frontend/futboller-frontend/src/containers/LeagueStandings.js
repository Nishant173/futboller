import React from 'react'

import { getLeagueStandings } from '../api/getApiData'
import { HorizontalBarChart } from '../components/charts/BarChart'
import { MultiLineChart, getMultiLineChartDatasets } from '../components/charts/LineChart'
import { ScatterChart } from '../components/charts/ScatterChart'
import { GridTable } from '../components/tables/Table'
import { COLUMNS_LEAGUE_TABLE, COLUMNS_LEAGUE_STATS } from '../components/tables/TableColumns'
import LEAGUE_NAMES from '../Leagues.json'
import SEASON_NAMES from '../Seasons.json'
import {
    arange,
    ceilByClosestMultiple,
    generateRandomHexCode,
    getValuesByKey,
    max,
    maxOfAbsValues,
} from '../jsUtils/general'


const DEFAULTS = {
    league: "EPL",
    season: "2015-16",
}


function getMaxLimitCeiledBy10(arrayOfNumbers) {
    const maxOfNumbers = max(arrayOfNumbers)
    const maxLimit = ceilByClosestMultiple(maxOfNumbers, 10)
    return maxLimit
}


function getMaxAbsLimitCeiledBy10(arrayOfNumbers) {
    const maxOfAbsNumbers = maxOfAbsValues(arrayOfNumbers)
    const maxAbsLimit = ceilByClosestMultiple(maxOfAbsNumbers, 10)
    return maxAbsLimit
}


export default class LeagueStandings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            league: DEFAULTS.league,
            season: DEFAULTS.season,
            teams: [],
            points: [],
            goalDifferences: [],
            goalsScored: [],
            goalsAllowed: [],
            cumulativePoints: [],
            cumulativeGoalDifferences: [],
        }
        this.updateData = this.updateData.bind(this)
        this.updateLeague = this.updateLeague.bind(this)
        this.updateSeason = this.updateSeason.bind(this)
        this.updateWrangledData = this.updateWrangledData.bind(this)
    }

    componentDidMount() {
        this.updateData()
    }

    updateData() {
        getLeagueStandings({
            league: this.state.league,
            season: this.state.season,
        })
            .then((response) => {
                this.setState({
                    data: response,
                }, this.updateWrangledData)
            })
    }

    updateLeague(event) {
        this.setState({
            league: event.target.value,
        })
    }

    updateSeason(event) {
        this.setState({
            season: event.target.value,
        })
    }

    updateWrangledData() {
        this.setState({
            teams: getValuesByKey(this.state.data, "team"),
            points: getValuesByKey(this.state.data, "points"),
            goalDifferences: getValuesByKey(this.state.data, "goalDifference"),
            goalsScored: getValuesByKey(this.state.data, "goalsScored"),
            goalsAllowed: getValuesByKey(this.state.data, "goalsAllowed"),
            cumulativePoints: getValuesByKey(this.state.data, "cumulativePoints"),
            cumulativeGoalDifferences: getValuesByKey(this.state.data, "cumulativeGoalDifference"),
        })
    }

    render() {
        return (
            <div>
                <h1>League Standings - Top 5 Leagues</h1>
                <br />

                <h3>Enter league and season</h3>
                <form className="league-table-form">
                    <select name="league" onChange={this.updateLeague}>
                        {
                            LEAGUE_NAMES.map((league) => (
                                <option
                                    selected={league === DEFAULTS.league ? true : false}
                                    value={league}
                                >
                                    {league}
                                </option>
                            ))
                        }
                    </select>
                    <select name="season" onChange={this.updateSeason}>
                        {
                            SEASON_NAMES.map((season) => (
                                <option
                                    selected={season === DEFAULTS.season ? true : false}
                                    value={season}
                                >
                                    {season}
                                </option>
                            ))
                        }
                    </select>
                    <input
                        type="button"
                        value="Update"
                        onClick={this.updateData}
                    />
                </form>

                {
                    this.state.data.length > 0 ? 
                    <>
                        <br /><br />
                        <GridTable
                            arrayOfObjects={this.state.data}
                            columnsData={COLUMNS_LEAGUE_TABLE}
                        />
                        <GridTable
                            arrayOfObjects={this.state.data}
                            columnsData={COLUMNS_LEAGUE_STATS}
                        />
                        <br /><br />
                        <HorizontalBarChart
                            title={`Points chart - ${this.state.data[0].league} (${this.state.data[0].season})`}
                            xLabel={"Points"}
                            yLabel={"Team"}
                            xValues={this.state.points}
                            yValues={this.state.teams}
                            xLow={0}
                            xHigh={getMaxLimitCeiledBy10(this.state.points)}
                            color="#0C7ADE"
                        />
                        <br /><br />
                        <HorizontalBarChart
                            title={`Goal difference chart - ${this.state.data[0].league} (${this.state.data[0].season})`}
                            xLabel="GoalDifference"
                            yLabel="Team"
                            xValues={this.state.goalDifferences}
                            yValues={this.state.teams}
                            xLow={-getMaxAbsLimitCeiledBy10(this.state.goalDifferences)}
                            xHigh={getMaxAbsLimitCeiledBy10(this.state.goalDifferences)}
                            color="#0BEA57"
                        />
                        <br /><br />
                        <MultiLineChart
                            title={`Cumulative Points chart - ${this.state.data[0].league} (${this.state.data[0].season})`}
                            xLabel="Matchday"
                            yLabel="Points (Cumulative)"
                            xTicks={arange(0, this.state.data[0]['cumulativePoints'].length - 1)}
                            datasets={
                                getMultiLineChartDatasets(
                                    this.state.teams,
                                    this.state.cumulativePoints,
                                )
                            }
                            datasetsSlicer={[1, 6]} // For top 6 teams
                            yLow={0}
                            yHigh={getMaxLimitCeiledBy10(this.state.points)}
                        />
                        <br /><br />
                        <MultiLineChart
                            title={`Cumulative GoalDifference chart - ${this.state.data[0].league} (${this.state.data[0].season})`}
                            xLabel="Matchday"
                            yLabel="GoalDifference (Cumulative)"
                            xTicks={arange(0, this.state.data[0]['cumulativeGoalDifference'].length - 1)}
                            datasets={
                                getMultiLineChartDatasets(
                                    this.state.teams,
                                    this.state.cumulativeGoalDifferences,
                                )
                            }
                            datasetsSlicer={[1, 6]} // For top 6 teams
                        />
                        <br /><br />
                        <ScatterChart
                            title={`Points vs GoalDifference - ${this.state.data[0].league} (${this.state.data[0].season})`}
                            xLabel="Points"
                            yLabel="GoalDifference"
                            arrayOfObjects={this.state.data}
                            scatterLabelsArray={this.state.teams}
                            xObj="points"
                            yObj="goalDifference"
                            xLow={0}
                            xHigh={getMaxLimitCeiledBy10(this.state.points)}
                            yLow={-getMaxAbsLimitCeiledBy10(this.state.goalDifferences)}
                            yHigh={getMaxAbsLimitCeiledBy10(this.state.goalDifferences)}
                            color={generateRandomHexCode()}
                        />
                        <br /><br />
                        <ScatterChart
                            title={`GoalsScored vs GoalsAllowed - ${this.state.data[0].league} (${this.state.data[0].season})`}
                            xLabel="GoalsScored"
                            yLabel="GoalsAllowed"
                            arrayOfObjects={this.state.data}
                            scatterLabelsArray={this.state.teams}
                            xObj="goalsScored"
                            yObj="goalsAllowed"
                            xLow={0}
                            xHigh={getMaxLimitCeiledBy10(this.state.goalsScored)}
                            yLow={0}
                            yHigh={getMaxLimitCeiledBy10(this.state.goalsAllowed)}
                            color={generateRandomHexCode()}
                        />
                    </>
                    : null
                }
            </div>
        )
    }
}