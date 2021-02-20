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
const STATS_AVAILABLE_VERBOSE = Object.keys(MAPPER_STATS_AVAILABLE)


export default class GoalRelatedStatsOverTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            goalRelatedStatsOverTime: {},
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
                })
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

    // updateChartAxesLimit() {
    //     const absUpperLimitByStat = this.getMaxValueOfStat(
    //         this.state.goalRelatedStatsOverTime,
    //         LEAGUE_NAMES,
    //         MAPPER_STATS_AVAILABLE[this.state.statChoiceVerbose],
    //     )
    //     this.setState({
    //         chartAxesLimit: ceil(absUpperLimitByStat)
    //     })
    // }

    // getMaxValueOfStat(goalRelatedStats={}, leaguesSubset=[], statToCapture="") {
    //     let arrayToConsider = []
    //     for (let league of leaguesSubset) {
    //         let goalRelatedStatsByLeague = goalRelatedStats[league]
    //         let arrayToConsiderByLeague = getValuesByKey(goalRelatedStatsByLeague, statToCapture)
    //         arrayToConsider.push(...arrayToConsiderByLeague)
    //     }
    //     return max(arrayToConsider)
    // }

    // shouldComponentUpdate(nextProps, nextState) {
    //     if (nextState === this.state) {
    //         return false
    //     }
    //     return true
    // }

    render() {
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
                        />
                    </>
                    : null
                }
            </div>
        )
    }
}