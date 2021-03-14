import { handleActions } from "redux-actions"
import { API_STATUS } from "./../../../config"

const LeagueStandingsReducer = {
    LeagueStandingsData: [],
    LeagueStandingsDataApiStatus: "<null>",
}

const reducer = handleActions(
    {
        GET_LEAGUE_STANDINGS: (state, actions) => {
            return {
                ...state,
                LeagueStandingsData: [],
                LeagueStandingsDataApiStatus: API_STATUS.initiated,
            }
        },
        GET_LEAGUE_STANDINGS_SUCCESS: (state, actions) => {
            const data = [ ...actions.payload.data ]
            return {
                ...state,
                LeagueStandingsData: data,
                LeagueStandingsDataApiStatus: API_STATUS.success,
            }
        },
        GET_LEAGUE_STANDINGS_ERROR: (state, actions) => {
            return {
                ...state,
                LeagueStandingsData: [],
                LeagueStandingsDataApiStatus: API_STATUS.error,
            }
        },
    },
    LeagueStandingsReducer
)

export default reducer