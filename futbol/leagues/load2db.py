'''
- Run the below code from Django shell via `python manage.py shell` (open in appropriate directory)
from leagues.load2db import (league_matches_to_db,
                             league_standings_to_db,
                             cross_league_standings_to_db)
league_matches_to_db(filepath="../data/Top5LeaguesData.csv")
league_standings_to_db()
cross_league_standings_to_db()

- To view the queryset/s
from leagues.models import LeagueMatch, LeagueStandings, CrossLeagueStandings
from utilities.utils import (queryset_to_dataframe, queryset_to_list)
qs_matches = LeagueMatch.objects.all()
qs_standings = LeagueStandings.objects.all()
qs_cross_standings = CrossLeagueStandings.objects.all()
queryset_to_dataframe(qs=qs, drop_id=True)
queryset_to_list(qs=qs, drop_id=True)
'''

import pandas as pd
import sqlite3
from .cross_league_standings import get_cross_league_standings
from .league_standings import get_historical_league_standings
from futbol import config
from utilities import casing, utils


def league_matches_to_db(filepath: str) -> None:
    """
    Loads CSV file containing `LeagueMatch` dataset to the database.
    Note: This function APPENDS to the database. Multiple function calls will create duplicates.
    """
    df = pd.read_csv(filepath)
    df = utils.switch_column_casing(data=df, func=casing.ucc2sc)
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    df.to_sql(name=config.TBL_LEAGUE_MATCHES, con=connection, if_exists='append', index=False)
    connection.close()
    return None


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