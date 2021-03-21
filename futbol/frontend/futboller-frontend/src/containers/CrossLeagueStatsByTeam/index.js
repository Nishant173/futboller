import React from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Menu, Row, Col } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import * as CrossLeagueStandingsActions from '../../store/actions/CrossLeagueStandingsActions'
import { DoughnutChart } from '../../components/charts/DoughnutChart'
import { RadarChart } from '../../components/charts/RadarChart'
import { Loader } from '../../components/loaders/Loader'
import LEAGUE_NAMES from '../../Leagues.json'
import TEAM_NAMES_BY_LEAGUE from '../../TeamsByLeague.json'
import { CONTAINER_STYLES } from '../../config'


const { SubMenu } = Menu

const DEFAULTS = {
    teamSelected: 'Bayern Munich',
}


class CrossLeagueStatsByTeam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            team: DEFAULTS.teamSelected,
        }
        this.updateData = this.updateData.bind(this)
        this.updateTeam = this.updateTeam.bind(this)
    }

    updateTeam(event) {
        this.setState({
            team: event.key,
        }, this.updateData)
    }

    updateData() {
        this.props.getCrossLeagueStatsDataByTeam(this.state.team)
    }

    componentDidMount() {
        this.updateData()
    }

    render() {
        const { CLSDataByTeam, CLSDataApiStatus } = this.props
        const dataIsAvailable = (Object.keys(CLSDataByTeam).length > 0)

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
            <div style={CONTAINER_STYLES}>
                <h1>Cross League Stats (by team) - Top 5 Leagues</h1>
                <br />

                <Dropdown overlay={teamsMenu}>
                    <Button>{this.state.team}</Button>
                </Dropdown>
                
                {
                    CLSDataApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                   dataIsAvailable ?
                    <>
                        <br /><br />
                        <Row>
                            <Col span={12}>
                                <RadarChart
                                    title="Average Stats"
                                    values={
                                        [
                                            CLSDataByTeam["avgPoints"],
                                            CLSDataByTeam["avgGoalsScored"],
                                            CLSDataByTeam["winPercent"] / 100,
                                            CLSDataByTeam["bigWinPercent"] / 100,
                                            CLSDataByTeam["cleanSheetsPercent"] / 100,
                                        ]
                                    }
                                    labels={ ["AvgPoints", "AvgGoalsScored", "WinRatio", "BigWinRatio", "CleanSheetRatio"] }
                                    color="#6897EC"
                                    scaleTicksMin={0}
                                    scaleTicksMax={
                                        CLSDataByTeam["avgGoalsScored"] > 3 ? CLSDataByTeam["avgGoalsScored"] + 0.2 : 3
                                    }
                                />
                            </Col>
                            <Col span={12}>
                                <DoughnutChart
                                    title="Wins/Losses/Draws"
                                    values={
                                        [
                                            CLSDataByTeam["winPercent"],
                                            CLSDataByTeam["lossPercent"],
                                            CLSDataByTeam["drawPercent"],
                                        ]
                                    }
                                    labels={ ["WinPercent", "LossPercent", "DrawPercent"] }
                                    colors={ ["green", "red", "grey"] }
                                />
                            </Col>
                        </Row>
                    </>
                    : null
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        CLSDataByTeam: state.CrossLeagueStandingsReducer.CLSDataByTeam,
        CLSDataApiStatus: state.CrossLeagueStandingsReducer.CLSDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCrossLeagueStatsDataByTeam: (team) => {
            dispatch(CrossLeagueStandingsActions.getCrossLeagueStatsDataByTeam(team))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CrossLeagueStatsByTeam)