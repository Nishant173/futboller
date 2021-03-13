import React from 'react'
import { connect } from 'react-redux'

import * as HeadToHeadStatsActions from '../../store/actions/HeadToHeadStatsActions'
import { DoughnutChart } from '../../components/charts/DoughnutChart'
import { Loader } from '../../components/loaders/Loader'
import TEAM_NAMES from '../../Teams.json'


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
            team1: event.target.value,
        })
    }

    updateTeam2(event) {
        this.setState({
            team2: event.target.value,
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

        return (
            <div>
                <h1>League head-to-head stats - Top 5 Leagues</h1>
                <br />

                <h3>Enter matchup</h3>
                <form>
                    <select name="team1" onChange={this.updateTeam1}>
                        {
                            TEAM_NAMES.map((team) => (
                                <option
                                    selected={team === DEFAULTS.team1 ? true : false}
                                    value={team}
                                >
                                    {team}
                                </option>
                            ))
                        }
                    </select>
                    <select name="team2" onChange={this.updateTeam2}>
                        {
                            TEAM_NAMES.map((team) => (
                                <option
                                    selected={team === DEFAULTS.team2 ? true : false}
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
                    H2HStatsDataApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                    dataIsAvailable ?
                    <>
                        <br /><br />
                        <DoughnutChart
                            title={`Head-to-head stats - ${dataOfTeam1['team']} vs ${dataOfTeam2['team']}`}
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
                    </>
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