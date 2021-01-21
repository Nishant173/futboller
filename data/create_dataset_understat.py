# Creates dataset from raw data in the 'raw_understat' folder
# Note: Create dataset from legacy data first, and then concatenate it's output with understat data

import pandas as pd
from create_dataset_legacy import get_csv_filenames_in_folder


def has_matching_column_names(df1: pd.DataFrame,
                              df2: pd.DataFrame) -> bool:
    cols1 = sorted(df1.columns.tolist())
    cols2 = sorted(df2.columns.tolist())
    return (cols1 == cols2)


if __name__ == "__main__":
    df_legacy = pd.read_csv("Top5LeaguesData.csv")
    filenames = get_csv_filenames_in_folder(folder_path="raw_understat/")
    filepaths = [f"raw_understat/{filename}" for filename in filenames]
    df_understat = pd.DataFrame()
    for filepath in filepaths:
        df_temp = pd.read_csv(filepath)
        df_understat = pd.concat(objs=[df_understat, df_temp], ignore_index=True, sort=False)
    if not has_matching_column_names(df1=df_legacy, df2=df_understat):
        raise Exception("Legacy data file and Understat data file have different column names!")
    df_all = pd.concat(objs=[df_legacy, df_understat], ignore_index=True, sort=False)
    df_all.sort_values(by=['League', 'Date'], ascending=[True, True], ignore_index=True, inplace=True)
    # Create new CSV file with legacy + understat data
    df_all.to_csv(path_or_buf="Top5LeaguesDataAll.csv", index=False)