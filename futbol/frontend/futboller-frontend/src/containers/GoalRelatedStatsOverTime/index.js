import React from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Menu } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import * as GoalRelatedStatsActions from '../../store/actions/GoalRelatedStatsActions'
import { MultiLineChart, getMultiLineChartDatasets } from '../../components/charts/LineChart'
import { Loader } from '../../components/loaders/Loader'
import {
    LEAGUE_COLOR_MAPPER,
    CONTAINER_STYLES,
} from '../../config'
import LEAGUE_NAMES from '../../Leagues.json'
import {
    ceil,
    getValuesByKey,
    max,
} from '../../jsUtils/general'


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
const DEFAULTS = {
    league: LEAGUE_NAMES[0],
    statNameVerbose: STATS_AVAILABLE_VERBOSE[2],
}


class GoalRelatedStatsOverTime extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            leagueChoice: DEFAULTS.league,
            statChoiceVerbose: DEFAULTS.statNameVerbose,
            chartAxesLimits: {},
        }
        this.updateLeagueChoice = this.updateLeagueChoice.bind(this)
        this.updateStatChoiceVerbose = this.updateStatChoiceVerbose.bind(this)
    }

    updateLeagueChoice(event) {
        this.setState({
            leagueChoice: event.key,
        })
    }

    updateStatChoiceVerbose(event) {
        this.setState({
            statChoiceVerbose: event.key,
        })
    }

    updateData() {
        this.props.getGoalRelatedStatsData()
    }

    componentDidMount() {
        this.updateData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { GRSData } = this.props
        if (prevProps.GRSData !== GRSData && Object.keys(GRSData).length === LEAGUE_NAMES.length) {
            this.updateChartAxesLimits()
        }
    }

    updateChartAxesLimits() {
        const { GRSData } = this.props
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
                high = ceil(this.getMaxValueOfStat(GRSData, LEAGUE_NAMES, statAccessor))
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
        const { GRSData, GRSDataApiStatus } = this.props
        const { leagueChoice, statChoiceVerbose } = this.state
        const axesLimitsAreAvailable = Object.keys(this.state.chartAxesLimits).length === STATS_AVAILABLE_VERBOSE.length
        const statChoiceIsAvailable = STATS_AVAILABLE_VERBOSE.includes(statChoiceVerbose)
        const chartAxesAndStatChoiceExists = axesLimitsAreAvailable && statChoiceIsAvailable
        const dataIsAvailable = (Object.keys(GRSData).length === LEAGUE_NAMES.length)

        const leaguesMenu = (
            <Menu>
                {
                    LEAGUE_NAMES.map((league) => (
                        <Menu.Item key={league} onClick={this.updateLeagueChoice}>
                            <p>
                                { league }
                                &nbsp;
                                { this.state.leagueChoice === league ? <SelectOutlined /> : null }
                            </p>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )
        const statsMenu = (
            <Menu>
                {
                    STATS_AVAILABLE_VERBOSE.map((statAvailableVerbose) => (
                        <Menu.Item key={statAvailableVerbose} onClick={this.updateStatChoiceVerbose}>
                            <p>
                                { statAvailableVerbose }
                                &nbsp;
                                { this.state.statChoiceVerbose === statAvailableVerbose ? <SelectOutlined /> : null }
                            </p>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )

        return (
            <div style={CONTAINER_STYLES}>
                <h1>Goal related stats (over time) - Top 5 Leagues</h1>
                <br />

                <Dropdown overlay={leaguesMenu}>
                    <Button>{this.state.leagueChoice}</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <Dropdown overlay={statsMenu}>
                    <Button>{this.state.statChoiceVerbose}</Button>
                </Dropdown>

                {
                    GRSDataApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                    dataIsAvailable ?
                    <>
                        <MultiLineChart
                            title={`${leagueChoice} - ${statChoiceVerbose} over time`}
                            xLabel="Date"
                            yLabel={statChoiceVerbose}
                            xTicks={
                                getValuesByKey(GRSData[leagueChoice], "monthGroupVerbose")
                            }
                            datasets={
                                getMultiLineChartDatasets(
                                    [`${statChoiceVerbose}`],
                                    [getValuesByKey(GRSData[leagueChoice], MAPPER_STATS_AVAILABLE[statChoiceVerbose])],
                                    [LEAGUE_COLOR_MAPPER[leagueChoice]],
                                )
                            }
                            yLow={
                                chartAxesAndStatChoiceExists ?
                                    this.state.chartAxesLimits[MAPPER_STATS_AVAILABLE[statChoiceVerbose]]['low']
                                    : undefined
                            }
                            yHigh={
                                chartAxesAndStatChoiceExists ?
                                    this.state.chartAxesLimits[MAPPER_STATS_AVAILABLE[statChoiceVerbose]]['high']
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


const mapStateToProps = (state) => {
    return {
        GRSData: state.GoalRelatedStatsReducer.GRSData,
        GRSDataApiStatus: state.GoalRelatedStatsReducer.GRSDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGoalRelatedStatsData: () => {
            dispatch(GoalRelatedStatsActions.getGoalRelatedStatsData())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GoalRelatedStatsOverTime)