# futboller
Web-application that provides football data from the top 5 European leagues (API + frontend)

## About
- Open the `demo` folder in the root directory, and watch the demonstration via `demo.mp4`

## Installation
- To install backend API dependencies, use `pip install -r requirements.txt` on the command line (from root directory)
- To install frontend UI dependencies, use `npm install` on the command line (from `futbol/frontend/futboller-frontend/` directory)

## Usage
- From the `futbol` directory, run `python manage.py runserver` to run the local server.
- Visit the API documentation at `localhost:8000/api/v1/documentation/` to learn about the available endpoints.
- From the `futbol/frontend/futboller-frontend` directory, run `npm start` and open `localhost:3000` to interact with the UI.

## To do
- The names of teams obtained from Understat are different from those existing in legacy CSV files. Eg: RB Leipzig (legacy CSVs) is named RasenBallsport Leipzig (on Understat). Map all the unique team names (every season) by changing the mapper dictionary in `data_ingestion/config.py`

## Looping through offset barrier
- Use the following snippet to access all records of a resource by looping through the offset.
- Change the URL in the `get_api_data_via_offset_loop` function as needed.
```python
from typing import Any, List
import json
import requests


def get_api_data(url: str) -> Any:
    """Gets data from API endpoint"""
    response = requests.get(url=url)
    if not response.ok:
        raise Exception(f"Error with response. Status code: {response.status_code}. URL: {url}")
    result = json.loads(response.text)
    return result


def get_api_data_via_offset_loop() -> List[Any]:
    """Gets data for all records of a resource by looping through the offset"""
    all_results = []
    offset = 1
    limit = 25
    while True:
        url = f"http://localhost:8000/api/v1/cross-league-standings/?offset={offset}&limit={limit}"
        temp_result = get_api_data(url=url)
        all_results += temp_result
        offset += limit
        if len(temp_result) == 0:
            break
    return all_results


if __name__ == "__main__":
    results = get_api_data_via_offset_loop()
```

## Screenshots
#### API - League standings
![API - League standings](screenshots/API-LeagueStandings.png)

#### UI - Scatter chart - CrossLeague - AvgPtsVsAvgGd (With team names)
![UI - Cross leagues scatter chart](screenshots/UI-ScatterChart-CrossLeague-AvgPtsVsAvgGd-WithTeamNames.png)

#### UI - Scatter chart - CrossLeague - AvgPtsVsAvgGd (By league)
![UI - Cross leagues scatter chart (By league)](screenshots/UI-ScatterChart-CrossLeague-AvgPtsVsAvgGd-ByLeague.png)

#### UI - Line chart - League - Title race
![UI - League Title Race line chart](screenshots/UI-LineChart-League-TitleRace.png)