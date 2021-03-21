import { handleActions } from "redux-actions"
import { API_STATUS } from "./../../../config"

const LeagueMatchesReducer = {
    LeagueMatchesData: [],
    LeagueMatchesDataApiStatus: "<null>",
}

const reducer = handleActions(
    {
        GET_LEAGUE_MATCHES: (state, actions) => {
            return {
                ...state,
                LeagueMatchesData: [],
                LeagueMatchesDataApiStatus: API_STATUS.initiated,
            }
        },
        GET_LEAGUE_MATCHES_SUCCESS: (state, actions) => {
            const data = [ ...actions.payload.data ]
            return {
                ...state,
                LeagueMatchesData: data,
                LeagueMatchesDataApiStatus: API_STATUS.success,
            }
        },
        GET_LEAGUE_MATCHES_ERROR: (state, actions) => {
            return {
                ...state,
                LeagueMatchesData: [],
                LeagueMatchesDataApiStatus: API_STATUS.error,
            }
        },
    },
    LeagueMatchesReducer
)

export default reducer