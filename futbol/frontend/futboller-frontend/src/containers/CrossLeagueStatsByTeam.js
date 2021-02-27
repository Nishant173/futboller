import React from 'react'

import { getCrossLeagueStandings } from '../api/getApiData'
import { DoughnutChart } from '../components/charts/DoughnutChart'
import { RadarChart } from '../components/charts/RadarChart'
import TEAM_NAMES from '../Teams.json'


const DEFAULTS = {
    teamSelected: TEAM_NAMES[0],
}


// // Takes array of objects having cross league standings and returns object by "team" (if team exists)
// function filterCrossLeagueStandingsByTeam(standings, team) {
//     for (let standing of standings) {
//         if (standing["team"] === team) {
//             return standing
//         }
//     }
//     return {}
// }


export default class CrossLeagueStatsByTeam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            team: DEFAULTS.teamSelected,
        }
        this.updateData = this.updateData.bind(this)
        this.updateTeam = this.updateTeam.bind(this)
    }

    componentDidMount() {
        this.updateData()
    }

    updateData() {
        getCrossLeagueStandings({ team: this.state.team })
            .then((response) => {
                this.setState({
                    data: response[0], // Response will be an array having one object
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
                <h1>Cross League Stats By Team - Top 5 Leagues</h1>
                <br />

                <form className="cross-league-stats-form">
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
                    Object.keys(this.state.data).length > 0 ? 
                    <>
                        <br /><br />
                        <RadarChart
                            title={`${this.state.data.team} - CrossLeagueStats - AvgStats`}
                            values={
                                [
                                    this.state.data["avgPoints"],
                                    this.state.data["avgGoalsScored"],
                                    this.state.data["winPercent"] / 100,
                                    this.state.data["bigWinPercent"] / 100,
                                    this.state.data["cleanSheetsPercent"] / 100,
                                ]
                            }
                            labels={ ["AvgPoints", "AvgGoalsScored", "WinRatio", "BigWinRatio", "CleanSheetRatio"] }
                            color="#6897EC"
                            scaleTicksMin={0}
                            scaleTicksMax={
                                this.state.data["avgGoalsScored"] > 3 ? this.state.data["avgGoalsScored"] + 0.2 : 3
                            }
                        />
                        <br /><br />
                        <DoughnutChart
                            title={`${this.state.data.team} - CrossLeagueStats - Wins/Losses/Draws`}
                            values={
                                [
                                    this.state.data["winPercent"],
                                    this.state.data["lossPercent"],
                                    this.state.data["drawPercent"],
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