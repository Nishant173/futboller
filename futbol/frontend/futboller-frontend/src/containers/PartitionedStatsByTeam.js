import React from 'react'

import { getPartitionedStatsByTeam } from '../api/getApiData'

import { GridTable } from '../components/tables/Table'
import { ColumnsPartitionedStatsByTeam } from '../components/tables/TableColumns'
import { MultiLineChart, getMultiLineChartDatasets } from '../components/charts/LineChart'

import TeamsAvailable from '../Teams.json'

import { getValuesByKey } from '../jsUtils/general'


export default class PartitionedStatsByTeam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            startDates: [],
            avgPoints: [],
            avgGoalDifferences: [],
            avgGoalsScored: [],
            avgGoalsAllowed: [],
            winPercentages: [],
            lossPercentages: [],
            drawPercentages: [],
            team: "",
        }
        this.updateData = this.updateData.bind(this)
        this.updateTeam = this.updateTeam.bind(this)
    }

    updateData() {
        getPartitionedStatsByTeam({ team: this.state.team })
            .then((response) => {
                this.setState({
                    data: response,
                })
                this.setState({
                    startDates: getValuesByKey(this.state.data, "startDate"),
                    avgPoints: getValuesByKey(this.state.data, "avgPoints"),
                    avgGoalDifferences: getValuesByKey(this.state.data, "avgGoalDifference"),
                    avgGoalsScored: getValuesByKey(this.state.data, "avgGoalsScored"),
                    avgGoalsAllowed: getValuesByKey(this.state.data, "avgGoalsAllowed"),
                    winPercentages: getValuesByKey(this.state.data, "winPercent"),
                    lossPercentages: getValuesByKey(this.state.data, "lossPercent"),
                    drawPercentages: getValuesByKey(this.state.data, "drawPercent"),
                })
            })
    }

    updateTeam(event) {
        this.setState({
            team: event.target.value,
        })
    }

    render() {
        return (
            <div>
                <h1>Partitioned Stats By Team - Top 5 Leagues</h1>
                <br />

                <form>
                    <select onChange={this.updateTeam}>
                        <option>-</option>
                        {
                            TeamsAvailable.map((TeamAvailable) => (
                                <option value={TeamAvailable}>{TeamAvailable}</option>
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
                            columnsData={ColumnsPartitionedStatsByTeam}
                        />
                        <br /><br />
                        <MultiLineChart
                            title={`${this.state.team} - AvgPoints over time`}
                            xLabel="Date"
                            yLabel="AvgPoints"
                            xTicks={this.state.startDates}
                            datasets={
                                getMultiLineChartDatasets(
                                    ["AvgPoints over time"],
                                    [this.state.avgPoints],
                                )
                            }
                            yLow={0}
                            yHigh={3}
                        />
                        <br /><br />
                        <MultiLineChart
                            title={`${this.state.team} - Wins/Losses/Draws over time`}
                            xLabel="Date"
                            yLabel="Win/Loss/Draw percentages over time"
                            xTicks={this.state.startDates}
                            datasets={
                                getMultiLineChartDatasets(
                                    [
                                        "WinPercent over time",
                                        "LossPercent over time",
                                        "DrawPercent over time",
                                    ],
                                    [
                                        this.state.winPercentages,
                                        this.state.lossPercentages,
                                        this.state.drawPercentages,
                                    ],
                                    [
                                        "green",
                                        "red",
                                        "grey",
                                    ],
                                )
                            }
                            yLow={0}
                            yHigh={100}
                        />
                    </>
                    : null
                }
            </div>
        )
    }
}