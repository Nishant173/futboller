import React from 'react'
import { connect } from 'react-redux'

import * as LeagueStandingsActions from '../../store/actions/LeagueStandingsActions'
import { HorizontalBarChart } from '../../components/charts/BarChart'
import { MultiLineChart, getMultiLineChartDatasets } from '../../components/charts/LineChart'
import { ScatterChart } from '../../components/charts/ScatterChart'
import { GridTable } from '../../components/tables/Table'
import { COLUMNS_LEAGUE_TABLE, COLUMNS_LEAGUE_STATS } from '../../components/tables/TableColumns'
import LEAGUE_NAMES from '../../Leagues.json'
import SEASON_NAMES from '../../Seasons.json'
import {
    arange,
    ceilByClosestMultiple,
    generateRandomHexCode,
    getValuesByKey,
    max,
    maxOfAbsValues,
} from '../../jsUtils/general'


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


class LeagueStandings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            league: DEFAULTS.league,
            season: DEFAULTS.season,
            wrangledDataObj: {},
        }
        this.updateLeague = this.updateLeague.bind(this)
        this.updateSeason = this.updateSeason.bind(this)
        this.updateData = this.updateData.bind(this)
        this.updateWrangledData = this.updateWrangledData.bind(this)
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

    updateData() {
        const { league, season } = this.state
        this.props.getLeagueStandingsData(league, season)
    }

    updateWrangledData() {
        const { LeagueStandingsData } = this.props
        this.setState({
            wrangledDataObj: {
                teams: getValuesByKey(LeagueStandingsData, "team"),
                points: getValuesByKey(LeagueStandingsData, "points"),
                goalDifferences: getValuesByKey(LeagueStandingsData, "goalDifference"),
                goalsScored: getValuesByKey(LeagueStandingsData, "goalsScored"),
                goalsAllowed: getValuesByKey(LeagueStandingsData, "goalsAllowed"),
                cumulativePoints: getValuesByKey(LeagueStandingsData, "cumulativePoints"),
                cumulativeGoalDifferences: getValuesByKey(LeagueStandingsData, "cumulativeGoalDifference"),
            },
        })
    }

    componentDidMount() {
        this.updateData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { LeagueStandingsData } = this.props
        if (prevProps.LeagueStandingsData !== LeagueStandingsData && LeagueStandingsData.length > 0) {
            this.updateWrangledData()
        }
    }

    render() {
        const { wrangledDataObj } = this.state
        const { LeagueStandingsData, LeagueStandingsDataApiStatus } = this.props
        const dataIsAvailable = (LeagueStandingsData.length > 0 && Object.keys(wrangledDataObj).length > 0)
        
        return (
            <div>
                <h1>League Standings - Top 5 Leagues</h1>
                <br />

                <h3>Enter league and season</h3>
                <form>
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
                    dataIsAvailable ?
                    <>
                        <br /><br />
                        <GridTable
                            arrayOfObjects={LeagueStandingsData}
                            columnsData={COLUMNS_LEAGUE_TABLE}
                        />
                        <GridTable
                            arrayOfObjects={LeagueStandingsData}
                            columnsData={COLUMNS_LEAGUE_STATS}
                        />
                        <br /><br />
                        <HorizontalBarChart
                            title={`Points chart - ${LeagueStandingsData[0].league} (${LeagueStandingsData[0].season})`}
                            xLabel={"Points"}
                            yLabel={"Team"}
                            xValues={wrangledDataObj['points']}
                            yValues={wrangledDataObj['teams']}
                            xLow={0}
                            xHigh={getMaxLimitCeiledBy10(wrangledDataObj['points'])}
                            color="#0C7ADE"
                        />
                        <br /><br />
                        <HorizontalBarChart
                            title={`Goal difference chart - ${LeagueStandingsData[0].league} (${LeagueStandingsData[0].season})`}
                            xLabel="GoalDifference"
                            yLabel="Team"
                            xValues={wrangledDataObj['goalDifferences']}
                            yValues={wrangledDataObj['teams']}
                            xLow={-getMaxAbsLimitCeiledBy10(wrangledDataObj['goalDifferences'])}
                            xHigh={getMaxAbsLimitCeiledBy10(wrangledDataObj['goalDifferences'])}
                            color="#0BEA57"
                        />
                        <br /><br />
                        <MultiLineChart
                            title={`Cumulative Points chart - ${LeagueStandingsData[0].league} (${LeagueStandingsData[0].season})`}
                            xLabel="Matchday"
                            yLabel="Points (Cumulative)"
                            xTicks={arange(0, LeagueStandingsData[0]['cumulativePoints'].length - 1)}
                            datasets={
                                getMultiLineChartDatasets(
                                    wrangledDataObj['teams'],
                                    wrangledDataObj['cumulativePoints'],
                                )
                            }
                            datasetsSlicer={[1, 6]} // For top 6 teams
                            yLow={0}
                            yHigh={getMaxLimitCeiledBy10(wrangledDataObj['points'])}
                        />
                        <br /><br />
                        <MultiLineChart
                            title={`Cumulative GoalDifference chart - ${LeagueStandingsData[0].league} (${LeagueStandingsData[0].season})`}
                            xLabel="Matchday"
                            yLabel="GoalDifference (Cumulative)"
                            xTicks={arange(0, LeagueStandingsData[0]['cumulativeGoalDifference'].length - 1)}
                            datasets={
                                getMultiLineChartDatasets(
                                    wrangledDataObj['teams'],
                                    wrangledDataObj['cumulativeGoalDifferences'],
                                )
                            }
                            datasetsSlicer={[1, 6]} // For top 6 teams
                        />
                        <br /><br />
                        <ScatterChart
                            title={`Points vs GoalDifference - ${LeagueStandingsData[0].league} (${LeagueStandingsData[0].season})`}
                            xLabel="Points"
                            yLabel="GoalDifference"
                            arrayOfObjects={LeagueStandingsData}
                            scatterLabelsArray={wrangledDataObj['teams']}
                            xObj="points"
                            yObj="goalDifference"
                            xLow={0}
                            xHigh={getMaxLimitCeiledBy10(wrangledDataObj['points'])}
                            yLow={-getMaxAbsLimitCeiledBy10(wrangledDataObj['goalDifferences'])}
                            yHigh={getMaxAbsLimitCeiledBy10(wrangledDataObj['goalDifferences'])}
                            color={generateRandomHexCode()}
                        />
                        <br /><br />
                        <ScatterChart
                            title={`GoalsScored vs GoalsAllowed - ${LeagueStandingsData[0].league} (${LeagueStandingsData[0].season})`}
                            xLabel="GoalsScored"
                            yLabel="GoalsAllowed"
                            arrayOfObjects={LeagueStandingsData}
                            scatterLabelsArray={wrangledDataObj['teams']}
                            xObj="goalsScored"
                            yObj="goalsAllowed"
                            xLow={0}
                            xHigh={getMaxLimitCeiledBy10(wrangledDataObj['goalsScored'])}
                            yLow={0}
                            yHigh={getMaxLimitCeiledBy10(wrangledDataObj['goalsAllowed'])}
                            color={generateRandomHexCode()}
                        />
                    </>
                    : null
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        LeagueStandingsData: state.LeagueStandingsReducer.LeagueStandingsData,
        LeagueStandingsDataApiStatus: state.LeagueStandingsReducer.LeagueStandingsDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLeagueStandingsData: (league, season) => {
            dispatch(LeagueStandingsActions.getLeagueStandingsData(league, season))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueStandings)