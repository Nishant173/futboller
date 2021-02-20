const DOMAIN_NAME = "http://futboller-api.herokuapp.com"
const API_VERSION = "api/v1"


// Converts key-value pairs in an object to string used for query-params
function objectToQueryParamsString(obj) {
    let queryParams = "?"
    for (const [key, value] of Object.entries(obj)) {
        queryParams += `${key}=${value}&`
    }
    queryParams = queryParams.slice(0, queryParams.length - 1)
    return queryParams
}


function addQueryParamsIfAny(url, objQueryParams=null) {
    if (objQueryParams !== null) {
        let urlModified = url + objectToQueryParamsString(objQueryParams)
        return urlModified
    }
    return url
}


async function getApiDataFromUrl(url) {
    let response = await fetch(url, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
    })
    let data = await response.json()
    return data
}


export function getLeagueMatches(objQueryParams=null) {
    let url = `${DOMAIN_NAME}/${API_VERSION}/leagues/league-matches/`
    url = addQueryParamsIfAny(url, objQueryParams)
    return getApiDataFromUrl(url)
}


export function getLeagueHeadToHeadStats(objQueryParams=null) {
    let url = `${DOMAIN_NAME}/${API_VERSION}/leagues/head-to-head-stats/`
    url = addQueryParamsIfAny(url, objQueryParams)
    return getApiDataFromUrl(url)
}


export function getPartitionedStatsByTeam(objQueryParams=null) {
    let url = `${DOMAIN_NAME}/${API_VERSION}/leagues/partitioned-stats/`
    url = addQueryParamsIfAny(url, objQueryParams)
    return getApiDataFromUrl(url)
}


export function getGoalRelatedStatsOverTime() {
    let url = `${DOMAIN_NAME}/${API_VERSION}/leagues/goal-related-stats/`
    return getApiDataFromUrl(url)
}


export function getLeagueStandings(objQueryParams=null) {
    let url = `${DOMAIN_NAME}/${API_VERSION}/leagues/league-standings/`
    url = addQueryParamsIfAny(url, objQueryParams)
    return getApiDataFromUrl(url)
}


export function getCrossLeagueStandings(objQueryParams=null) {
    let url = `${DOMAIN_NAME}/${API_VERSION}/leagues/cross-league-standings/`
    url = addQueryParamsIfAny(url, objQueryParams)
    return getApiDataFromUrl(url)
}