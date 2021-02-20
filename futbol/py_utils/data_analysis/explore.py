from typing import Optional

import pandas as pd


def is_full(data: pd.DataFrame) -> bool:
    """Returns True if there are no missing values in non-empty DataFrame"""
    is_not_empty = (not data.empty)
    has_no_missing_values = (data.isnull().sum().sum() == 0)
    return (is_not_empty & has_no_missing_values)


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