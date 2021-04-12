import React from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Menu, Row, Col } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import * as HeadToHeadStatsActions from '../../store/actions/HeadToHeadStatsActions'
import { DataTableComponent } from '../../components/tables/Table'
import { DoughnutChart } from '../../components/charts/DoughnutChart'
import { Loader } from '../../components/loaders/Loader'
import LEAGUE_NAMES from '../../Leagues.json'
import TEAM_NAMES_BY_LEAGUE from '../../TeamsByLeague.json'
import { CONTAINER_STYLES } from '../../config'
import { COLUMNS_H2H_STATS } from './tableColumns'
import { ExportToExcel } from '../../components/tableExporters'


const { SubMenu } = Menu

const DEFAULTS = {
    team1: "AC Milan",
    team2: "Inter",
}


class LeagueHeadToHeadStats extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            team1: DEFAULTS.team1,
            team2: DEFAULTS.team2,
            dataOfTeam1: {},
            dataOfTeam2: {},
        }
        this.updateData = this.updateData.bind(this)
        this.updateDataByTeam = this.updateDataByTeam.bind(this)
        this.updateTeam1 = this.updateTeam1.bind(this)
        this.updateTeam2 = this.updateTeam2.bind(this)
    }

    updateTeam1(event) {
        this.setState({
            team1: event.key,
        })
    }

    updateTeam2(event) {
        this.setState({
            team2: event.key,
        })
    }

    updateData() {
        const { team1, team2 } = this.state
        this.props.getLeagueH2hStatsData(team1, team2)
    }

    updateDataByTeam() {
        const { H2HStatsData } = this.props
        if (H2HStatsData.length === 2) {
            this.setState({
                dataOfTeam1: H2HStatsData[0],
                dataOfTeam2: H2HStatsData[1],
            })
        }
        else {
            this.setState({
                dataOfTeam1: {},
                dataOfTeam2: {},
            })
        }
    }

    componentDidMount() {
        this.updateData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { H2HStatsData } = this.props
        if (prevProps.H2HStatsData !== H2HStatsData && H2HStatsData.length === 2) {
            this.updateDataByTeam()
        }
    }

    render() {
        const { dataOfTeam1, dataOfTeam2 } = this.state
        const { H2HStatsData, H2HStatsDataApiStatus } = this.props
        const dataIsAvailable = (H2HStatsData.length === 2)
        let title = "Head-to-head stats"
        if (dataIsAvailable) {
            title += ` (${H2HStatsData[0]['team']} vs ${H2HStatsData[1]['team']})`
        }

        const teamsMenu = (onClickFunction) => (
            <Menu>
                {
                    LEAGUE_NAMES.map((league) => (
                        <SubMenu title={league}>
                            {
                                TEAM_NAMES_BY_LEAGUE[league].map((team) => (
                                    <Menu.Item key={team} onClick={onClickFunction}>
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
                <h1>League head-to-head stats - Top 5 Leagues</h1>
                <br />

                <h3>Enter matchup</h3>
                <Dropdown overlay={teamsMenu(this.updateTeam1)}>
                    <Button>{this.state.team1}</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <Dropdown overlay={teamsMenu(this.updateTeam2)}>
                    <Button>{this.state.team2}</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.updateData} disabled={false}>
                    Fetch data
                </Button>

                {
                    H2HStatsDataApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                    dataIsAvailable && H2HStatsDataApiStatus !== 'initiated' ?
                    <>
                        <br /><br />
                        <Row>
                            <Col span={15} style={{marginTop: '3%'}}>
                                <div style={{marginLeft: '80%'}}>
                                    <ExportToExcel
                                        filenameWithoutExtension={title}
                                        sheetName={title}
                                        data={H2HStatsData}
                                        columnInfo={COLUMNS_H2H_STATS}
                                        columnLabelAccessor="name"
                                        columnValueAccessor="selector"
                                    />
                                </div>
                                <DataTableComponent
                                    title={title}
                                    arrayOfObjects={H2HStatsData}
                                    columns={COLUMNS_H2H_STATS}
                                    defaultSortField="team"
                                    pagination={false}
                                />
                            </Col>
                            <Col span={9}>
                                <DoughnutChart
                                    title={title}
                                    values={
                                        [
                                            dataOfTeam1["wins"],
                                            dataOfTeam1["draws"],
                                            dataOfTeam2["wins"],
                                        ]
                                    }
                                    labels={
                                        [
                                            `${dataOfTeam1["team"]} wins`,
                                            `Draws`,
                                            `${dataOfTeam2["team"]} wins`,
                                        ]
                                    }
                                    colors={ ["#7AA2EC", "#403636", "#47C014"] }
                                />
                            </Col>
                        </Row>
                    </>
                    : null
                }
                {
                    !dataIsAvailable && H2HStatsDataApiStatus !== 'initiated' ?
                        <h2 style={{marginTop: '5%'}}>No Data Available</h2>
                        : null
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        H2HStatsData: state.HeadToHeadStatsReducer.H2HStatsData,
        H2HStatsDataApiStatus: state.HeadToHeadStatsReducer.H2HStatsDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLeagueH2hStatsData: (team1, team2) => {
            dispatch(HeadToHeadStatsActions.getLeagueH2hStatsData(team1, team2))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueHeadToHeadStats)