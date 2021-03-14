import axios from "axios"
import { createAction } from "redux-actions"
import { API_URL } from "./../../../config"


export const getCrossLeagueStandings = createAction('GET_CROSS_LEAGUE_STANDINGS')
export const getCrossLeagueStandingsSuccess = createAction('GET_CROSS_LEAGUE_STANDINGS_SUCCESS')
export const getCrossLeagueStandingsError = createAction('GET_CROSS_LEAGUE_STANDINGS_ERROR')

export const getCrossLeagueStatsByTeam = createAction('GET_CROSS_LEAGUE_STATS_BY_TEAM')
export const getCrossLeagueStatsByTeamSuccess = createAction('GET_CROSS_LEAGUE_STATS_BY_TEAM_SUCCESS')
export const getCrossLeagueStatsByTeamError = createAction('GET_CROSS_LEAGUE_STATS_BY_TEAM_ERROR')


export const getCrossLeagueStandingsData = () => {
    return dispatch => {
        dispatch(getCrossLeagueStandings())
        axios.get(`${API_URL}/leagues/cross-league-standings/`)
            .then(response => {
                if (response.data) {
                    dispatch(getCrossLeagueStandingsSuccess({ data: response.data }))
                }
                else {
                    dispatch(getCrossLeagueStandingsError())
                }
            })
            .catch(error => {
                dispatch(getCrossLeagueStandingsError())
            })
    }
}

export const getCrossLeagueStatsDataByTeam = (team) => {
    return dispatch => {
        dispatch(getCrossLeagueStatsByTeam())
        axios.get(`${API_URL}/leagues/cross-league-standings/?team=${team}`)
            .then(response => {
                if (response.data) {
                    dispatch(getCrossLeagueStatsByTeamSuccess({ data: response.data[0] }))
                }
                else {
                    dispatch(getCrossLeagueStatsByTeamError())
                }
            })
            .catch(error => {
                dispatch(getCrossLeagueStatsByTeamError())
            })
    }
}