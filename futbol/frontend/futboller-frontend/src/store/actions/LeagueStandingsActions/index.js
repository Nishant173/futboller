import axios from "axios"
import { createAction } from "redux-actions"
import { API_URL } from "./../../../config"


export const getLeagueStandings = createAction('GET_LEAGUE_STANDINGS')
export const getLeagueStandingsSuccess = createAction('GET_LEAGUE_STANDINGS_SUCCESS')
export const getLeagueStandingsError = createAction('GET_LEAGUE_STANDINGS_ERROR')


export const getLeagueStandingsData = (league, season) => {
    return dispatch => {
        dispatch(getLeagueStandings())
        axios.get(`${API_URL}/leagues/league-standings/?league=${league}&season=${season}`)
            .then(response => {
                if (response.data) {
                    dispatch(getLeagueStandingsSuccess({ data: response.data }))
                }
                else {
                    dispatch(getLeagueStandingsError())
                }
            })
            .catch(error => {
                dispatch(getLeagueStandingsError())
            })
    }
}