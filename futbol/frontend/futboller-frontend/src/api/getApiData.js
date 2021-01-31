const DomainName = "https://cors-anywhere.herokuapp.com/http://futboller-api.herokuapp.com"
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
    let response = await fetch(url, { mode: "cors" })
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