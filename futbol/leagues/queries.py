from typing import Dict, List, Union
import datetime
import pandas as pd
import sqlite3

from futbol import config
from .utils import (
    date_to_season,
    get_unique_teams,
    prettify_date_string,
)


def _get_data_from_sqlite(query: str) -> Union[pd.DataFrame, pd.Series]:
    """Gets Pandas object (DataFrame or Series) from given query (via the SQLite database)"""
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    df = pd.read_sql(sql=query, con=connection)
    connection.close()
    return df


def get_cross_league_standings() -> pd.DataFrame:
    """Returns DataFrame of subset of columns of Cross League Standings data"""
    query = f"""
    SELECT position, team, league, games_played, avg_points, avg_goal_difference,
           win_percent, loss_percent, draw_percent, avg_goals_scored, avg_goals_allowed,
           clean_sheets_percent, big_win_percent, big_loss_percent,
           longest_win_streak, longest_loss_streak, longest_draw_streak, longest_unbeaten_streak
    FROM {config.TBL_CROSS_LEAGUE_STANDINGS}
    """
    df = _get_data_from_sqlite(query=query)
    return df


def get_num_unique_teams_by_league() -> Dict[str, int]:
    query = f"""
    SELECT team, league
    FROM {config.TBL_CROSS_LEAGUE_STANDINGS}
    """
    df = _get_data_from_sqlite(query=query)
    dict_num_unique_teams_by_league = df.groupby(by='league').apply(len).rename('num_unique_teams').to_frame().to_dict()['num_unique_teams']
    return dict_num_unique_teams_by_league


def get_goal_related_stats_by_league() -> Dict[str, Dict[str, Union[int, float]]]:
    """
    Returns dictionary having keys: ['avg_goals_scored', 'avg_goal_difference'].
    Values will be dictionary of the respective goal-related-stat (by league).
    """
    query = f"""
    SELECT league, home_goals, away_goals
    FROM {config.TBL_LEAGUE_MATCHES}
    """
    df = _get_data_from_sqlite(query=query)
    df['total_goals'] = df['home_goals'] + df['away_goals']
    df['goal_difference'] = (df['home_goals'] - df['away_goals']).abs()

    dict_obj = {}
    dict_avg_goals_scored = {}
    dict_avg_goal_difference = {}
    for league, df_by_league in df.groupby(by='league'):
        dict_avg_goals_scored[league] = round(df_by_league['total_goals'].mean(), 3)
        dict_avg_goal_difference[league] = round(df_by_league['goal_difference'].mean(), 3)
    dict_obj['avg_goals_scored'] = dict_avg_goals_scored
    dict_obj['avg_goal_difference'] = dict_avg_goal_difference
    return dict_obj


def get_current_season_league_leaders() -> Dict[str, str]:
    """Returns dictionary having keys = league names, and values = league leaders"""
    current_season = date_to_season(date=datetime.datetime.now())
    query = f"""
    SELECT team, league
    FROM {config.TBL_LEAGUE_STANDINGS}
    WHERE position = 1
    AND season = '{current_season}'
    """
    df = _get_data_from_sqlite(query=query)
    if df.empty:
        dict_with_nan = {
            'Bundesliga': 'NA',
            'EPL': 'NA',
            'La Liga': 'NA',
            'Ligue 1': 'NA',
            'Serie A': 'NA',
        }
        return dict_with_nan
    return df.set_index('league').to_dict()['team']


def get_league_matches_count() -> int:
    query = f"""
    SELECT COUNT(*) AS num_league_matches_in_db
    FROM {config.TBL_LEAGUE_MATCHES}
    """
    df = _get_data_from_sqlite(query=query)
    if df.empty:
        return 0
    return df['num_league_matches_in_db'].iloc[0]


def get_date_limits_of_league_matches() -> Dict[str, str]:
    """Returns dictionary having keys: ['first_available_date', 'last_available_date']"""
    query = f"""
    SELECT MIN(date) AS first_available_date,
           MAX(date) AS last_available_date
    FROM {config.TBL_LEAGUE_MATCHES}
    """
    df = _get_data_from_sqlite(query=query)
    if df.empty:
        dict_with_nan = {
            'first_available_date': 'NA',
            'last_available_date': 'NA',
        }
        return dict_with_nan
    dict_obj = df.iloc[0].to_dict()
    dict_obj['first_available_date'] = prettify_date_string(date_string=dict_obj['first_available_date'])
    dict_obj['last_available_date'] = prettify_date_string(date_string=dict_obj['last_available_date'])
    return dict_obj


def get_teams_by_league() -> Dict[str, List[str]]:
    """Returns dictionary having keys = league names, and values = list of teams for the respective league"""
    query = f"""
    SELECT team, league
    FROM {config.TBL_CROSS_LEAGUE_STANDINGS}
    """
    df = _get_data_from_sqlite(query=query)
    if df.empty:
        dict_obj = {
            'Bundesliga': [],
            'EPL': [],
            'La Liga': [],
            'Ligue 1': [],
            'Serie A': [],
        }
        return dict_obj
    
    dict_teams_by_league = {}
    for league, df_by_league in df.groupby(by='league'):
        dict_teams_by_league[league] = df_by_league['team'].sort_values(ascending=True).unique().tolist()
    return dict_teams_by_league


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