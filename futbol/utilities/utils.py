from typing import Callable, Dict, List, Union
from django.db.models import QuerySet
import pandas as pd


def string_to_int_or_float(value: str) -> Union[int, float]:
    """Converts stringified number to either int or float"""
    value = float(value)
    if int(value) == value:
        value = int(value)
    return value


def stringify_list_of_nums(array: List[Union[int, float]]) -> str:
    """Converts list of ints/floats to comma separated string of the same"""
    return ",".join(list(map(str, array)))


def listify_string_of_nums(string: str) -> List[Union[int, float]]:
    """Converts string of comma separated ints/floats to list of numbers"""
    numbers = string.split(',')
    numbers = list(map(string_to_int_or_float, numbers))
    return numbers


def switch_column_casing(data: pd.DataFrame, func: Callable) -> pd.DataFrame:
    """
    Switch casing of columns in DataFrame (based on given casing function).
    Examples of custom casing functions:
        * snake-case to lower-camel-case
        * snake-case to upper-camel-case
        * lower-camel-case to snake-case
        * lower-camel-case to upper-camel-case
        * upper-camel-case to lower-camel-case
        * upper-camel-case to snake-case
    """
    columns = data.columns.tolist()
    data.columns = pd.Series(data=columns).apply(func=func)
    return data


def drop_id_column(data: pd.DataFrame) -> pd.DataFrame:
    """Drops the 'id' column from Pandas DataFrame"""
    data.drop(labels=['id'], axis=1, inplace=True)
    return data


def dataframe_to_list(data: pd.DataFrame) -> Union[List[Dict], List]:
    if data.empty:
        return []
    return data.to_dict(orient='records')


def queryset_to_dataframe(qs: QuerySet, drop_id: bool) -> pd.DataFrame:
    data = pd.DataFrame(data=list(qs.values()))
    if drop_id:
        data = drop_id_column(data=data)
    return data


def queryset_to_list(qs: QuerySet, drop_id: bool) -> Union[List[Dict], List]:
    data = queryset_to_dataframe(qs=qs, drop_id=drop_id)
    return dataframe_to_list(data=data)