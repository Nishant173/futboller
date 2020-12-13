import json
import requests


def save_object_as_json(obj, filepath):
    with open(file=filepath, mode='w') as fp:
        json.dump(obj=obj, fp=fp, indent=4)
    return None


def save_api_data():
    """Saves data fetched from the API to local JSON file/s"""
    standings = [
        {"league": "Bundesliga", "season": "2012-13"},
        {"league": "EPL", "season": "2012-13"},
        {"league": "La Liga", "season": "2012-13"},
        {"league": "Ligue 1", "season": "2012-13"},
        {"league": "Serie A", "season": "2012-13"},
    ]
    for standing in standings:
        league = standing['league']
        season = standing['season']
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