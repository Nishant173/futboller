from typing import Any, Callable, Dict, List, Optional, Union
from django.db.models import QuerySet
import numpy as np
import pandas as pd
import random


def get_timetaken_fstring(num_seconds: Union[int, float],
                          round_up: bool) -> str:
    """Returns formatted-string of time elapsed, given the number of seconds elapsed"""
    if round_up:
        num_seconds = int(np.ceil(num_seconds))
    if num_seconds < 60:
        secs = (int(num_seconds) if int(num_seconds) == num_seconds else round(num_seconds, 3))
        fstring_timetaken = f"{secs}secs"
    elif 60 < num_seconds < 3600:
        mins, secs = divmod(num_seconds, 60)
        mins = int(mins)
        secs = (int(secs) if int(secs) == secs else round(secs, 3))
        fstring_timetaken = f"{mins}mins {secs}secs"
    else:
        hrs, secs_remainder = divmod(num_seconds, 3600)
        mins, secs = divmod(secs_remainder, 60)
        hrs = int(hrs)
        mins = int(mins)
        secs = (int(secs) if int(secs) == secs else round(secs, 3))
        fstring_timetaken = f"{hrs}hrs {mins}mins {secs}secs"
    return fstring_timetaken


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


def round_off_columns(data: pd.DataFrame, mapper: Dict[str, int]):
    """
    Rounds off specified numerical (float) columns in DataFrame.
    >>> round_off_columns(data=data, mapper={
        'column1': 3,
        'column2': 4,
        'column3': 4,
    })
    """
    columns_available = data.columns.tolist()
    for column, round_by in mapper.items():
        if column in columns_available:
            data[column] = data[column].apply(round, args=[int(round_by)])
    return data


def drop_id_column(data: pd.DataFrame) -> pd.DataFrame:
    """Drops the 'id' column (if it exists) from Pandas DataFrame"""
    if 'id' in data.columns.tolist():
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


def spread_by_factor(array: List[Union[int, float]], factor: int) -> List[Union[int, float]]:
    """
    Spread out an array by given factor.
    >>> spread_by_factor(array=[4, 6, 7, 3], factor=3)
    >>> [4, 4, 4, 6, 6, 6, 7, 7, 7, 3, 3, 3]
    """
    array_after_spreading = []
    for idx, _ in enumerate(array):
        array_after_spreading += [array[idx]] * int(factor)
    return array_after_spreading


def spread_array(array: List[Union[int, float]], to: int) -> List[Union[int, float]]:
    """
    Definition:
        Spread out an array to particular length without distorting signal of the original data.
    Parameters:
        - array (list): List or list-like array data
        - to (int): Length of array to be spread into
    >>> spread_array(array=[2, 3, -7], to=14)
    >>> [2, 2, 2, 2, 3, 3, 3, 3, 3, -7, -7, -7, -7, -7]
    """
    initial_array_length = len(array)
    if initial_array_length >= to:
        return array
    array_after_spread = []
    spread_factor = to / initial_array_length
    # If length of array to spread into is divisible by length of initial array
    if int(spread_factor) == spread_factor:
        array_after_spread = spread_by_factor(array=array, factor=int(spread_factor))
        return array_after_spread
    # Perform necessary complete fill-ups of the array to spread into
    num_complete_fillups = int(np.floor(spread_factor))
    if num_complete_fillups > 0:
        array_after_spread = spread_by_factor(array=array, factor=num_complete_fillups)
    # Fill-up the remaining elements of `array_after_spread` randomly (to minimise distortion)
    while len(array_after_spread) != to:
        random_index = random.randint(0, len(array_after_spread)-1)
        random_element = array_after_spread[random_index]
        array_after_spread.insert(random_index+1, random_element)
    return array_after_spread


def filter_list_by_offset(list_obj: List[Any],
                          offset: Optional[int] = None,
                          limit: Optional[int] = None) -> List[Any]:
    """
    Filters list object based on `offset` and `limit`.
    Note:
        - Default offset is 1
        - Default limit is 25
        - Maximum limit is 25
    """
    default_offset = 1
    default_limit = 25
    max_limit = 25 # Value of `max_limit` must be >= `default_limit`
    if not offset:
        offset = default_offset
    if not limit:
        limit = default_limit
    if offset <= 0:
        offset = default_offset
    if limit <= 0:
        limit = default_limit
    if limit > max_limit:
        limit = max_limit
    list_obj_filtered = list_obj[offset - 1 : offset + limit - 1]
    return list_obj_filtered