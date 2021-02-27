import React from 'react'

import { getLeagueHeadToHeadStats } from '../api/getApiData'
import { DoughnutChart } from '../components/charts/DoughnutChart'
import TEAM_NAMES from '../Teams.json'


const DEFAULTS = {
    team1: "AC Milan",
    team2: "Inter",
}


export default class LeagueHeadToHeadStats extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            dataOfTeam1: {},
            dataOfTeam2: {},
            team1: DEFAULTS.team1,
            team2: DEFAULTS.team2,
        }
        this.updateData = this.updateData.bind(this)
        this.updateDataByTeam = this.updateDataByTeam.bind(this)
        this.updateTeam1 = this.updateTeam1.bind(this)
        this.updateTeam2 = this.updateTeam2.bind(this)
    }

    componentDidMount() {
        this.updateData()
    }

    updateData() {
        getLeagueHeadToHeadStats({
            matchup: `${this.state.team1},${this.state.team2}`
        })
            .then((response) => {
                this.setState({
                    data: response,
                }, this.updateDataByTeam)
            })
    }

    updateDataByTeam() {
        if (this.state.data.length === 2) {
            this.setState({
                dataOfTeam1: this.state.data[0],
                dataOfTeam2: this.state.data[1],
            })
        }
        else {
            this.setState({
                dataOfTeam1: {},
                dataOfTeam2: {},
            })
        }
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
                    this.state.data.length === 2 ? 
                    <>
                        <br /><br />
                        <DoughnutChart
                            title={`Head-to-head stats - ${this.state.dataOfTeam1.team} vs ${this.state.dataOfTeam2.team}`}
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