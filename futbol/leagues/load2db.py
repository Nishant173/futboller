import pandas as pd
import sqlite3

from futbol import config
from py_utils.data_analysis.transform import switch_column_casing
from py_utils.general.casing import ucc2sc
from py_utils.general.decorators import timer
from .cross_league_standings import get_cross_league_standings
from .league_standings import get_historical_league_standings
from .goal_related_stats import get_goal_related_stats


@timer
def league_matches_to_db(filepath: str) -> None:
    """
    Loads CSV file containing `LeagueMatch` dataset to the database.
    Note: This function APPENDS to the database. Multiple function calls will create duplicates.
    """
    df = pd.read_csv(filepath)
    df = switch_column_casing(data=df, func=ucc2sc)
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    df.to_sql(name=config.TBL_LEAGUE_MATCHES, con=connection, if_exists='append', index=False)
    connection.close()
    return None


@timer
def league_standings_to_db() -> None:
    """
    Loads `LeagueStandings` dataset (historical league standings data) to the database.
    Note: This function APPENDS to the database. Multiple function calls will create duplicates.
    """
    data = get_historical_league_standings()
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    data.to_sql(name=config.TBL_LEAGUE_STANDINGS, con=connection, if_exists='append', index=False)
    connection.close()
    return None


@timer
def cross_league_standings_to_db() -> None:
    """
    Loads `CrossLeagueStandings` dataset (cross league standings data) to the database.
    Note: This function APPENDS to the database. Multiple function calls will create duplicates.
    """
    data = get_cross_league_standings()
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    data.to_sql(name=config.TBL_CROSS_LEAGUE_STANDINGS, con=connection, if_exists='append', index=False)
    connection.close()
    return None


@timer
def goal_related_stats_to_db() -> None:
    """
    Loads `GoalRelatedStats` dataset (goal-related-stats data) to the database.
    Note: This function APPENDS to the database. Multiple function calls will create duplicates.
    """
    data = get_goal_related_stats()
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    data.to_sql(name=config.TBL_GOAL_RELATED_STATS, con=connection, if_exists='append', index=False)
    connection.close()
    return None