import { handleActions } from "redux-actions"
import { API_STATUS } from "./../../../config"

const CrossLeagueStandingsReducer = {
    CLSData: [], // For all teams
    CLSDataByTeam: {}, // For one team
    CLSDataApiStatus: "<null>",
}

const reducer = handleActions(
    {
        GET_CROSS_LEAGUE_STANDINGS: (state, actions) => {
            return {
                ...state,
                CLSData: [],
                CLSDataApiStatus: API_STATUS.initiated,
            }
        },
        GET_CROSS_LEAGUE_STANDINGS_SUCCESS: (state, actions) => {
            const data = [ ...actions.payload.data ]
            return {
                ...state,
                CLSData: data,
                CLSDataApiStatus: API_STATUS.success,
            }
        },
        GET_CROSS_LEAGUE_STANDINGS_ERROR: (state, actions) => {
            return {
                ...state,
                CLSData: [],
                CLSDataApiStatus: API_STATUS.error,
            }
        },

        GET_CROSS_LEAGUE_STATS_BY_TEAM: (state, actions) => {
            return {
                ...state,
                CLSDataByTeam: {},
                CLSDataApiStatus: API_STATUS.initiated,
            }
        },
        GET_CROSS_LEAGUE_STATS_BY_TEAM_SUCCESS: (state, actions) => {
            const data = { ...actions.payload.data }
            return {
                ...state,
                CLSDataByTeam: data,
                CLSDataApiStatus: API_STATUS.success,
            }
        },
        GET_CROSS_LEAGUE_STATS_BY_TEAM_ERROR: (state, actions) => {
            return {
                ...state,
                CLSDataByTeam: {},
                CLSDataApiStatus: API_STATUS.error,
            }
        },
    },
    CrossLeagueStandingsReducer
)

export default reducer