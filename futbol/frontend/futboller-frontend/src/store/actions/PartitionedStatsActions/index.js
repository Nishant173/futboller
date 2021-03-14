import axios from "axios"
import { createAction } from "redux-actions"
import { API_URL } from "./../../../config"


export const getPartitionedStats = createAction('GET_PARTITIONED_STATS')
export const getPartitionedStatsSuccess = createAction('GET_PARTITIONED_STATS_SUCCESS')
export const getPartitionedStatsError = createAction('GET_PARTITIONED_STATS_ERROR')


export const getPartitionedStatsData = (team) => {
    return dispatch => {
        dispatch(getPartitionedStats())
        axios.get(`${API_URL}/leagues/partitioned-stats/?team=${team}`)
            .then(response => {
                if (response.data) {
                    dispatch(getPartitionedStatsSuccess({ data: response.data }))
                }
                else {
                    dispatch(getPartitionedStatsError())
                }
            })
            .catch(error => {
                dispatch(getPartitionedStatsError())
            })
    }
}