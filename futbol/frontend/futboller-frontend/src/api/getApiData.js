export async function getLeagueStandings(league, season) {
    const url = `https://raw.githubusercontent.com/Nishant173/futboller/main/data_ingestion/json_data_from_api/LeagueStandings - ${league} (${season}).json`
    const response = await fetch(url)
    const data = await response.json()
    return data
}


export async function getCrossLeagueStandings() {
    const url = "https://raw.githubusercontent.com/Nishant173/futboller/main/data_ingestion/json_data_from_api/CrossLeagueStandings.json"
    const response = await fetch(url)
    const data = await response.json()
    return data
}