import axios from "axios"
import { createAction } from "redux-actions"
import { API_URL } from "./../../../config"
import { addQueryParamsToUrl } from "./../../../jsUtils/urlOps"


export const getResultsTimeline = createAction('GET_RESULTS_TIMELINE')
export const getResultsTimelineSuccess = createAction('GET_RESULTS_TIMELINE_SUCCESS')
export const getResultsTimelineError = createAction('GET_RESULTS_TIMELINE_ERROR')


/*
Accepts object having query params data.
Keys accepted are: ['team', 'season', 'startDate', 'endDate', 'monthGroupVerbose']
Keys that are mandatory: ['team']
Formats for certain query params:
    - startDate and endDate: "yyyy-mm-dd"
    - monthGroupVerbose: "2019 September", "2017 June", etc
*/
export const getResultsTimelineData = (objQueryParams) => {
    for (let [key, value] of Object.entries(objQueryParams)) {
        if (value === "") {
            delete objQueryParams[key]
        }
    }
    const url = addQueryParamsToUrl(`${API_URL}/leagues/results-timeline/`, objQueryParams)

    return dispatch => {
        dispatch(getResultsTimeline())
        axios.get(url)
            .then(response => {
                if (response.data) {
                    dispatch(getResultsTimelineSuccess({ data: response.data }))
                }
                else {
                    dispatch(getResultsTimelineError())
                }
            })
            .catch(error => {
                dispatch(getResultsTimelineError())
            })
    }
}