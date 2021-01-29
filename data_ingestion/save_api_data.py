from config import LEAGUE_SEASONS_AVAILABLE
from utils import get_api_data, save_object_as_json


def save_league_names() -> None:
    url = "http://localhost:8000/api/v1/leagues/leagues/"
    data = get_api_data(url=url)
    save_object_as_json(obj=data, filepath=f"json_data_from_api/Leagues.json")
    return None


def save_season_names() -> None:
    url = "http://localhost:8000/api/v1/leagues/seasons/"
    data = get_api_data(url=url)
    save_object_as_json(obj=data, filepath=f"json_data_from_api/Seasons.json")
    return None


def save_team_names() -> None:
    url = "http://localhost:8000/api/v1/leagues/teams/"
    data = get_api_data(url=url)
    save_object_as_json(obj=data, filepath=f"json_data_from_api/Teams.json")
    return None


def save_league_standings() -> None:
    leagues = ["Bundesliga", "EPL", "La Liga", "Ligue 1", "Serie A"]
    for league in leagues:
        for season in LEAGUE_SEASONS_AVAILABLE:
            url = f"http://localhost:8000/api/v1/leagues/league-standings/?league={league}&season={season}"
            data = get_api_data(url=url)
            save_object_as_json(obj=data,
                                filepath=f"json_data_from_api/LeagueStandings - {league} ({season}).json")
    return None


def save_cross_league_standings() -> None:
    url = "http://localhost:8000/api/v1/leagues/cross-league-standings/"
    cross_league_standings = get_api_data(url=url)
    save_object_as_json(
        obj=cross_league_standings,
        filepath=f"json_data_from_api/CrossLeagueStandings.json",
    )
    return None


if __name__ == "__main__":
    save_league_names()
    save_season_names()
    save_team_names()
    save_league_standings()
    save_cross_league_standings()
    print("Saved data from API")