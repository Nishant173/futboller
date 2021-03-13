import React from 'react'
import { connect } from 'react-redux'

import * as CrossLeagueStandingsActions from '../../store/actions/CrossLeagueStandingsActions'
import { DoughnutChart } from '../../components/charts/DoughnutChart'
import { RadarChart } from '../../components/charts/RadarChart'
import { Loader } from '../../components/loaders/Loader'
import TEAM_NAMES from '../../Teams.json'


const DEFAULTS = {
    teamSelected: TEAM_NAMES[0],
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
            team: event.target.value,
        })
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

        return (
            <div>
                <h1>Cross League Stats By Team - Top 5 Leagues</h1>
                <br />

                <form>
                    <select name="cross-league-teams" onChange={this.updateTeam}>
                        {
                            TEAM_NAMES.map((team) => (
                                <option
                                    selected={team === DEFAULTS.teamSelected ? true : false}
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
                    CLSDataApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                   dataIsAvailable ?
                    <>
                        <br /><br />
                        <RadarChart
                            title={`${CLSDataByTeam['team']} - CrossLeagueStats - AvgStats`}
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
                        <br /><br />
                        <DoughnutChart
                            title={`${CLSDataByTeam.team} - CrossLeagueStats - Wins/Losses/Draws`}
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