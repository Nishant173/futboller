import React from 'react'

import { getGoalRelatedStatsOverTime } from '../api/getApiData'
import { MultiLineChart, getMultiLineChartDatasets } from '../components/charts/LineChart'
import { LEAGUE_COLOR_MAPPER } from '../config'
import LEAGUE_NAMES from '../Leagues.json'
import {
    ceil,
    getValuesByKey,
    max,
} from '../jsUtils/general'


// Mapping verbose stat names to accessors present in the API data
const MAPPER_STATS_AVAILABLE = {
    "Games played": "gamesPlayed",
    "Average goals scored": "avgGoalsScored",
    "Average goal difference": "avgGoalDifference",
    "One sided games (%)": "percentOneSidedGames",
    "Games with clean sheets (%)": "percentGamesWithCleanSheets",
}
const STAT_ACCESSORS_WITH_PERCENTAGES = ['percentOneSidedGames', 'percentGamesWithCleanSheets']
const STATS_AVAILABLE_VERBOSE = Object.keys(MAPPER_STATS_AVAILABLE)


export default class GoalRelatedStatsOverTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            goalRelatedStatsOverTime: {},
            chartAxesLimits: {},
            leagueChoice: "",
            statChoiceVerbose: "",
        }
        this.updateData = this.updateData.bind(this)
        this.updateLeagueChoice = this.updateLeagueChoice.bind(this)
        this.updateStatChoiceVerbose = this.updateStatChoiceVerbose.bind(this)
    }

    updateData() {
        getGoalRelatedStatsOverTime()
            .then((response) => {
                this.setState({
                    goalRelatedStatsOverTime: response,
                }, this.updateChartAxesLimits)
            })
    }

    updateChartAxesLimits() {
        let objChartAxesLimits = {} // Keys = stat accessor, and values = object having 'low' and 'high' limits
        for (let statNameVerbose of STATS_AVAILABLE_VERBOSE) {
            let statAccessor = MAPPER_STATS_AVAILABLE[statNameVerbose]
            let low = -1
            let high = -1
            if (STAT_ACCESSORS_WITH_PERCENTAGES.includes(statAccessor)) {
                low = 0
                high = 100
            }
            else {
                low = 0
                high = ceil(this.getMaxValueOfStat(this.state.goalRelatedStatsOverTime, LEAGUE_NAMES, statAccessor))
            }
            objChartAxesLimits[statAccessor] = {
                low: low,
                high: high,
            }
        }
        this.setState({
            chartAxesLimits: objChartAxesLimits
        })
    }

    updateLeagueChoice(event) {
        this.setState({
            leagueChoice: event.target.value,
        })
    }

    updateStatChoiceVerbose(event) {
        this.setState({
            statChoiceVerbose: event.target.value,
        })
    }

    getMaxValueOfStat(goalRelatedStats={}, leaguesSubset=[], statToCapture="") {
        let arrayToConsider = []
        for (let league of leaguesSubset) {
            let goalRelatedStatsByLeague = goalRelatedStats[league]
            let arrayToConsiderByLeague = getValuesByKey(goalRelatedStatsByLeague, statToCapture)
            arrayToConsider.push(...arrayToConsiderByLeague)
        }
        return max(arrayToConsider)
    }

    render() {
        const axesLimitsAreAvailable = Object.keys(this.state.chartAxesLimits).length === STATS_AVAILABLE_VERBOSE.length
        const statChoiceIsAvailable = STATS_AVAILABLE_VERBOSE.includes(this.state.statChoiceVerbose)
        const chartAxesAndStatChoiceExists = axesLimitsAreAvailable && statChoiceIsAvailable
        
        return (
            <div>
                <h1>Goal related stats over time (by leagues) - Top 5 Leagues</h1>
                <br />

                <form>
                    <select onChange={this.updateLeagueChoice}>
                        <option>-</option>
                        {
                            LEAGUE_NAMES.map((league) => (
                                <option value={league}>{league}</option>
                            ))
                        }
                    </select>
                    <select onChange={this.updateStatChoiceVerbose}>
                        <option>-</option>
                        {
                            STATS_AVAILABLE_VERBOSE.map((StatAvailableVerbose) => (
                                <option value={StatAvailableVerbose}>{StatAvailableVerbose}</option>
                            ))
                        }
                    </select>
                    <input
                        type="button"
                        value="Re-load"
                        onClick={this.updateData}
                    />
                </form>

                {
                    Object.keys(this.state.goalRelatedStatsOverTime).length === LEAGUE_NAMES.length
                    ?
                    <>
                        <MultiLineChart
                            title={`${this.state.leagueChoice} - ${this.state.statChoiceVerbose} over time`}
                            xLabel="Date"
                            yLabel={this.state.statChoiceVerbose}
                            xTicks={
                                getValuesByKey(this.state.goalRelatedStatsOverTime[this.state.leagueChoice], "monthGroupVerbose")
                            }
                            datasets={
                                getMultiLineChartDatasets(
                                    [`${this.state.statChoiceVerbose}`],
                                    [getValuesByKey(this.state.goalRelatedStatsOverTime[this.state.leagueChoice], MAPPER_STATS_AVAILABLE[this.state.statChoiceVerbose])],
                                    [LEAGUE_COLOR_MAPPER[this.state.leagueChoice]],
                                )
                            }
                            yLow={
                                chartAxesAndStatChoiceExists ?
                                    this.state.chartAxesLimits[MAPPER_STATS_AVAILABLE[this.state.statChoiceVerbose]]['low']
                                    : undefined
                            }
                            yHigh={
                                chartAxesAndStatChoiceExists ?
                                    this.state.chartAxesLimits[MAPPER_STATS_AVAILABLE[this.state.statChoiceVerbose]]['high']
                                    : undefined
                            }
                        />
                    </>
                    : null
                }
            </div>
        )
    }
}