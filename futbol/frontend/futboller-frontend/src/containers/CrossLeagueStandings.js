import React from 'react'

import { getCrossLeagueStandings } from '../api/getApiData'
import { ScatterChart } from '../components/charts/ScatterChart'
import { GridTable } from '../components/tables/Table'
import {
    COLUMNS_CROSS_LEAGUE_TABLE,
    COLUMNS_CROSS_LEAGUE_STATS,
} from '../components/tables/TableColumns'
import {
    ceil,
    generateRandomHexCode,
    getValuesByKey,
    max,
    maxOfAbsValues,
} from '../jsUtils/general'


export default class CrossLeagueStandings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            teams: [],
            avgPoints: [],
            avgGoalDifference: [],
            avgGoalsScored: [],
            avgGoalsAllowed: [],
        }
        this.updateData = this.updateData.bind(this)
        this.updateWrangledData = this.updateWrangledData.bind(this)
        this.sliceByPosition = this.sliceByPosition.bind(this)
        this.sliceTop80 = this.sliceTop80.bind(this)
    }

    updateData() {
        getCrossLeagueStandings()
            .then((response) => {
                this.setState({
                    data: response,
                })
                this.updateWrangledData()
            })
    }

    updateWrangledData() {
        this.setState({
            teams: getValuesByKey(this.state.data, "team"),
            avgPoints: getValuesByKey(this.state.data, "avgPoints"),
            avgGoalDifference: getValuesByKey(this.state.data, "avgGoalDifference"),
            avgGoalsScored: getValuesByKey(this.state.data, "avgGoalsScored"),
            avgGoalsAllowed: getValuesByKey(this.state.data, "avgGoalsAllowed"),
        })
    }

    sliceByPosition(array, start, stop) {
        return array.slice(start-1, stop)
    }

    sliceTop80(array) {
        return this.sliceByPosition(array, 1, 80)
    }

    render() {
        return (
            <div>
                <h1>Cross League Standings - Top 5 Leagues</h1>
                <br />

                <form className="cross-league-table-form">
                    <input
                        type="button"
                        value="Re-load"
                        onClick={this.updateData}
                    />
                </form>

                {
                    this.state.data.length > 0 ? 
                    <>
                        <br /><br />
                        <GridTable
                            arrayOfObjects={this.state.data}
                            columnsData={COLUMNS_CROSS_LEAGUE_TABLE}
                        />
                        <br /><br />
                        <GridTable
                            arrayOfObjects={this.state.data}
                            columnsData={COLUMNS_CROSS_LEAGUE_STATS}
                        />
                        <br /><br />
                        <ScatterChart
                            title="AvgPoints vs AvgGoalDifference"
                            xLabel="AvgPoints"
                            yLabel="AvgGoalDifference"
                            arrayOfObjects={this.sliceTop80(this.state.data)}
                            scatterLabelsArray={this.sliceTop80(this.state.teams)}
                            xObj="avgPoints"
                            yObj="avgGoalDifference"
                            xLow={0}
                            xHigh={ceil(max(this.sliceTop80(this.state.avgPoints)))}
                            yLow={-maxOfAbsValues(this.sliceTop80(this.state.avgGoalDifference))}
                            yHigh={maxOfAbsValues(this.sliceTop80(this.state.avgGoalDifference))}
                            color={generateRandomHexCode()}
                        />
                        <br /><br />
                        <ScatterChart
                            title="AvgGoalsScored vs AvgGoalsAllowed"
                            xLabel="AvgGoalsScored"
                            yLabel="AvgGoalsAllowed"
                            arrayOfObjects={this.sliceTop80(this.state.data)}
                            scatterLabelsArray={this.sliceTop80(this.state.teams)}
                            xObj="avgGoalsScored"
                            yObj="avgGoalsAllowed"
                            xLow={0}
                            xHigh={ceil(max(this.sliceTop80(this.state.avgGoalsScored)))}
                            yLow={0}
                            yHigh={ceil(max(this.sliceTop80(this.state.avgGoalsAllowed)))}
                            color={generateRandomHexCode()}
                        />
                    </>
                    : null
                }
            </div>
        )
    }
}