import { handleActions } from "redux-actions"
import { API_STATUS } from "./../../../config"

const ResultsTimelineReducer = {
    ResultsTimelineData: [],
    ResultsTimelineDataApiStatus: "<null>",
}

const reducer = handleActions(
    {
        GET_RESULTS_TIMELINE: (state, actions) => {
            return {
                ...state,
                ResultsTimelineData: [],
                ResultsTimelineDataApiStatus: API_STATUS.initiated,
            }
        },
        GET_RESULTS_TIMELINE_SUCCESS: (state, actions) => {
            const data = [ ...actions.payload.data ]
            return {
                ...state,
                ResultsTimelineData: data,
                ResultsTimelineDataApiStatus: API_STATUS.success,
            }
        },
        GET_RESULTS_TIMELINE_ERROR: (state, actions) => {
            return {
                ...state,
                ResultsTimelineData: [],
                ResultsTimelineDataApiStatus: API_STATUS.error,
            }
        },
    },
    ResultsTimelineReducer
)

export default reducer