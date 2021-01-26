import React, { useState } from 'react'

import { getCrossLeagueStandings } from '../api/getApiData'

import { DoughnutChart } from '../components/charts/DoughnutChart'
import { RadarChart } from '../components/charts/RadarChart'

import TeamsAvailable from '../Teams.json'

import {
    ceil,
    getValuesByKey,
    max,
} from '../jsUtils/general'


export default function CrossLeagueStatsByTeam() {
    const [data, setData] = useState([]) // Will contain cross league standings data (array of objects)
    const [team, setTeam] = useState("")
    const updateData = () => {
        getCrossLeagueStandings()
            .then(function(response) {
                setData(response)
            })
    }
    const updateTeam = event => setTeam(event.target.value)
    const getDataByTeam = (data, team) => {
        for (let obj of data) {
            if (obj["team"] === team) {
                return obj
            }
        }
        return {}
    }

    return (
        <div>
            <h1>Cross League Stats By Team - Top 5 Leagues</h1>
            <br />

            <form className="cross-league-stats-form">
                <select name="cross-league-teams" onChange={updateTeam}>
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
                    onClick={updateData}
                />
            </form>

            {
                data.length > 0 ? 
                <>
                    <br /><br />
                    <RadarChart
                        title={`CrossLeagueStats - ${team} - AvgStats`}
                        values={
                            [
                                getDataByTeam(data, team)["avgPoints"],
                                getDataByTeam(data, team)["avgGoalsScored"],
                                getDataByTeam(data, team)["winPercent"] / 100,
                                getDataByTeam(data, team)["bigWinPercent"] / 100,
                                getDataByTeam(data, team)["cleanSheetsPercent"] / 100,
                            ]
                        }
                        labels={
                            [
                                "AvgPoints",
                                "AvgGoalsScored",
                                "WinRatio",
                                "BigWinRatio",
                                "CleanSheetRatio",
                            ]
                        }
                        color="#6897EC"
                        scaleTicksMin={0}
                        scaleTicksMax={
                            ceil(
                                max([
                                    max(getValuesByKey(data, "avgPoints")),
                                    max(getValuesByKey(data, "avgGoalsScored")),
                                ])
                            )
                        }
                    />
                    <br /><br />
                    <DoughnutChart
                        title={`CrossLeagueStats - ${team} - Wins/Losses/Draws`}
                        values={
                            [
                                getDataByTeam(data, team)["winPercent"],
                                getDataByTeam(data, team)["lossPercent"],
                                getDataByTeam(data, team)["drawPercent"],
                            ]
                        }
                        labels={
                            [
                                "WinPercent",
                                "LossPercent",
                                "DrawPercent",
                            ]
                        }
                    />
                </>
                : null
            }
        </div>
    )
}