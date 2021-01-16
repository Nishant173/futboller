'''
# Run the below code from Django shell via `python manage.py shell` (open in appropriate directory)
from leagues.load2db import (league_matches_to_db,
                             league_standings_to_db,
                             cross_league_standings_to_db)
from leagues.models import LeagueMatch, LeagueStandings, CrossLeagueStandings
from py_utils.data_analysis.explore import is_full
from py_utils.django_utils.utils import queryset_to_dataframe, queryset_to_list

league_matches_to_db(filepath="../data/Top5LeaguesData.csv")
league_standings_to_db()
cross_league_standings_to_db()

qs_matches = LeagueMatch.objects.all()
qs_standings = LeagueStandings.objects.all()
qs_cls = CrossLeagueStandings.objects.all()

df_matches = queryset_to_dataframe(qs=qs_matches, drop_id=True)
df_standings = queryset_to_list(qs=qs_standings, drop_id=True)
df_cls = queryset_to_list(qs=qs_cls, drop_id=True)

# To check if the DataFrame is filled with values (there should not be any missing values)
is_full(data=df_matches)
is_full(data=df_standings)
is_full(data=df_cls)
'''

import pandas as pd
import sqlite3

from futbol import config
from py_utils.data_analysis.transform import switch_column_casing
from py_utils.general.casing import ucc2sc
from py_utils.general.decorators import timer
from .cross_league_standings import get_cross_league_standings
from .league_standings import get_historical_league_standings


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