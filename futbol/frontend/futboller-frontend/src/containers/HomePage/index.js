import React from 'react'
import { connect } from 'react-redux'
import { Card, Statistic, Row, Col, Button, Dropdown, Menu } from 'antd'
import { FlagOutlined, SelectOutlined } from '@ant-design/icons'

import * as GeneralStatsActions from '../../store/actions/GeneralStatsActions'
import { MultiLineChart, getMultiLineChartDatasets } from '../../components/charts/LineChart'
import { DataTableComponent } from '../../components/tables/Table'
import { ExportToExcel } from '../../components/tableExporters'
import { Loader } from '../../components/loaders/Loader'
import { COLUMNS_LEAGUE_TABLE } from '../LeagueStandings/tableColumns'
import LEAGUE_NAMES from '../../Leagues.json'
import { arange, getValuesByKey, max } from '../../jsUtils/general'
import { getMaxLimitCeiledBy10 } from '../LeagueStandings'
import {
    CONTAINER_STYLES,
    CURRENT_SEASON,
    EXCEL_EXPORTER_STYLES,
    LEAGUE_COLOR_MAPPER,
} from '../../config'


const DEFAULTS = {
    league: 'EPL',
}


class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            league: DEFAULTS.league, // League selected to show current season's league standings
            wrangledDataObj: {},
        }
        this.updateLeague = this.updateLeague.bind(this)
        this.updateWrangledData = this.updateWrangledData.bind(this)
    }

    updateLeague(event) {
        this.setState({
            league: event.key,
        })
    }
    
    updateWrangledData() {
        const { GeneralStatsData } = this.props
        if (Object.keys(GeneralStatsData).includes('currentSeasonLeagueStandings')) {
            const currentSeasonLeagueStandings = GeneralStatsData['currentSeasonLeagueStandings']
            const leagues = Object.keys(currentSeasonLeagueStandings)
            let wrangledDataObj = {}
            for (let league of leagues) {
                wrangledDataObj[league] = {
                    maxGamesPlayed: max(getValuesByKey(currentSeasonLeagueStandings[league], "gamesPlayed")),
                    teams: getValuesByKey(currentSeasonLeagueStandings[league], "team"),
                    points: getValuesByKey(currentSeasonLeagueStandings[league], "points"),
                    cumulativePoints: getValuesByKey(currentSeasonLeagueStandings[league], "cumulativePoints"),
                    cumulativeGoalDifferences: getValuesByKey(currentSeasonLeagueStandings[league], "cumulativeGoalDifference"),
                }
            }
            this.setState({
                wrangledDataObj: wrangledDataObj,
            })
        }
    }
    
    updateData() {
        this.props.getGeneralStatsData()
    }

    componentDidMount() {
        this.updateData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { GeneralStatsData } = this.props
        if (prevProps.GeneralStatsData !== GeneralStatsData && Object.keys(GeneralStatsData).length > 0) {
            this.updateWrangledData()
        }
    }

    render() {
        const { wrangledDataObj } = this.state
        const { GeneralStatsData, GeneralStatsDataApiStatus } = this.props
        const dataIsAvailable = (Object.keys(GeneralStatsData).length > 0 && Object.keys(wrangledDataObj).length > 0)
        let numUniqueTeamsByLeague = {}
        let avgGoalsScoredByLeague = {}
        let avgGoalDifferenceByLeague = {}
        let currentSeasonLeagueLeaders = {}
        let currentSeasonLeagueStandings = {}
        let currentSeasonBestPerformers = {}
        let titleCurrentSeasonLeagueStandings = ""
        if (dataIsAvailable) {
            numUniqueTeamsByLeague = GeneralStatsData['numUniqueTeamsByLeague']
            avgGoalsScoredByLeague = GeneralStatsData['avgGoalsScoredByLeague']
            avgGoalDifferenceByLeague = GeneralStatsData['avgGoalDifferenceByLeague']
            currentSeasonLeagueLeaders = GeneralStatsData['currentSeasonLeagueLeaders']
            currentSeasonLeagueStandings = GeneralStatsData['currentSeasonLeagueStandings']
            currentSeasonBestPerformers = GeneralStatsData['currentSeasonBestPerformers']
            titleCurrentSeasonLeagueStandings = `Current season's league standings - ${this.state.league}`
        }

        const leaguesMenu = (
            <Menu>
                {
                    LEAGUE_NAMES.map((league) => (
                        <Menu.Item key={league} onClick={this.updateLeague}>
                            <p>
                                { league }
                                &nbsp;
                                { this.state.league === league ? <SelectOutlined /> : null }
                            </p>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )

        return (
            <Card>
                { GeneralStatsDataApiStatus === 'initiated' ? <Loader /> : null }
                {
                    dataIsAvailable ?
                    <div style={CONTAINER_STYLES}>
                        <h3>General stats</h3>
                        <Row>
                            <Col span={8}>
                                <Statistic title="Number of league matches in database" value={GeneralStatsData['numLeagueMatchesInDb']} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Date of first collected record" value={GeneralStatsData['dateOfFirstCollectedRecord']} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Date of last collected record" value={GeneralStatsData['dateOfLastCollectedRecord']} />
                            </Col>
                        </Row>
                        <br />
                        <h3>Number of teams (over the years)</h3>
                        <Row>
                            <Col span={4}>
                                <Statistic title="Bundesliga" value={numUniqueTeamsByLeague['Bundesliga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="EPL" value={numUniqueTeamsByLeague['EPL']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="La Liga" value={numUniqueTeamsByLeague['La Liga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Ligue 1" value={numUniqueTeamsByLeague['Ligue 1']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Serie A" value={numUniqueTeamsByLeague['Serie A']} />
                            </Col>
                        </Row>
                        <br />
                        <h3>Goals scored per game (over the years)</h3>
                        <Row>
                            <Col span={4}>
                                <Statistic title="Bundesliga" value={avgGoalsScoredByLeague['Bundesliga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="EPL" value={avgGoalsScoredByLeague['EPL']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="La Liga" value={avgGoalsScoredByLeague['La Liga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Ligue 1" value={avgGoalsScoredByLeague['Ligue 1']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Serie A" value={avgGoalsScoredByLeague['Serie A']} />
                            </Col>
                        </Row>
                        <br />
                        <h3>Goal difference per game (over the years)</h3>
                        <Row>
                            <Col span={4}>
                                <Statistic title="Bundesliga" value={avgGoalDifferenceByLeague['Bundesliga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="EPL" value={avgGoalDifferenceByLeague['EPL']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="La Liga" value={avgGoalDifferenceByLeague['La Liga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Ligue 1" value={avgGoalDifferenceByLeague['Ligue 1']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Serie A" value={avgGoalDifferenceByLeague['Serie A']} />
                            </Col>
                        </Row>
                        <br />
                        <h3>Current season's league leaders ({CURRENT_SEASON}) <FlagOutlined /></h3>
                        <Row style={{alignItems: 'center'}}>
                            <Col span={4}>
                                <Statistic title="Bundesliga" value={currentSeasonLeagueLeaders['Bundesliga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="EPL" value={currentSeasonLeagueLeaders['EPL']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="La Liga" value={currentSeasonLeagueLeaders['La Liga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Ligue 1" value={currentSeasonLeagueLeaders['Ligue 1']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Serie A" value={currentSeasonLeagueLeaders['Serie A']} />
                            </Col>
                        </Row>

                        <br /><br /><br /><br /><br /><br />

                        <hr />
                        {
                            LEAGUE_NAMES.map((league) => (
                                <>
                                    <h3>{league} ({CURRENT_SEASON})</h3>
                                    <Row style={{alignItems: 'center'}}>
                                        <Col span={8}>
                                            <Statistic
                                                title="Best GSPG"
                                                value={
                                                    `${currentSeasonBestPerformers[league]['BestAvgGoalsScored']['team']} (${currentSeasonBestPerformers[league]['BestAvgGoalsScored']['reading']})`
                                                }
                                                valueStyle={{color: LEAGUE_COLOR_MAPPER[league]}}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title="Best GAPG"
                                                value={
                                                    `${currentSeasonBestPerformers[league]['BestAvgGoalsAllowed']['team']} (${currentSeasonBestPerformers[league]['BestAvgGoalsAllowed']['reading']})`
                                                }
                                                valueStyle={{color: LEAGUE_COLOR_MAPPER[league]}}
                                            />
                                        </Col>
                                        <Col span={8}>
                                            <Statistic
                                                title="Best clean-sheet-ratio"
                                                value={
                                                    `${currentSeasonBestPerformers[league]['BestCleanSheetPercent']['team']} (${currentSeasonBestPerformers[league]['BestCleanSheetPercent']['reading']}%)`
                                                }
                                                valueStyle={{color: LEAGUE_COLOR_MAPPER[league]}}
                                            />
                                        </Col>
                                    </Row>
                                    <br />
                                    <hr />
                                </>
                            ))
                        }

                        <br /><br /><br /><br /><br />

                        <Dropdown overlay={leaguesMenu}>
                            <Button>{this.state.league === "" ? "League" : this.state.league}</Button>
                        </Dropdown>
                        <div style={EXCEL_EXPORTER_STYLES}>
                            <ExportToExcel
                                filenameWithoutExtension={titleCurrentSeasonLeagueStandings}
                                sheetName={titleCurrentSeasonLeagueStandings}
                                data={currentSeasonLeagueStandings[this.state.league]}
                                columnInfo={COLUMNS_LEAGUE_TABLE}
                                columnLabelAccessor="name"
                                columnValueAccessor="selector"
                            />
                        </div>
                        <DataTableComponent
                            title={titleCurrentSeasonLeagueStandings}
                            arrayOfObjects={currentSeasonLeagueStandings[this.state.league]}
                            columns={COLUMNS_LEAGUE_TABLE}
                            defaultSortField="position"
                            pagination={true}
                        />

                        <br /><br /><br /><br /><br />
                        
                        <MultiLineChart
                            title={`Title Race - ${this.state.league}`}
                            xLabel="Matchday"
                            yLabel="Points (Cumulative)"
                            xTicks={
                                arange(0, wrangledDataObj[this.state.league]['maxGamesPlayed'])
                            }
                            datasets={
                                getMultiLineChartDatasets(
                                    wrangledDataObj[this.state.league]['teams'],
                                    wrangledDataObj[this.state.league]['cumulativePoints'],
                                )
                            }
                            datasetsSlicer={[1, 8]} // For top 8 teams
                            yLow={0}
                            yHigh={
                                getMaxLimitCeiledBy10(
                                    wrangledDataObj[this.state.league]['points']
                                )
                            }
                        />

                        <br /><br /><br /><br /><br />
                        
                        <MultiLineChart
                            title={`Cumulative Goal Difference - ${this.state.league}`}
                            xLabel="Matchday"
                            yLabel="Goal Difference (Cumulative)"
                            xTicks={
                                arange(0, wrangledDataObj[this.state.league]['maxGamesPlayed'])
                            }
                            datasets={
                                getMultiLineChartDatasets(
                                    wrangledDataObj[this.state.league]['teams'],
                                    wrangledDataObj[this.state.league]['cumulativeGoalDifferences'],
                                )
                            }
                            datasetsSlicer={[1, 8]} // For top 8 teams
                        />
                    </div>
                    : null
                }
            </Card>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        GeneralStatsData: state.GeneralStatsReducer.GeneralStatsData,
        GeneralStatsDataApiStatus: state.GeneralStatsReducer.GeneralStatsDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGeneralStatsData: () => {
            dispatch(GeneralStatsActions.getGeneralStatsData())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)