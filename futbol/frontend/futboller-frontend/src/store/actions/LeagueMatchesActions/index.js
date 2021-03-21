import axios from "axios"
import { createAction } from "redux-actions"
import { API_URL } from "./../../../config"
import { addQueryParamsToUrl } from "./../../../jsUtils/urlOps"


export const getLeagueMatches = createAction('GET_LEAGUE_MATCHES')
export const getLeagueMatchesSuccess = createAction('GET_LEAGUE_MATCHES_SUCCESS')
export const getLeagueMatchesError = createAction('GET_LEAGUE_MATCHES_ERROR')


/*
Accepts object having query params data (if any).
Keys accepted are:
    [
        'team', 'homeTeam', 'awayTeam', 'league', 'season', 'startDate', 'endDate',
        'monthGroupVerbose', 'goalDifference', 'minGoalDifference', 'maxGoalDifference',
        'matchup', 'winningTeam', 'losingTeam',
    ]
Formats for certain query params:
    - startDate and endDate: "yyyy-mm-dd"
    - matchup: "Arsenal,Chelsea"
    - monthGroupVerbose: "2019 September", "2017 June", etc
*/
export const getLeagueMatchesData = (objQueryParams) => {
    for (let [key, value] of Object.entries(objQueryParams)) {
        if (value === "") {
            delete objQueryParams[key]
        }
    }
    const url = addQueryParamsToUrl(`${API_URL}/leagues/league-matches/`, objQueryParams)
    
    return dispatch => {
        dispatch(getLeagueMatches())
        axios.get(url)
            .then(response => {
                if (response.data) {
                    dispatch(getLeagueMatchesSuccess({ data: response.data }))
                }
                else {
                    dispatch(getLeagueMatchesError())
                }
            })
            .catch(error => {
                dispatch(getLeagueMatchesError())
            })
    }
}