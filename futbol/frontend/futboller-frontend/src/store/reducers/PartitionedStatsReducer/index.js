import { handleActions } from "redux-actions"
import { API_STATUS } from "./../../../config"

const PartitionedStatsReducer = {
    PartitionedStats: [],
    PartitionedStatsApiStatus: "<null>",
}

const reducer = handleActions(
    {
        GET_PARTITIONED_STATS: (state, actions) => {
            return {
                ...state,
                PartitionedStats: [],
                PartitionedStatsApiStatus: API_STATUS.initiated,
            }
        },
        GET_PARTITIONED_STATS_SUCCESS: (state, actions) => {
            const data = [ ...actions.payload.data ]
            return {
                ...state,
                PartitionedStats: data,
                PartitionedStatsApiStatus: API_STATUS.success,
            }
        },
        GET_PARTITIONED_STATS_ERROR: (state, actions) => {
            return {
                ...state,
                PartitionedStats: [],
                PartitionedStatsApiStatus: API_STATUS.error,
            }
        },
    },
    PartitionedStatsReducer
)

export default reducer