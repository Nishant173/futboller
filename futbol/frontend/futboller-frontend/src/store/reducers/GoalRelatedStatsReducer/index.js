import { handleActions } from "redux-actions"
import { API_STATUS } from "./../../../config"

const GoalRelatedStatsReducer = {
    GRSData: {},
    GRSDataApiStatus: "<null>",
}

const reducer = handleActions(
    {
        GET_GOAL_RELATED_STATS: (state, actions) => {
            return {
                ...state,
                GRSData: {},
                GRSDataApiStatus: API_STATUS.initiated,
            }
        },
        GET_GOAL_RELATED_STATS_SUCCESS: (state, actions) => {
            const data = { ...actions.payload.data }
            return {
                ...state,
                GRSData: data,
                GRSDataApiStatus: API_STATUS.success,
            }
        },
        GET_GOAL_RELATED_STATS_ERROR: (state, actions) => {
            return {
                ...state,
                GRSData: {},
                GRSDataApiStatus: API_STATUS.error,
            }
        },
    },
    GoalRelatedStatsReducer
)

export default reducer