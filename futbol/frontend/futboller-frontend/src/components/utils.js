// Returns array of objects having (x, y) co-ordinates of AvgPoints and AvgGoalDifference respectively
export function getAvgPtsAndAvgGdCoords(crossLeagueStandingsArray) {
    let avgPtsAndAvgGdCoords = []
    crossLeagueStandingsArray.forEach((standing) => (
        avgPtsAndAvgGdCoords.push({
            x: standing['avgPoints'],
            y: standing['avgGoalDifference'],
        })
    ))
    return avgPtsAndAvgGdCoords
}


// Returns object having keys = league name, and values = CrossLeagueStandings array for respective leagues
export function filterStandingsByLeague(crossLeagueStandingsArray) {
    let standingsEpl = []
    let standingsBundesliga = []
    let standingsLaLiga = []
    let standingsLigue1 = []
    let standingsSerieA = []
    for (let standing of crossLeagueStandingsArray) {
        if (standing['league'] === 'EPL') {
            standingsEpl.push(standing)
        } else if (standing['league'] === 'Bundesliga') {
            standingsBundesliga.push(standing)
        } else if (standing['league'] === 'La Liga') {
            standingsLaLiga.push(standing)
        } else if (standing['league'] === 'Ligue 1') {
            standingsLigue1.push(standing)
        } else if (standing['league'] === 'Serie A') {
            standingsSerieA.push(standing)
        }
    }
    return {
        'EPL': standingsEpl,
        'Bundesliga': standingsBundesliga,
        'La Liga': standingsLaLiga,
        'Ligue 1': standingsLigue1,
        'Serie A': standingsSerieA,
    }
}