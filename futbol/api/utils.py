from typing import Dict, List, Union
from django.db.models import QuerySet
import pandas as pd
import re
import sqlite3
from . import config


def cc2ucc(string: str) -> str:
    """Converts camel-case to upper-camel-case"""
    return string[0].upper() + string[1:]


def ucc2cc(string: str) -> str:
    """Converts upper-camel-case to camel-case"""
    return string[0].lower() + string[1:]


def ucc2underscored(string: str) -> str:
    """Converts upper-camel-case to underscore-separated (lower-case)"""
    words = re.findall(pattern="[A-Z][^A-Z]*", string=string)
    words = [word.lower() for word in words]
    return "_".join(words)


def cc2underscored(string: str) -> str:
    """Converts camel-case to underscore-separated (lower-case)"""
    string_ucc = cc2ucc(string=string)
    return ucc2underscored(string=string_ucc)


def underscored2ucc(string: str) -> str:
    """Converts underscore-separated (lower-case) to upper-camel-case"""
    words = string.split('_')
    words_capitalized = [word.strip().capitalize() for word in words]
    return "".join(words_capitalized)


def underscored2cc(string: str) -> str:
    """Converts underscore-separated (lower-case) to camel-case"""
    string_ucc = underscored2ucc(string=string)
    return ucc2cc(string=string_ucc)


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