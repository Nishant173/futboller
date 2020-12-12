from typing import List, Optional
import pandas as pd
# pd.set_option('mode.chained_assignment', None)


def filter_by_team(data: pd.DataFrame,
                   team: str) -> pd.DataFrame:
    team_is_playing = (data['home_team'] == team) | (data['away_team'] == team)
    data_by_team = data.loc[(team_is_playing), :]
    return data_by_team


def filter_by_matchup(data: pd.DataFrame,
                      teams: List[str]) -> pd.DataFrame:
    """Filters DataFrame by matchup b/w given team combo (list of two teams)"""
    if data.empty:
        return data
    if len(teams) != 2:
        raise ValueError(f"Matchup can only be between 2 teams. Not {len(teams)}")
    team1, team2 = teams
    team1_vs_team2 = ((data['home_team'] == team1) & (data['away_team'] == team2))
    team2_vs_team1 = ((data['home_team'] == team2) & (data['away_team'] == team1))
    data = data.loc[(team1_vs_team2 | team2_vs_team1), :]
    return data


def filter_by_result(data: pd.DataFrame,
                     team: str,
                     result: str) -> pd.DataFrame:
    """Gets records wherein `team` gets the given `result` ('win', 'loss', 'draw')"""
    if result not in ['win', 'loss', 'draw']:
        raise ValueError(f"Expected one of ['win', 'loss', 'draw'] for `result`, but got {result}")
    data = filter_by_team(data=data, team=team)
    if result == 'win':
        home_win = ((data['home_team'] == team) & (data['home_goals'] > data['away_goals']))
        away_win = ((data['away_team'] == team) & (data['away_goals'] > data['home_goals']))
        data = data.loc[(home_win | away_win), :]
    elif result == 'loss':
        home_loss = ((data['home_team'] == team) & (data['home_goals'] < data['away_goals']))
        away_loss = ((data['away_team'] == team) & (data['away_goals'] < data['home_goals']))
        data = data.loc[(home_loss | away_loss), :]
    elif result == 'draw':
        data = data.loc[(data['home_goals'] == data['away_goals']), :]
    return data


def filter_by_goal_difference_0(data: pd.DataFrame,
                                in_comparison: str) -> pd.DataFrame:
    """
    Handles edge cases where goal difference given is 0.
    If `in_comparison` in ['max', 'equal'], returns all records that are draws.
    If `in_comparison` in ['min'], returns all records.
    """
    if in_comparison in ['max', 'equal']:
        data = data.loc[(data['home_goals'] == data['away_goals']), :]
    return data


def filter_league_data(data: pd.DataFrame,
                       team: Optional[str] = None,
                       league: Optional[str] = None,
                       season: Optional[str] = None,
                       gd: Optional[int] = None,
                       min_gd: Optional[int] = None,
                       max_gd: Optional[int] = None,
                       matchup: Optional[str] = None,
                       winning_team: Optional[str] = None,
                       losing_team: Optional[str] = None) -> pd.DataFrame:
    if data.empty:
        return data
    data['gd'] = (data['home_goals'] - data['away_goals']).abs()
    if team:
        data = filter_by_team(data=data, team=team)
    if league:
        data = data.loc[(data['league'] == league), :]
    if season:
        data = data.loc[(data['season'] == season), :]
    if gd:
        data = data.loc[(data['gd'] == gd), :]
    if min_gd:
        data = data.loc[(data['gd'] >= min_gd), :]
    if max_gd:
        data = data.loc[(data['gd'] <= max_gd), :]
    if matchup:
        teams = str(matchup).strip().split(',') # `matchup` can contain "Arsenal,Chelsea"
        data = filter_by_matchup(data=data, teams=teams)
    if winning_team:
        data = filter_by_result(data=data, team=winning_team, result='win')
    if losing_team:
        data = filter_by_result(data=data, team=losing_team, result='loss')
    data.drop(labels=['gd'], axis=1, inplace=True)
    return data