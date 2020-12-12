from typing import List
import pandas as pd
from . import config
from . import utils


def get_teams() -> List[str]:
    """Returns list of teams from `leagues_leaguematch` table"""
    sql = f"""
    SELECT home_team, away_team
    FROM {config.TBL_LEAGUES}
    """
    df = utils.sql_to_dataframe(sql=sql)
    if df.empty:
        return []
    teams_series = pd.concat(objs=[df['home_team'], df['away_team']]).sort_values(ascending=True)
    teams = teams_series.unique().tolist()
    return teams


def get_leagues() -> List[str]:
    """Returns list of league names from `leagues_leaguematch` table"""
    sql = f"""
    SELECT DISTINCT(league)
    FROM {config.TBL_LEAGUES}
    ORDER BY league ASC
    """
    df = utils.sql_to_dataframe(sql=sql)
    if df.empty:
        return []
    leagues = df['league'].tolist()
    return leagues


def get_seasons() -> List[str]:
    """Returns list of season names from `leagues_leaguematch` table"""
    sql = f"""
    SELECT DISTINCT(season)
    FROM {config.TBL_LEAGUES}
    ORDER BY season ASC
    """
    df = utils.sql_to_dataframe(sql=sql)
    if df.empty:
        return []
    seasons = df['season'].tolist()
    return seasons