import { handleActions } from "redux-actions"
import { API_STATUS } from "./../../../config"

const HeadToHeadStatsReducer = {
    H2HStatsData: [],
    H2HStatsDataApiStatus: "<null>",
}

const reducer = handleActions(
    {
        GET_LEAGUE_H2H_STATS: (state, actions) => {
            return {
                ...state,
                H2HStatsData: [],
                H2HStatsDataApiStatus: API_STATUS.initiated,
            }
        },
        GET_LEAGUE_H2H_STATS_SUCCESS: (state, actions) => {
            const data = [ ...actions.payload.data ]
            return {
                ...state,
                H2HStatsData: data,
                H2HStatsDataApiStatus: API_STATUS.success,
            }
        },
        GET_LEAGUE_H2H_STATS_ERROR: (state, actions) => {
            return {
                ...state,
                H2HStatsData: [],
                H2HStatsDataApiStatus: API_STATUS.error,
            }
        },
    },
    HeadToHeadStatsReducer
)

export default reducer