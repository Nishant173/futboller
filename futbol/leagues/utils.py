from typing import List
import pandas as pd


def get_unique_teams(data: pd.DataFrame) -> List[str]:
    """
    Gets list of all unique teams present in DataFrame.
    Expects DataFrame having `LeagueMatch` data.
    """
    teams_series = pd.concat(objs=[data['home_team'], data['away_team']]).sort_values(ascending=True)
    unique_teams = teams_series.unique().tolist()
    return unique_teams


def get_teams_from_matchup(matchup: str) -> List[str]:
    """Gets list of teams from `matchup` string, which can contain two teams i.e; 'Arsenal,Chelsea'"""
    teams = str(matchup).split(',')
    return teams