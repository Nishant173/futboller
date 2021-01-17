from typing import List, Optional, Union
import pandas as pd

from py_utils.data_analysis.transform import dataframe_to_list
# pd.set_option('mode.chained_assignment', None)


def filter_teams_by_icontains(teams: Union[List[str], List],
                              name_contains: str) -> Union[List[str], List]:
    """Filters list of teams based on case-insensitive search"""
    data = pd.DataFrame(data={'team': teams})
    data = data.loc[(data['team'].str.lower().str.contains(name_contains.lower())), :]
    teams_filtered = data['team'].tolist()
    return teams_filtered


def filter_by_team(data: pd.DataFrame,
                   team: str) -> pd.DataFrame:
    """Filters DataFrame having `LeagueMatch` data (by team playing)"""
    team_is_playing = (data['home_team'] == team) | (data['away_team'] == team)
    data_by_team = data.loc[(team_is_playing), :]
    return data_by_team


def filter_by_matchup(data: pd.DataFrame,
                      teams: List[str]) -> pd.DataFrame:
    """Filters DataFrame having `LeagueMatch` data (by matchup between given team combo i.e; list of two teams)"""
    if data.empty:
        return data
    if len(teams) != 2:
        raise ValueError(f"Matchup can only be between 2 teams. Not {len(teams)}")
    team1, team2 = teams
    team1_vs_team2 = ((data['home_team'] == team1) & (data['away_team'] == team2))
    team2_vs_team1 = ((data['home_team'] == team2) & (data['away_team'] == team1))
    data_by_matchup = data.loc[(team1_vs_team2 | team2_vs_team1), :]
    return data_by_matchup


def filter_by_result(data: pd.DataFrame,
                     team: str,
                     result: str) -> pd.DataFrame:
    """
    Filters DataFrame having `LeagueMatch` data (based on result obtained by the team)
    Options for `result`: ['win', 'loss', 'draw']
    """
    if result not in ['win', 'loss', 'draw']:
        raise ValueError(f"Expected one of ['win', 'loss', 'draw'] for `result`, but got {result}")
    df_by_team = filter_by_team(data=data, team=team)
    if result == 'win':
        home_win = ((df_by_team['home_team'] == team) & (df_by_team['home_goals'] > df_by_team['away_goals']))
        away_win = ((df_by_team['away_team'] == team) & (df_by_team['away_goals'] > df_by_team['home_goals']))
        df_by_team = df_by_team.loc[(home_win | away_win), :]
    elif result == 'loss':
        home_loss = ((df_by_team['home_team'] == team) & (df_by_team['home_goals'] < df_by_team['away_goals']))
        away_loss = ((df_by_team['away_team'] == team) & (df_by_team['away_goals'] < df_by_team['home_goals']))
        df_by_team = df_by_team.loc[(home_loss | away_loss), :]
    elif result == 'draw':
        df_by_team = df_by_team.loc[(df_by_team['home_goals'] == df_by_team['away_goals']), :]
    return df_by_team


def filter_by_goal_difference(data: pd.DataFrame,
                              gd: Optional[int] = None,
                              min_gd: Optional[int] = None,
                              max_gd: Optional[int] = None) -> pd.DataFrame:
    """Filters DataFrame having `LeagueMatch` data (based on goal difference parameters)"""
    df_filtered = data.copy(deep=True)
    df_filtered['gd'] = (df_filtered['home_goals'] - df_filtered['away_goals']).abs()
    matches = dataframe_to_list(data=df_filtered)
    if gd:
        matches = list(filter(lambda obj: obj['gd'] == gd, matches))
    if min_gd:
        matches = list(filter(lambda obj: obj['gd'] >= min_gd, matches))
    if max_gd:
        matches = list(filter(lambda obj: obj['gd'] <= max_gd, matches))
    df_filtered = pd.DataFrame(data=matches)
    if not df_filtered.empty:
        df_filtered.drop(labels=['gd'], axis=1, inplace=True)
    return df_filtered


def filter_league_matches(data: pd.DataFrame,
                          team: Optional[str] = None,
                          league: Optional[str] = None,
                          season: Optional[str] = None,
                          gd: Optional[int] = None,
                          min_gd: Optional[int] = None,
                          max_gd: Optional[int] = None,
                          matchup: Optional[str] = None,
                          winning_team: Optional[str] = None,
                          losing_team: Optional[str] = None) -> pd.DataFrame:
    """Filters DataFrame having `LeagueMatch` data (based on certain parameters)"""
    if data.empty:
        return data
    df_filtered = data.copy(deep=True)
    if team:
        df_filtered = filter_by_team(data=df_filtered, team=team)
    if league:
        df_filtered = df_filtered.loc[(df_filtered['league'] == league), :]
    if season:
        df_filtered = df_filtered.loc[(df_filtered['season'] == season), :]
    if gd or min_gd or max_gd:
        df_filtered = filter_by_goal_difference(data=df_filtered,
                                                gd=gd,
                                                min_gd=min_gd,
                                                max_gd=max_gd)
    if matchup:
        teams = str(matchup).strip().split(',') # `matchup` can contain "Arsenal,Chelsea"
        df_filtered = filter_by_matchup(data=df_filtered, teams=teams)
    if winning_team:
        df_filtered = filter_by_result(data=df_filtered, team=winning_team, result='win')
    if losing_team:
        df_filtered = filter_by_result(data=df_filtered, team=losing_team, result='loss')
    return df_filtered