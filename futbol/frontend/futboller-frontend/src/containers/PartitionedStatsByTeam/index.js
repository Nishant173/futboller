import React from 'react'
import { connect } from 'react-redux'

import * as PartitionedStatsActions from '../../store/actions/PartitionedStatsActions'
import { MultiLineChart, getMultiLineChartDatasets } from '../../components/charts/LineChart'
import { Loader } from '../../components/loaders/Loader'
import { GridTable } from '../../components/tables/Table'
import TEAM_NAMES from '../../Teams.json'
import { getValuesByKey } from '../../jsUtils/general'
import { COLUMNS_PARTITIONED_STATS_BY_TEAM } from './tableColumns'


const DEFAULTS = {
    team: TEAM_NAMES[0],
}


class PartitionedStatsByTeam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            team: DEFAULTS.team,
            wrangledDataObj: {},
        }
        this.updateTeam = this.updateTeam.bind(this)
        this.updateData = this.updateData.bind(this)
        this.updateWrangledData = this.updateWrangledData.bind(this)
    }

    updateTeam(event) {
        this.setState({
            team: event.target.value,
        })
    }

    updateData() {
        this.props.getPartitionedStatsData(this.state.team)
    }

    updateWrangledData() {
        const { PartitionedStats } = this.props
        this.setState({
            wrangledDataObj: {
                startDates: getValuesByKey(PartitionedStats, "startDate"),
                endDates: getValuesByKey(PartitionedStats, "endDate"),
                avgPoints: getValuesByKey(PartitionedStats, "avgPoints"),
                avgGoalDifferences: getValuesByKey(PartitionedStats, "avgGoalDifference"),
                avgGoalsScored: getValuesByKey(PartitionedStats, "avgGoalsScored"),
                avgGoalsAllowed: getValuesByKey(PartitionedStats, "avgGoalsAllowed"),
                winPercentages: getValuesByKey(PartitionedStats, "winPercent"),
                lossPercentages: getValuesByKey(PartitionedStats, "lossPercent"),
                drawPercentages: getValuesByKey(PartitionedStats, "drawPercent"),
            }
        })
    }

    componentDidMount() {
        this.updateData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { PartitionedStats } = this.props
        if (prevProps.PartitionedStats !== PartitionedStats && PartitionedStats.length > 0) {
            this.updateWrangledData()
        }
    }

    render() {
        const { PartitionedStats, PartitionedStatsApiStatus } = this.props
        const { wrangledDataObj } = this.state
        const dataIsAvailable = (PartitionedStats.length > 0)
        
        return (
            <div>
                <h1>Partitioned Stats By Team - Top 5 Leagues</h1>
                <br />

                <form>
                    <select onChange={this.updateTeam}>
                        {
                            TEAM_NAMES.map((team) => (
                                <option
                                    selected={team === DEFAULTS.team ? true : false}
                                    value={team}
                                >
                                    {team}
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
                    PartitionedStatsApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                    dataIsAvailable ?
                    <>
                        <br /><br />
                        <GridTable
                            arrayOfObjects={PartitionedStats}
                            columnsData={COLUMNS_PARTITIONED_STATS_BY_TEAM}
                        />
                        <br /><br />
                        <MultiLineChart
                            title={`${PartitionedStats[0].team} - AvgPoints over time`}
                            xLabel="Date"
                            yLabel="AvgPoints"
                            xTicks={wrangledDataObj['endDates']}
                            datasets={
                                getMultiLineChartDatasets(
                                    ["AvgPoints over time"],
                                    [wrangledDataObj['avgPoints']],
                                )
                            }
                            yLow={0}
                            yHigh={3}
                        />
                        <br /><br />
                        <MultiLineChart
                            title={`${PartitionedStats[0].team} - Wins/Losses/Draws over time`}
                            xLabel="Date"
                            yLabel="Win/Loss/Draw percentages over time"
                            xTicks={wrangledDataObj['endDates']}
                            datasets={
                                getMultiLineChartDatasets(
                                    [
                                        "WinPercent over time",
                                        "LossPercent over time",
                                        "DrawPercent over time",
                                    ],
                                    [
                                        wrangledDataObj['winPercentages'],
                                        wrangledDataObj['lossPercentages'],
                                        wrangledDataObj['drawPercentages'],
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


const mapStateToProps = (state) => {
    return {
        PartitionedStats: state.PartitionedStatsReducer.PartitionedStats,
        PartitionedStatsApiStatus: state.PartitionedStatsReducer.PartitionedStatsApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getPartitionedStatsData: (team) => {
            dispatch(PartitionedStatsActions.getPartitionedStatsData(team))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PartitionedStatsByTeam)