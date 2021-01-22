from typing import List
import os
import pandas as pd

import config
from metadata_generator import (get_num_teams_by_league_and_season,
                                get_num_matches_by_league_and_season,
                                get_num_unique_teams_by_league)
from utils import (get_filepaths,
                   has_matching_column_names,
                   map_legacy_team_names_to_understat)


def concatenate_legacy_data(filepaths: List[str]) -> pd.DataFrame:
    """
    Takes in list of filepaths to CSV files containing Top 5 leagues' match data.
    Returns Pandas DataFrame containing concatenated Top 5 leagues' match data.
    """
    df_concatenated = pd.DataFrame()
    for filepath in filepaths:
        league_and_season = os.path.basename(filepath).split('.')[0]
        league, season = league_and_season.split(' - ')
        df_temp = pd.read_csv(filepath)
        df_temp.rename(mapper={'HG': 'HomeGoals', 'AG': 'AwayGoals'}, axis=1, inplace=True)
        df_temp['League'] = league
        df_temp['Season'] = season
        df_temp['Country'] = df_temp['League'].map(arg=config.LEAGUE_TO_COUNTRY_MAPPER)
        df_temp['Date'] = pd.to_datetime(arg=df_temp['Date']).dt.strftime(date_format="%Y-%m-%d")
        columns = ['HomeTeam', 'AwayTeam', 'HomeGoals', 'AwayGoals', 'Season', 'Date', 'League', 'Country']
        df_temp = df_temp.loc[:, columns]
        df_concatenated = pd.concat(objs=[df_concatenated, df_temp], ignore_index=True, sort=False)
    df_concatenated.sort_values(by=['League', 'Date'], ascending=[True, True], inplace=True, ignore_index=True)
    return df_concatenated


def concatenate_understat_data(filepaths: List[str]) -> pd.DataFrame:
    """
    Takes in list of filepaths to CSV files containing Top 5 leagues' match data (from Understat).
    Returns Pandas DataFrame containing concatenated Top 5 leagues' match data.
    """
    df_understat = pd.DataFrame()
    for filepath in filepaths:
        df_temp = pd.read_csv(filepath)
        df_understat = pd.concat(objs=[df_understat, df_temp], ignore_index=True, sort=False)
    return df_understat


if __name__ == "__main__":
    # Legacy data (early seasons - starting from 2009-10)
    filepaths_legacy = get_filepaths(src_dir="raw_legacy", extensions=['csv'])
    df_legacy_league_matches = concatenate_legacy_data(filepaths=filepaths_legacy)
    df_legacy_league_matches.to_csv(path_or_buf="formatted_csv_datasets/Top5LeaguesLegacy.csv", index=False)

    # Understat data (data from 2019-20 season onwards)
    filepaths_understat = get_filepaths(src_dir="raw_understat", extensions=['csv'])
    df_understat_league_matches = concatenate_understat_data(filepaths=filepaths_understat)
    df_understat_league_matches.to_csv(path_or_buf="formatted_csv_datasets/Top5LeaguesUnderstat.csv", index=False)

    # Check if columns in Legacy and Understat match
    if not has_matching_column_names(df1=df_legacy_league_matches,
                                     df2=df_understat_league_matches):
        raise Exception(
            "There's a problem with data consistency. "
            "Legacy data file and Understat data file have different column names. "
        )
    
    # Legacy to Understat team-name mapping needs to be reviewed periodically (every season)
    df_legacy_league_matches = map_legacy_team_names_to_understat(data=df_legacy_league_matches)

    # Create new CSV file with Legacy + Understat data
    df_all = pd.concat(objs=[df_legacy_league_matches, df_understat_league_matches],
                       ignore_index=True,
                       sort=False)
    df_all.sort_values(by=['League', 'Date'],
                       ascending=[True, True],
                       ignore_index=True,
                       inplace=True)
    df_all.to_csv(path_or_buf="formatted_csv_datasets/Top5LeaguesDataAll.csv", index=False)

    # Save metadata
    df_num_teams_by_league_and_season = get_num_teams_by_league_and_season(data=df_all)
    df_num_teams_by_league_and_season.to_csv(
        path_or_buf="metadata/Top5LeaguesDataAll - NumTeamsByLeagueAndSeason.csv",
        index=False,
    )
    df_num_matches_by_league_and_season = get_num_matches_by_league_and_season(data=df_all)
    df_num_matches_by_league_and_season.to_csv(
        path_or_buf="metadata/Top5LeaguesDataAll - NumMatchesByLeagueAndSeason.csv",
        index=False,
    )
    df_num_unique_teams_by_league = get_num_unique_teams_by_league(data=df_all)
    df_num_unique_teams_by_league.to_csv(
        path_or_buf="metadata/Top5LeaguesDataAll - NumUniqueTeamsByLeague.csv",
        index=False,
    )
    print("Saved formatted CSV datasets as well as metadata about the same")