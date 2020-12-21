export function ceilBy(number, by) {
    return Math.ceil((number + 1) / by) * by
}

export function getTeamNames(leagueStandingsArray) {
    let teams = []
    leagueStandingsArray.forEach((leagueStanding) => (
        teams.push(leagueStanding.team)
    ))
    return teams
}

export function getPoints(leagueStandingsArray) {
    let points = []
    leagueStandingsArray.forEach((leagueStanding) => (
        points.push(leagueStanding.points)
    ))
    return points
}

export function getGoalDifferences(leagueStandingsArray) {
    let gds = []
    leagueStandingsArray.forEach((leagueStanding) => (
        gds.push(leagueStanding.goalDifference)
    ))
    return gds
}

export function getMaxOfAbsGoalDiff(goalDifferences) {
    let low = Math.min.apply(Math, goalDifferences)
    let high = Math.max.apply(Math, goalDifferences)
    let absLow = Math.abs(low)
    let absHigh = Math.abs(high)
    let maxOfAbsoluteGoalDiff
    if (absLow > absHigh) {
        maxOfAbsoluteGoalDiff = absLow
    } else {
        maxOfAbsoluteGoalDiff = absHigh
    }
    return maxOfAbsoluteGoalDiff
}

// Returns array of objects having (x, y) co-ordinates of AvgPoints and AvgGoalDifference
export function getAvgPtsAndGdCoordinates(crossLeagueStandingsArray) {
    let avgPtsAndGd = []
    crossLeagueStandingsArray.forEach((standing) => (
        avgPtsAndGd.push({
            x: standing['avgPoints'],
            y: standing['avgGoalDifference'],
        })
    ))
    return avgPtsAndGd
}