from typing import List
import pandas as pd


def get_games_played(data: pd.DataFrame) -> int:
    """Get count of games played"""
    return len(data)


def get_unique_teams(data: pd.DataFrame) -> List[str]:
    """Returns list of all unique teams present in DataFrame having `LeagueMatch` data"""
    teams_series = pd.concat(objs=[data['home_team'], data['away_team']]).sort_values(ascending=True)
    unique_teams = teams_series.unique().tolist()
    return unique_teams