from typing import List, Union
import os
import datetime
import pandas as pd

# Constants
LEAGUE2COUNTRY = {
    'Bundesliga': 'Germany',
    'EPL': 'England',
    'La Liga': 'Spain',
    'Ligue 1': 'France',
    'Serie A': 'Italy',
}

NUM_TEAMS_PER_SEASON = {
    'Bundesliga': 18,
    'EPL': 20,
    'La Liga': 20,
    'Ligue 1': 20,
    'Serie A': 20,   
}

NUM_GAMES_PER_SEASON = {
    'Bundesliga': 306,
    'EPL': 380,
    'La Liga': 380,
    'Ligue 1': 380,
    'Serie A': 380,   
}

def get_csv_filenames_in_folder(folder_path: str) -> Union[List[str], List]:
    """Gets list of CSV files present in a folder"""
    filenames = os.listdir(path=folder_path)
    csv_filenames = [filename for filename in filenames if filename.split('.')[-1].strip().lower() == 'csv']
    return csv_filenames


def get_num_unique_teams(data: pd.DataFrame) -> int:
    return int(pd.concat(objs=[data['HomeTeam'], data['AwayTeam']]).nunique())


def get_num_teams_by_season(data: pd.DataFrame) -> pd.DataFrame:
    df_num_teams_by_season = data.groupby(by=['League', 'Season']).apply(get_num_unique_teams).reset_index()
    df_num_teams_by_season.rename(mapper={0: 'NumTeams'}, axis=1, inplace=True)
    return df_num_teams_by_season


def get_num_matches_by_season(data: pd.DataFrame) -> pd.DataFrame:
    df_num_matches_by_season = data.groupby(by=['League', 'Season']).apply(len).reset_index()
    df_num_matches_by_season.rename(mapper={0: 'NumMatches'}, axis=1, inplace=True)
    return df_num_matches_by_season


def date_to_season(date: datetime.datetime) -> str:
    """
    Converts date object into string that identifies the footballing season associated to said date.
    Note: Doesn't take COVID-19 into consideration.
    """
    year, month = date.year, date.month
    if month >= 7:
        season = f"{year}-{str(year + 1)[2:]}"
    else:
        season = f"{year-1}-{str(year)[2:]}"
    return season


def concatenate_football_data(filepaths: List[str]) -> pd.DataFrame:
    """
    Takes in list of filepaths to CSV files containing Top 5 leagues data.
    Returns Pandas DataFrame containing concatenated Top 5 leagues data.
    """
    df_concatenated = pd.DataFrame()
    for filepath in filepaths:
        league_and_season = os.path.basename(filepath).split('.')[0]
        league, season = league_and_season.split(' - ')
        df_temp = pd.read_csv(filepath)
        df_temp.rename(mapper={'HG': 'HomeGoals', 'AG': 'AwayGoals'}, axis=1, inplace=True)
        df_temp['League'] = league
        df_temp['Season'] = season
        df_temp['Country'] = df_temp['League'].map(arg=LEAGUE2COUNTRY)
        df_temp['Date'] = pd.to_datetime(arg=df_temp['Date']).dt.strftime('%Y-%m-%d')
        columns = ['HomeTeam', 'AwayTeam', 'HomeGoals', 'AwayGoals', 'Season', 'Date', 'League', 'Country']
        df_temp = df_temp.loc[:, columns]
        df_concatenated = pd.concat(objs=[df_concatenated, df_temp], ignore_index=True, sort=False)
    df_concatenated.sort_values(by=['League', 'Date'], ascending=[True, True], inplace=True, ignore_index=True)
    return df_concatenated


if __name__ == "__main__":
    # Creates CSV file having match data from top 5 leagues; along with 2 CSV files having metadata
    filenames = get_csv_filenames_in_folder(folder_path="raw/")
    filepaths = [f"raw/{filename}" for filename in filenames]
    data = concatenate_football_data(filepaths=filepaths)
    df_num_teams_by_season = get_num_teams_by_season(data=data)
    df_num_matches_by_season = get_num_matches_by_season(data=data)
    
    data.to_csv(path_or_buf="Top5LeaguesData.csv", index=False)
    df_num_teams_by_season.to_csv(path_or_buf="Top5LeaguesData-TeamsBySeason.csv", index=False)
    df_num_matches_by_season.to_csv(path_or_buf="Top5LeaguesData-MatchesBySeason.csv", index=False)