import pandas as pd


def get_num_unique_teams(data: pd.DataFrame) -> int:
    """Get number of unique teams from LeagueMatch DataFrame"""
    return int(pd.concat(objs=[data['HomeTeam'], data['AwayTeam']]).nunique())


def get_num_teams_by_league_and_season(data: pd.DataFrame) -> pd.DataFrame:
    df_by_league_and_season = data.groupby(by=['League', 'Season']).apply(get_num_unique_teams).reset_index()
    df_by_league_and_season.rename(mapper={0: 'NumTeams'}, axis=1, inplace=True)
    return df_by_league_and_season


def get_num_matches_by_league_and_season(data: pd.DataFrame) -> pd.DataFrame:
    df_by_league_and_season = data.groupby(by=['League', 'Season']).apply(len).reset_index()
    df_by_league_and_season.rename(mapper={0: 'NumMatches'}, axis=1, inplace=True)
    return df_by_league_and_season


def get_num_unique_teams_by_league(data: pd.DataFrame) -> pd.DataFrame:
    df_num_unique_teams_by_league = data.groupby(by=['League']).apply(get_num_unique_teams).reset_index()
    df_num_unique_teams_by_league.rename(mapper={0: 'NumUniqueTeams'}, axis=1, inplace=True)
    return df_num_unique_teams_by_league