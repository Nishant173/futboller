export function isValidLeagueStandings(data) {
    const isValidBundesliga = (data.length === 18) & (data[0].league === "Bundesliga");
    const isValidOtherLeagues = (data.length === 20);
    return (isValidBundesliga) || (isValidOtherLeagues);
}