import React from 'react'
import { connect } from 'react-redux'
import { Button, DatePicker, Dropdown, Menu } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import * as LeagueMatchesActions from '../../store/actions/LeagueMatchesActions'
import { DataTableComponent } from '../../components/tables/Table'
import { ExportToExcel } from '../../components/tableExporters'
import { Loader } from '../../components/loaders/Loader'
import { COLUMNS_LEAGUE_MATCHES } from './tableColumns'

import {
    momentObjToString,
    momentObjToMonthGroupVerbose,
} from './../../jsUtils/datetimes'

import LEAGUE_NAMES from '../../Leagues.json'
import SEASON_NAMES from '../../Seasons.json'
import TEAM_NAMES_BY_LEAGUE from '../../TeamsByLeague.json'


const { RangePicker } = DatePicker
const { SubMenu } = Menu

// Default filter params for league match data
const DEFAULTS = {
    startDate: '',
    endDate: '',
    monthGroupVerbose: '',
    league: 'EPL',
    season: '2020-21',
    team: '',
}


class LeagueMatches extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: DEFAULTS.startDate,
            endDate: DEFAULTS.endDate,
            monthGroupVerbose: DEFAULTS.monthGroupVerbose,
            league: DEFAULTS.league,
            season: DEFAULTS.season,
            team: DEFAULTS.team,
        }

        this.updateDateRange = this.updateDateRange.bind(this)
        this.updateMonthGroupVerbose = this.updateMonthGroupVerbose.bind(this)
        this.updateLeague = this.updateLeague.bind(this)
        this.updateSeason = this.updateSeason.bind(this)
        this.updateTeam = this.updateTeam.bind(this)
        this.resetState = this.resetState.bind(this)
        this.updateData = this.updateData.bind(this)
    }

    updateDateRange(dateRange) {
        const value = [ ...dateRange ]
        const startDate = value[0]
        const endDate = value[1]
        this.setState({
            startDate: momentObjToString(startDate),
            endDate: momentObjToString(endDate),
        })
    }

    updateMonthGroupVerbose(monthGroupDateObj) {
        const monthGroupVerbose = momentObjToMonthGroupVerbose(monthGroupDateObj)
        this.setState({ monthGroupVerbose: monthGroupVerbose })
    }

    updateLeague(event) {
        this.setState({ league: event.key })
    }

    updateSeason(event) {
        this.setState({ season: event.key })
    }

    updateTeam(event) {
        this.setState({ team: event.key })
    }

    resetState() {
        this.setState({
            startDate: '',
            endDate: '',
            monthGroupVerbose: '',
            league: '',
            season: '',
            team: '',
        })
    }

    updateData() {
        const {
            startDate,
            endDate,
            monthGroupVerbose,
            league,
            season,
            team,
        } = this.state
        this.props.getLeagueMatchesData({
            startDate: startDate,
            endDate: endDate,
            monthGroupVerbose: monthGroupVerbose,
            league: league,
            season: season,
            team: team,
        })
    }

    componentDidMount() {
        this.updateData()
    }

    render() {
        const { LeagueMatchesData, LeagueMatchesDataApiStatus } = this.props
        const dataIsAvailable = (LeagueMatchesData.length > 0)
        const titleLeagueMatchesData = "League Matches"
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
        const seasonsMenu = (
            <Menu>
                {
                    SEASON_NAMES.reverse().map((season) => (
                        <Menu.Item key={season} onClick={this.updateSeason}>
                            <p>
                                { season }
                                &nbsp;
                                { this.state.season === season ? <SelectOutlined /> : null }
                            </p>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )
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
                <h1>League Matches - Top 5 Leagues</h1>
                <br />

                <RangePicker onChange={this.updateDateRange} />
                &nbsp;&nbsp;
                <Dropdown overlay={leaguesMenu}>
                    <Button>League</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <Dropdown overlay={seasonsMenu}>
                    <Button>Season</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <Dropdown overlay={teamsMenu}>
                    <Button>Team</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <DatePicker picker="month" onChange={this.updateMonthGroupVerbose} />
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.updateData} disabled={false}>
                    Fetch data
                </Button>
                &nbsp;&nbsp;
                <Button type="default" onClick={this.resetState} disabled={false}>
                    Reset
                </Button>

                {
                    LeagueMatchesDataApiStatus === 'initiated' ? <Loader /> : null
                }

                {
                    LeagueMatchesDataApiStatus === 'success' && LeagueMatchesData.length === 0 ? "No data available" : null
                }

                {
                    dataIsAvailable ?
                    <>
                        <br /><br />
                        <ExportToExcel
                            filenameWithoutExtension={titleLeagueMatchesData}
                            sheetName={titleLeagueMatchesData}
                            data={LeagueMatchesData}
                            columnInfo={COLUMNS_LEAGUE_MATCHES}
                            columnLabelAccessor="name"
                            columnValueAccessor="selector"
                        />
                        <DataTableComponent
                            title={titleLeagueMatchesData}
                            arrayOfObjects={LeagueMatchesData}
                            columns={COLUMNS_LEAGUE_MATCHES}
                            defaultSortField="date"
                            pagination={true}
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
        LeagueMatchesData: state.LeagueMatchesReducer.LeagueMatchesData,
        LeagueMatchesDataApiStatus: state.LeagueMatchesReducer.LeagueMatchesDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLeagueMatchesData: (objQueryParams) => {
            dispatch(LeagueMatchesActions.getLeagueMatchesData(objQueryParams))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeagueMatches)