const DomainName = "http://futboller-api.herokuapp.com"
const ApiVersion = "api/v1"


// Converts key-value pairs in an object to string used for query-params
function objectToQueryParamsString(obj) {
    let queryParams = "?"
    for (const [key, value] of Object.entries(obj)) {
        queryParams += `${key}=${value}&`
    }
    queryParams = queryParams.slice(0, queryParams.length - 1)
    return queryParams
}


// Returns data from given API endpoint
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
    let url = `${DomainName}/${ApiVersion}/leagues/league-matches/`
    if (objQueryParams !== null) {
        url += objectToQueryParamsString(objQueryParams)
    }
    return getApiDataFromUrl(url)
}


export function getLeagueHeadToHeadStats(objQueryParams=null) {
    let url = `${DomainName}/${ApiVersion}/leagues/head-to-head-stats/`
    if (objQueryParams !== null) {
        url += objectToQueryParamsString(objQueryParams)
    }
    return getApiDataFromUrl(url)
}


export function getPartitionedStatsByTeam(objQueryParams=null) {
    let url = `${DomainName}/${ApiVersion}/leagues/partitioned-stats/`
    if (objQueryParams !== null) {
        url += objectToQueryParamsString(objQueryParams)
    }
    return getApiDataFromUrl(url)
}


export function getLeagueStandings(objQueryParams=null) {
    let url = `${DomainName}/${ApiVersion}/leagues/league-standings/`
    if (objQueryParams !== null) {
        url += objectToQueryParamsString(objQueryParams)
    }
    return getApiDataFromUrl(url)
}


export function getCrossLeagueStandings(objQueryParams=null) {
    let url = `${DomainName}/${ApiVersion}/leagues/cross-league-standings/`
    if (objQueryParams !== null) {
        url += objectToQueryParamsString(objQueryParams)
    }
    return getApiDataFromUrl(url)
}