import { handleActions } from "redux-actions"
import { API_STATUS } from "./../../../config"

const GeneralStatsReducer = {
    GeneralStatsData: {},
    GeneralStatsDataApiStatus: "<null>",
}

const reducer = handleActions(
    {
        GET_GENERAL_STATS: (state, actions) => {
            return {
                ...state,
                GeneralStatsData: {},
                GeneralStatsDataApiStatus: API_STATUS.initiated,
            }
        },
        GET_GENERAL_STATS_SUCCESS: (state, actions) => {
            const data = { ...actions.payload.data }
            return {
                ...state,
                GeneralStatsData: data,
                GeneralStatsDataApiStatus: API_STATUS.success,
            }
        },
        GET_GENERAL_STATS_ERROR: (state, actions) => {
            return {
                ...state,
                GeneralStatsData: {},
                GeneralStatsDataApiStatus: API_STATUS.error,
            }
        },
    },
    GeneralStatsReducer
)

export default reducer