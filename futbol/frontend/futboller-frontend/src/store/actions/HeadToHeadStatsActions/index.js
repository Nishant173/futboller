import axios from "axios"
import { createAction } from "redux-actions"
import { API_URL } from "./../../../config"


export const getLeagueH2hStats = createAction('GET_LEAGUE_H2H_STATS')
export const getLeagueH2hStatsSuccess = createAction('GET_LEAGUE_H2H_STATS_SUCCESS')
export const getLeagueH2hStatsError = createAction('GET_LEAGUE_H2H_STATS_ERROR')


export const getLeagueH2hStatsData = (team1, team2) => {
    return dispatch => {
        dispatch(getLeagueH2hStats())
        axios.get(`${API_URL}/leagues/head-to-head-stats/?matchup=${team1},${team2}`)
            .then(response => {
                if (response.data) {
                    if (response.data.length === 2) {
                        dispatch(getLeagueH2hStatsSuccess({ data: response.data }))
                    }
                    else {
                        dispatch(getLeagueH2hStatsError())
                    }
                }
                else {
                    dispatch(getLeagueH2hStatsError())
                }
            })
            .catch(error => {
                dispatch(getLeagueH2hStatsError())
            })
    }
}