from typing import Callable, Dict, List, Optional, Union
import random

import pandas as pd


def dataframe_to_list(data: pd.DataFrame) -> Union[List[Dict], List]:
    if data.empty:
        return []
    return data.to_dict(orient='records')


def drop_columns_if_exists(data: pd.DataFrame,
                           columns: List[str]) -> pd.DataFrame:
    data_altered = data.copy(deep=True)
    columns_available = data_altered.columns.tolist()
    for column in columns:
        if column in columns_available:
            data_altered.drop(labels=[column], axis=1, inplace=True)
    return data_altered


def prettify_datetime_columns(data: pd.DataFrame,
                              columns: List[str],
                              include_time: bool) -> pd.DataFrame:
    """
    Takes in Pandas DataFrame and list of datetime columns, and
    converts the given datetime columns to a more human readable format.
    """
    df_altered = data.copy(deep=True)
    formatter = "%d %b, %Y"
    if include_time:
        formatter = "%d %b, %Y %I:%M %p"
    for column in columns:
        df_altered[column] = df_altered[column].dt.strftime(formatter)
    return df_altered


def switch_column_casing(data: pd.DataFrame,
                         func: Callable) -> pd.DataFrame:
    """
    Switch casing of columns in DataFrame (based on given casing function).
    Note: Expects all columns present in DataFrame to be of same casing (initially).
    Examples of custom casing functions:
        * snake-case to lower-camel-case (some_text --> someText)
        * snake-case to upper-camel-case (some_text --> SomeText)
        * lower-camel-case to snake-case (someText --> some_text)
        * lower-camel-case to upper-camel-case (someText --> SomeText)
        * upper-camel-case to lower-camel-case (SomeText --> someText)
        * upper-camel-case to snake-case (SomeText --> some_text)
    """
    data_altered = data.copy(deep=True)
    columns = data_altered.columns.tolist()
    data_altered.columns = list(map(func, columns))
    return data_altered


def round_off_columns(data: pd.DataFrame,
                      columns: List[str],
                      round_by: int) -> pd.DataFrame:
    """
    Rounds off specified numerical (float) columns in DataFrame.
    >>> round_off_columns(data=data, columns=['column1', 'column3', 'column5'], round_by=2)
    """
    data_altered = data.copy(deep=True)
    columns_available = data_altered.columns.tolist()
    for column in columns:
        if column in columns_available:
            data_altered[column] = data_altered[column].apply(round, args=[int(round_by)])
    return data_altered


def _randomly_replace_if_null_string(string: str,
                                     replacement_choices: Union[List[str], List]) -> str:
    if string.upper().strip() == 'NULL' and replacement_choices:
        return random.choice(replacement_choices)
    return string


def randomly_fill_categorical_nans(data: pd.DataFrame,
                                   subset: Optional[List[str]] = []) -> pd.DataFrame:
    """
    Fills missing values of categorical features by selecting random value from said feature.
    Parameters:
        - data (Pandas DataFrame): Pandas DataFrame of dataset
        - subset (list): Subset of categorical variables for which you want to randomly fill missing values (optional)
    """
    data_altered = data.copy(deep=True)
    categorical_variables = data_altered.select_dtypes(include='object').columns.tolist()
    if subset:
        categorical_variables = list(set(categorical_variables).intersection(set(subset)))
    for cv in categorical_variables:
        if data_altered[cv].isnull().sum() > 0:
            data_altered[cv].fillna(value='NULL', inplace=True)
            unique_choices = data_altered[cv].unique().tolist()
            unique_choices.remove('NULL')
            data_altered[cv] = data_altered[cv].apply(func=_randomly_replace_if_null_string,
                                                      replacement_choices=unique_choices)
    return data_altered