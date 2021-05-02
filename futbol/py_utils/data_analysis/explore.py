from typing import Dict, List, Optional, Union

import pandas as pd


def is_full(data: pd.DataFrame) -> bool:
    """Returns True if there are no missing values in non-empty DataFrame"""
    is_not_empty = (not data.empty)
    has_no_missing_values = (data.isnull().sum().sum() == 0)
    return (is_not_empty & has_no_missing_values)


def get_column_availability_info(data: pd.DataFrame,
                                 expected_columns: List[Union[int, float, str]]) -> Dict[str, List[str]]:
    """
    Takes in non-empty DataFrame, and list of columns expected to be in said DataFrame.
    Returns dictionary having 2 keys: ['columns_available', 'columns_missing'], wherein the value for
    each key will be a list of columns that are available/missing.
    """
    if data.empty:
        raise ValueError("Expects non-empty DataFrame")
    all_columns = data.columns.tolist()
    expected_columns = list(expected_columns)
    columns_available = list(
        set(all_columns).intersection(set(expected_columns))
    )
    columns_missing = list(
        set(all_columns).difference(set(columns_available))
    )
    dict_obj = {
        'columns_available': columns_available,
        'columns_missing': columns_missing,
    }
    return dict_obj


def has_all_expected_columns(data: pd.DataFrame,
                             expected_columns: List[Union[int, float, str]]) -> bool:
    """Returns True if all expected columns are available in given DataFrame; otherwise returns False"""
    dict_column_availability_info = get_column_availability_info(
        data=data,
        expected_columns=expected_columns,
    )
    return len(dict_column_availability_info['columns_missing']) == 0


def describe_missing_data(data: pd.DataFrame,
                          keep_all_columns: Optional[bool] = True) -> pd.DataFrame:
    """Describes missing values (if any) present in given DataFrame"""
    columns = data.columns.tolist()
    num_missing_values = data.isnull().sum().values
    pct_missing_values = pd.Series(data=num_missing_values * 100 / len(data)).apply(round, args=[2])
    datatypes = data.dtypes.values
    df_missing_data_info = pd.DataFrame(data={
        'Column': columns,
        'NumMissingValues': num_missing_values,
        'PctMissingValues': pct_missing_values,
        'DataType': datatypes,
    })
    df_missing_data_info.sort_values(by=['PctMissingValues', 'Column'],
                                     ascending=[False, True],
                                     ignore_index=True,
                                     inplace=True)
    if not keep_all_columns:
        df_missing_data_info = df_missing_data_info[df_missing_data_info['PctMissingValues'] > 0]
    return df_missing_data_info