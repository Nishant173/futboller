import React from 'react'

import { getCrossLeagueStandings } from '../api/getApiData'

import { DoughnutChart } from '../components/charts/DoughnutChart'
import { RadarChart } from '../components/charts/RadarChart'

import TeamsAvailable from '../Teams.json'

import {
    ceil,
    getValuesByKey,
    max,
} from '../jsUtils/general'


// Takes array of objects having cross league standings and returns object by "team" (if team exists)
function filterCrossLeagueStandingsByTeam(standings, team) {
    for (let standing of standings) {
        if (standing["team"] === team) {
            return standing
        }
    }
    return {}
}


export default class CrossLeagueStatsByTeam extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            team: "",
            dataByTeam: {},
        }
        this.updateData = this.updateData.bind(this)
        this.updateTeam = this.updateTeam.bind(this)
        this.updateDataByTeam = this.updateDataByTeam.bind(this)
    }

    updateData() {
        getCrossLeagueStandings()
            .then((response) => {
                this.setState({
                    data: response,
                })
                this.updateDataByTeam()
            })
    }

    updateTeam(event) {
        this.setState({
            team: event.target.value,
        })
    }

    updateDataByTeam() {
        this.setState({
            dataByTeam: filterCrossLeagueStandingsByTeam(this.state.data, this.state.team),
        })
    }

    render() {
        return (
            <div>
                <h1>Cross League Stats By Team - Top 5 Leagues</h1>
                <br />

                <form className="cross-league-stats-form">
                    <select name="cross-league-teams" onChange={this.updateTeam}>
                        <option>-</option>
                        {
                            TeamsAvailable.map((TeamAvailable) => (
                                <option value={TeamAvailable}>{TeamAvailable}</option>
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
                    this.state.data.length > 0 ? 
                    <>
                        <br /><br />
                        <RadarChart
                            title={`${this.state.team} - CrossLeagueStats - AvgStats`}
                            values={
                                [
                                    this.state.dataByTeam["avgPoints"],
                                    this.state.dataByTeam["avgGoalsScored"],
                                    this.state.dataByTeam["winPercent"] / 100,
                                    this.state.dataByTeam["bigWinPercent"] / 100,
                                    this.state.dataByTeam["cleanSheetsPercent"] / 100,
                                ]
                            }
                            labels={ ["AvgPoints", "AvgGoalsScored", "WinRatio", "BigWinRatio", "CleanSheetRatio"] }
                            color="#6897EC"
                            scaleTicksMin={0}
                            scaleTicksMax={ // Need to set scale based on stats of ALL teams
                                ceil(
                                    max([
                                        max(getValuesByKey(this.state.data, "avgPoints")),
                                        max(getValuesByKey(this.state.data, "avgGoalsScored")),
                                    ])
                                )
                            }
                        />
                        <br /><br />
                        <DoughnutChart
                            title={`${this.state.team} - CrossLeagueStats - Wins/Losses/Draws`}
                            values={
                                [
                                    this.state.dataByTeam["winPercent"],
                                    this.state.dataByTeam["lossPercent"],
                                    this.state.dataByTeam["drawPercent"],
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