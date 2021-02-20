import React from 'react'

import { getLeagueHeadToHeadStats } from '../api/getApiData'
import { DoughnutChart } from '../components/charts/DoughnutChart'
import TEAM_NAMES from '../Teams.json'


export default class LeagueHeadToHeadStats extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataOfTeam1: {},
            dataOfTeam2: {},
            team1: "",
            team2: "",
        }
        this.updateData = this.updateData.bind(this)
        this.updateTeam1 = this.updateTeam1.bind(this)
        this.updateTeam2 = this.updateTeam2.bind(this)
    }

    updateData() {
        getLeagueHeadToHeadStats({
            matchup: `${this.state.team1},${this.state.team2}`
        })
            .then((response) => {
                this.setState({
                    data: response,
                })
                if (response.length === 2) {
                    this.setState({
                        dataOfTeam1: response[0],
                        dataOfTeam2: response[1],
                    })
                }
                else {
                    this.setState({
                        dataOfTeam1: {},
                        dataOfTeam2: {},
                    })
                }
            })
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

    render() {
        return (
            <div>
                <h1>League head-to-head stats - Top 5 Leagues</h1>
                <br />

                <h3>Enter matchup</h3>
                <form>
                    <select name="team1" onChange={this.updateTeam1}>
                        <option>-</option>
                        {
                            TEAM_NAMES.map((team) => (
                                <option value={team}>{team}</option>
                            ))
                        }
                    </select>
                    <select name="team2" onChange={this.updateTeam2}>
                        <option>-</option>
                        {
                            TEAM_NAMES.map((team) => (
                                <option value={team}>{team}</option>
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
                    this.state.data.length === 2 ? 
                    <>
                        <br /><br />
                        <DoughnutChart
                            title={`Head-to-head stats - ${this.state.team1} vs ${this.state.team2}`}
                            values={
                                [
                                    this.state.dataOfTeam1["wins"],
                                    this.state.dataOfTeam1["draws"],
                                    this.state.dataOfTeam2["wins"],
                                ]
                            }
                            labels={
                                [
                                    `${this.state.dataOfTeam1["team"]} wins`,
                                    `Draws`,
                                    `${this.state.dataOfTeam2["team"]} wins`,
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