import json
import requests


def save_object_as_json(obj, filepath):
    with open(file=filepath, mode='w') as fp:
        json.dump(obj=obj, fp=fp, indent=4)
    return None


def save_league_standings():
    leagues = ["Bundesliga", "EPL", "La Liga", "Ligue 1", "Serie A"]
    seasons = [
        "2009-10", "2010-11", "2011-12", "2012-13", "2013-14",
        "2014-15", "2015-16", "2016-17", "2017-18", "2018-19",
    ]
    for league in leagues:
        for season in seasons:
            url = f"http://localhost:8000/api/v1/league-standings/?league={league}&season={season}"
            response = requests.get(url=url)
            if response.ok:
                obj = json.loads(response.text)
                save_object_as_json(obj=obj, filepath=f"json/LeagueStandings - {league} ({season}).json")
            else:
                print(f"API error for {league} ({season}) data")
    return None


def save_cross_league_standings():
    url = "http://localhost:8000/api/v1/cross-league-standings/"
    response = requests.get(url=url)
    if response.ok:
        obj = json.loads(response.text)
        save_object_as_json(obj=obj, filepath=f"json/CrossLeagueStandings.json")
    else:
        print("API error for cross league standings data")
    return None


if __name__ == "__main__":
    save_league_standings()
    save_cross_league_standings()
    print("Done")