from typing import Any, List
import datetime
import json
import os
import requests

import pandas as pd

import config


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


def date_to_season(date: datetime.datetime) -> str:
    """
    Converts date object into string that identifies the football-season associated to said date.
    Note: Doesn't take COVID-19 into consideration.
    """
    year, month = date.year, date.month
    if month >= 7:
        season = f"{year}-{str(year + 1)[2:]}"
    else:
        season = f"{year-1}-{str(year)[2:]}"
    return season


def get_extension(filepath: str) -> str:
    return os.path.splitext(filepath)[-1][1:]


def get_filepaths(src_dir: str,
                  extensions: List[str]) -> List[str]:
    """
    Gets list of all filepaths having particular extension/s from source directory.
    Note: The `src_dir` can be an r-string.
    >>> get_filepaths(src_dir="SOME_SRC_DIR", extensions=['csv', 'xlsx'])
    """
    extensions = [str(extension).strip().lower() for extension in extensions]
    filenames = os.listdir(src_dir)
    filenames = [filename for filename in filenames if get_extension(filename).lower() in extensions]
    filepaths = [os.path.join(src_dir, filename) for filename in filenames]
    return filepaths


def has_matching_column_names(df1: pd.DataFrame,
                              df2: pd.DataFrame) -> bool:
    cols1 = sorted(df1.columns.tolist())
    cols2 = sorted(df2.columns.tolist())
    return (cols1 == cols2)


def map_legacy_team_if_necessary(team: str) -> str:
    """
    Maps legacy team-name to Understat team-name.
    If the legacy team-name exists in the mapper dictionary, it returns the mapped Understat team-name;
    otherwise it returns the original legacy team-name itself.
    """
    return config.LEGACY_TO_UNDERSTAT_MAPPER.get(team, team)


def map_legacy_team_names_to_understat(data: pd.DataFrame) -> pd.DataFrame:
    """
    Takes in legacy LeagueMatch DataFrame, and maps it's team-names to Understat's team-names (for uniqueness)
    """
    df_altered = data.copy(deep=True)
    df_altered['HomeTeam'] = df_altered['HomeTeam'].apply(map_legacy_team_if_necessary)
    df_altered['AwayTeam'] = df_altered['AwayTeam'].apply(map_legacy_team_if_necessary)
    return df_altered