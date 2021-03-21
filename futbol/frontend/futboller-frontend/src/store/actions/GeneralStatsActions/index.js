import axios from "axios"
import { createAction } from "redux-actions"
import { API_URL } from "./../../../config"


export const getGeneralStats = createAction('GET_GENERAL_STATS')
export const getGeneralStatsSuccess = createAction('GET_GENERAL_STATS_SUCCESS')
export const getGeneralStatsError = createAction('GET_GENERAL_STATS_ERROR')


export const getGeneralStatsData = () => {
    return dispatch => {
        dispatch(getGeneralStats())
        axios.get(`${API_URL}/leagues/general-stats/`)
            .then(response => {
                if (response.data) {
                    dispatch(getGeneralStatsSuccess({ data: response.data }))
                }
                else {
                    dispatch(getGeneralStatsError())
                }
            })
            .catch(error => {
                dispatch(getGeneralStatsError())
            })
    }
}