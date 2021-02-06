from typing import List, Union
import pandas as pd
import sqlite3

from futbol import config
from .utils import get_unique_teams


def _get_data_from_sqlite(query: str) -> Union[pd.DataFrame, pd.Series]:
    """Gets Pandas object (DataFrame or Series) from given query (via the SQLite database)"""
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    df = pd.read_sql(sql=query, con=connection)
    connection.close()
    return df


def get_teams() -> List[str]:
    """Returns list of teams from `leagues_leaguematch` table"""
    query = f"""
    SELECT home_team, away_team
    FROM {config.TBL_LEAGUE_MATCHES}
    """
    df = _get_data_from_sqlite(query=query)
    if df.empty:
        return []
    teams = get_unique_teams(data=df)
    return teams


def get_leagues() -> List[str]:
    """Returns list of league names from `leagues_leaguematch` table"""
    query = f"""
    SELECT DISTINCT(league)
    FROM {config.TBL_LEAGUE_MATCHES}
    ORDER BY league ASC
    """
    df = _get_data_from_sqlite(query=query)
    if df.empty:
        return []
    leagues = df['league'].tolist()
    return leagues


def get_seasons() -> List[str]:
    """Returns list of season names from `leagues_leaguematch` table"""
    query = f"""
    SELECT DISTINCT(season)
    FROM {config.TBL_LEAGUE_MATCHES}
    ORDER BY season ASC
    """
    df = _get_data_from_sqlite(query=query)
    if df.empty:
        return []
    seasons = df['season'].tolist()
    return seasons