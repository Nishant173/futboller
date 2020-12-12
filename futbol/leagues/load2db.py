import pandas as pd
import sqlite3
from api import casing, config


def league_matches_to_db(filepath: str) -> None:
    """
    Loads CSV file containing `LeagueMatch` dataset to the database.
    Note: This function APPENDS to the database. Multiple function calls will create duplicates.
    """
    df = pd.read_csv(filepath)
    df.columns = pd.Series(data=df.columns.tolist()).apply(casing.ucc2underscored)
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    df.to_sql(name=config.TBL_LEAGUES, con=connection, if_exists='append', index=False)
    connection.close()
    return None


'''
Run the below code from Django shell via `python manage.py shell` (open in appropriate directory)
>>> from leagues.load2db import league_matches_to_db
>>> league_matches_to_db(filepath="../data/Top5LeaguesData.csv")

To view the queryset
>>> from leagues.models import LeagueMatch
>>> LeagueMatch.objects.all()
'''