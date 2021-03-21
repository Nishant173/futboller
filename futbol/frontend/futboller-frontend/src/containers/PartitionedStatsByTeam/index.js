import React from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Menu } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import * as PartitionedStatsActions from '../../store/actions/PartitionedStatsActions'
import { MultiLineChart, getMultiLineChartDatasets } from '../../components/charts/LineChart'
import { Loader } from '../../components/loaders/Loader'
import { DataTableComponent } from '../../components/tables/Table'
import { ExportToExcel } from '../../components/tableExporters'
import { getValuesByKey } from '../../jsUtils/general'
import { COLUMNS_PARTITIONED_STATS_BY_TEAM } from './tableColumns'

import LEAGUE_NAMES from '../../Leagues.json'
import TEAM_NAMES_BY_LEAGUE from '../../TeamsByLeague.json'


const { SubMenu } = Menu

const DEFAULTS = {
    team: 'Bayern Munich',
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
            team: event.key,
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
        
        let titlePartitionedStats = ""
        if (dataIsAvailable) {
            titlePartitionedStats = `Partitioned stats over time - ${PartitionedStats[0].team}`
        }
        
        const teamsMenu = (
            <Menu>
                {
                    LEAGUE_NAMES.map((league) => (
                        <SubMenu title={league}>
                            {
                                TEAM_NAMES_BY_LEAGUE[league].map((team) => (
                                    <Menu.Item key={team} onClick={this.updateTeam}>
                                        <p>
                                            { team }
                                            &nbsp;
                                            { this.state.team === team ? <SelectOutlined /> : null }
                                        </p>
                                    </Menu.Item>
                                ))
                            }
                        </SubMenu>
                    ))
                }
            </Menu>
        )
        
        return (
            <div>
                <h1>Partitioned Stats By Team - Top 5 Leagues</h1>
                <br />

                <Dropdown overlay={teamsMenu}>
                    <Button>{this.state.team}</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.updateData} disabled={false}>
                    Fetch data
                </Button>

                {
                    PartitionedStatsApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                    dataIsAvailable ?
                    <>
                        <br /><br />
                        <ExportToExcel
                            filenameWithoutExtension={titlePartitionedStats}
                            sheetName={titlePartitionedStats}
                            data={PartitionedStats}
                            columnInfo={COLUMNS_PARTITIONED_STATS_BY_TEAM}
                            columnLabelAccessor="name"
                            columnValueAccessor="selector"
                        />
                        <DataTableComponent 
                            title={titlePartitionedStats}
                            arrayOfObjects={PartitionedStats}
                            columns={COLUMNS_PARTITIONED_STATS_BY_TEAM}
                            defaultSortField="partitionNumber"
                            pagination={true}
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