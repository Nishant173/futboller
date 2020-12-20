export async function getLeagueStandingsAsync(league, season) {
    let url = `https://raw.githubusercontent.com/Nishant173/futboller/main/data/json/LeagueStandings - ${league} (${season}).json`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export function getLeagueStandings(league, season) {
    const request = new XMLHttpRequest();
    request.open("GET", `https://raw.githubusercontent.com/Nishant173/futboller/main/data/json/LeagueStandings - ${league} (${season}).json`);
    request.send();
    request.onload = () => {
        const data = JSON.parse(request.response);
        return data;
    }
    return [];
}