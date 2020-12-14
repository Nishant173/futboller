import json
import requests


def save_object_as_json(obj, filepath):
    with open(file=filepath, mode='w') as fp:
        json.dump(obj=obj, fp=fp, indent=4)
    return None


def save_api_data():
    """Saves data fetched from the API to local JSON file/s"""
    leagues = ["Bundesliga", "EPL", "La Liga", "Ligue 1", "Serie A"]
    seasons = [
        "2009-10", "2010-11", "2011-12", "2012-13", "2013-14",
        "2014-15", "2015-16", "2016-17", "2017-18", "2018-19",
    ]
    for league in leagues:
        for season in seasons:
            url = f"http://localhost:8000/api/v1/league-standings?league={league}&season={season}"
            response = requests.get(url=url)
            if response.ok:
                obj = json.loads(response.text)
                save_object_as_json(obj=obj, filepath=f"json/{league} ({season}).json")
            else:
                print(f"API error for {league} ({season}) data")
    print("Done")
    return None


if __name__ == "__main__":
    save_api_data()