from typing import Dict, List, Union
from django.db.models import QuerySet
import pandas as pd
import sqlite3
from . import config


def get_games_played(data: pd.DataFrame) -> int:
    """Get count of games played"""
    return len(data)


def get_teams(data: pd.DataFrame) -> List[str]:
    """Returns list of all teams present in DataFrame"""
    teams_series = pd.concat(objs=[data['home_team'], data['away_team']]).sort_values(ascending=True)
    teams = teams_series.unique().tolist()
    return teams


def drop_id_column(data: pd.DataFrame) -> pd.DataFrame:
    """Drops the `id` column from Pandas DataFrame"""
    data.drop(labels=['id'], axis=1, inplace=True)
    return data


def sql_to_dataframe(sql: str) -> pd.DataFrame:
    """Takes in SQL query and returns DataFrame containing the queried data"""
    connection = sqlite3.connect(database=config.DB_FILEPATH)
    data = pd.read_sql(sql=sql, con=connection)
    connection.close()
    return data


def queryset_to_dataframe(qs: QuerySet, drop_id: bool) -> pd.DataFrame:
    data = pd.DataFrame(data=list(qs.values()))
    if drop_id:
        data = drop_id_column(data=data)
    return data


def queryset_to_list(qs: QuerySet, drop_id: bool) -> Union[List[Dict], List]:
    data = queryset_to_dataframe(qs=qs, drop_id=drop_id)
    return data.to_dict(orient='records')