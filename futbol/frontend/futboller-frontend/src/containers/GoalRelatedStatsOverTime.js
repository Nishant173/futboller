import React from 'react'
import { getGoalRelatedStatsOverTime } from '../api/getApiData'
import { MultiLineChart, getMultiLineChartDatasets } from '../components/charts/LineChart'
import LeaguesAvailable from '../Leagues.json'
import {
    ceil,
    getValuesByKey,
    max,
} from '../jsUtils/general'


export default class GoalRelatedStatsOverTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            goalRelatedStatsOverTime: {},
            avgGoalsScoredLimit: 0,
            avgGoalDifferenceLimit: 0,
        }
        this.updateData = this.updateData.bind(this)
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
        const maxAvgGoalsScored = this.getMaxValueOfStat(this.state.goalRelatedStatsOverTime, LeaguesAvailable, "avgGoalsScored")
        const maxAvgGoalDifference = this.getMaxValueOfStat(this.state.goalRelatedStatsOverTime, LeaguesAvailable, "avgGoalDifference")
        this.setState({
            avgGoalsScoredLimit: ceil(maxAvgGoalsScored),
            avgGoalDifferenceLimit: ceil(maxAvgGoalDifference),
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
        return (
            <div>
                <h1>Goal related stats over time (by leagues) - Top 5 Leagues</h1>
                <br />

                <form>
                    <input
                        type="button"
                        value="Re-load"
                        onClick={this.updateData}
                    />
                </form>

                {
                    Object.keys(this.state.goalRelatedStatsOverTime).length === LeaguesAvailable.length
                    ?
                    <>
                        {
                            LeaguesAvailable.map((league) => (
                                <>
                                    <br /><br />
                                    <MultiLineChart
                                        title={`${league} - AvgGoalsPerMatch over time`}
                                        xLabel="Date"
                                        yLabel="AvgGoalsPerMatch"
                                        xTicks={getValuesByKey(this.state.goalRelatedStatsOverTime[league], "monthGroupVerbose")}
                                        datasets={
                                            getMultiLineChartDatasets(
                                                [`${league} - AvgGoalsPerMatch over time`],
                                                [getValuesByKey(this.state.goalRelatedStatsOverTime[league], "avgGoalsScored")],
                                            )
                                        }
                                        yLow={0}
                                        yHigh={this.state.avgGoalsScoredLimit}
                                    />
                                </>
                            ))
                        }
                        <hr />
                        {
                            LeaguesAvailable.map((league) => (
                                <>
                                    <br /><br />
                                    <MultiLineChart
                                        title={`${league} - AvgGoalDifferencePerMatch over time`}
                                        xLabel="Date"
                                        yLabel="AvgGoalDifferencePerMatch"
                                        xTicks={getValuesByKey(this.state.goalRelatedStatsOverTime[league], "monthGroupVerbose")}
                                        datasets={
                                            getMultiLineChartDatasets(
                                                [`${league} - AvgGoalDifferencePerMatch over time`],
                                                [getValuesByKey(this.state.goalRelatedStatsOverTime[league], "avgGoalDifference")],
                                            )
                                        }
                                        yLow={0}
                                        yHigh={this.state.avgGoalDifferenceLimit}
                                    />
                                </>
                            ))
                        }
                    </>
                    : null
                }
            </div>
        )
    }
}