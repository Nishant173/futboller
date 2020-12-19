# futboller
API for top 5 leagues football data

## Installation
- Install the backend API dependencies with `pip install -r requirements.txt`

## Usage
- From the `futbol` directory, run `python manage.py runserver` to run the local server.
- Visit the API documentation at `localhost:8000/api/v1/documentation/` to learn about the available endpoints.

## Looping through offset barrier
- Use the following snippet to access all records of a resource by looping through the offset.
```python
from typing import Dict, List, Union
import json
import requests


def get_api_data(url: str) -> Union[Dict, List]:
    """Gets data from API endpoint"""
    response = requests.get(url=url)
    if not response.ok:
        raise Exception(f"Error with response. Status code: {response.status_code}. URL: {url}")
    result = json.loads(response.text)
    return result


def get_paginated_api_data() -> List:
    """Gets data for all records of a resource by looping through the offset"""
    all_results = []
    offset = 1
    limit = 20
    while True:
        print(f"Offset: {offset}")
        url = f"http://localhost:8000/api/v1/cross-league-standings/?offset={offset}&limit={limit}"
        temp_result = get_api_data(url=url)
        all_results += temp_result
        offset += limit
        if len(temp_result) == 0:
            break
    return all_results


if __name__ == "__main__":
    results = get_paginated_api_data()
```