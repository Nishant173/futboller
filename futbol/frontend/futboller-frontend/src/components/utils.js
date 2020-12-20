export function ceilBy(number, by) {
    return Math.ceil((number + 1) / by) * by;
}

export function getTeamNames(leagueStandingsArray) {
    let teams = [];
    leagueStandingsArray.forEach((leagueStanding) => (
        teams.push(leagueStanding.team)
    ))
    return teams
}

export function getPoints(leagueStandingsArray) {
    let points = [];
    leagueStandingsArray.forEach((leagueStanding) => (
        points.push(leagueStanding.points)
    ))
    return points
}

export function getGoalDifferences(leagueStandingsArray) {
    let gds = [];
    leagueStandingsArray.forEach((leagueStanding) => (
        gds.push(leagueStanding.goalDifference)
    ))
    return gds
}

export function getMaxOfAbsGoalDiff(leagueStandingsArray) {
    let gds = getGoalDifferences(leagueStandingsArray);
    let low = Math.min.apply(Math, gds);
    let high = Math.max.apply(Math, gds);
    let absLow = Math.abs(low);
    let absHigh = Math.abs(high);
    let maxOfAbsoluteGoalDiff;
    if (absLow > absHigh) {
        maxOfAbsoluteGoalDiff = absLow;
    } else {
        maxOfAbsoluteGoalDiff = absHigh;
    }
    return maxOfAbsoluteGoalDiff;
}