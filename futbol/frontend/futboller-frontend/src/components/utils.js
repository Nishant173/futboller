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

export function getXlimitFromGD(leagueStandingsArray) {
    let gds = getGoalDifferences(leagueStandingsArray);
    let low = Math.min.apply(Math, gds);
    let high = Math.max.apply(Math, gds);
    let absLow = Math.abs(low);
    let absHigh = Math.abs(high);
    let xLimit;
    if (absLow > absHigh) {
        xLimit = absLow;
    } else {
        xLimit = absHigh;
    }
    return xLimit;
}

export function ceilByTen(number) {
    return Math.ceil((number+1) / 10) * 10;
}