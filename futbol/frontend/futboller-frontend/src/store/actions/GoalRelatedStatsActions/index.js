import axios from "axios"
import { createAction } from "redux-actions"
import { API_URL } from "./../../../config"


export const getGoalRelatedStats = createAction('GET_GOAL_RELATED_STATS')
export const getGoalRelatedStatsSuccess = createAction('GET_GOAL_RELATED_STATS_SUCCESS')
export const getGoalRelatedStatsError = createAction('GET_GOAL_RELATED_STATS_ERROR')


export const getGoalRelatedStatsData = () => {
    return dispatch => {
        dispatch(getGoalRelatedStats())
        axios.get(`${API_URL}/leagues/goal-related-stats/`)
            .then(response => {
                if (response.data) {
                    dispatch(getGoalRelatedStatsSuccess({ data: response.data }))
                }
                else {
                    dispatch(getGoalRelatedStatsError())
                }
            })
            .catch(error => {
                dispatch(getGoalRelatedStatsError())
            })
    }
}