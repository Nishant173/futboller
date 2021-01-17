from typing import Any
import json
import requests


def save_object_as_json(obj: Any,
                        filepath: str) -> None:
    with open(file=filepath, mode='w') as fp:
        json.dump(obj=obj, fp=fp, indent=4)
    return None


def get_api_data(url: str) -> Any:
    """Gets data (Python object) from API endpoint"""
    response = requests.get(url=url)
    if not response.ok:
        raise Exception(f"Error with response. Status code: {response.status_code}. URL: {url}")
    data = json.loads(response.text)
    return data


def save_league_names() -> None:
    url = "http://localhost:8000/api/v1/leagues/leagues/"
    data = get_api_data(url=url)
    save_object_as_json(obj=data, filepath=f"json/Leagues.json")
    return None


def save_season_names() -> None:
    url = "http://localhost:8000/api/v1/leagues/seasons/"
    data = get_api_data(url=url)
    save_object_as_json(obj=data, filepath=f"json/Seasons.json")
    return None


def save_team_names() -> None:
    url = "http://localhost:8000/api/v1/leagues/teams/"
    data = get_api_data(url=url)
    save_object_as_json(obj=data, filepath=f"json/Teams.json")
    return None


def save_league_standings() -> None:
    leagues = ["Bundesliga", "EPL", "La Liga", "Ligue 1", "Serie A"]
    seasons = [
        "2009-10", "2010-11", "2011-12", "2012-13", "2013-14",
        "2014-15", "2015-16", "2016-17", "2017-18", "2018-19",
    ]
    for league in leagues:
        for season in seasons:
            url = f"http://localhost:8000/api/v1/leagues/league-standings/?league={league}&season={season}"
            data = get_api_data(url=url)
            save_object_as_json(obj=data,
                                filepath=f"json/LeagueStandings - {league} ({season}).json")
    return None


def save_cross_league_standings() -> None:
    cross_league_standings = []
    offset = 1
    limit = 20
    while True:
        url = f"http://localhost:8000/api/v1/leagues/cross-league-standings/?offset={offset}&limit={limit}"
        temp_cls = get_api_data(url=url)
        cross_league_standings.extend(temp_cls)
        offset += limit
        if len(temp_cls) == 0:
            break
    save_object_as_json(obj=cross_league_standings, filepath=f"json/CrossLeagueStandings.json")
    return None


if __name__ == "__main__":
    save_league_names()
    save_season_names()
    save_team_names()
    save_league_standings()
    save_cross_league_standings()
    print("Done")