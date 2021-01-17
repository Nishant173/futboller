from typing import Dict, List
import numpy as np
import pandas as pd

from . import filters
from .models import LeagueMatch
from .utils import get_unique_teams
from py_utils.django_utils.utils import queryset_to_dataframe
from py_utils.general.utils import stringify_list_of_nums

pd.set_option('mode.chained_assignment', None)


def get_win_count(data: pd.DataFrame, team: str) -> int:
    """Get count of wins by team (Expects DataFrame having `LeagueMatch` data)"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_home_wins = data[team_is_home & (data['home_goals'] > data['away_goals'])]
    df_away_wins = data[team_is_away & (data['away_goals'] > data['home_goals'])]
    win_count = len(df_home_wins) + len(df_away_wins)
    return win_count


def get_loss_count(data: pd.DataFrame, team: str) -> int:
    """Get count of losses by team (Expects DataFrame having `LeagueMatch` data)"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_home_losses = data[team_is_home & (data['home_goals'] < data['away_goals'])]
    df_away_losses = data[team_is_away & (data['away_goals'] < data['home_goals'])]
    loss_count = len(df_home_losses) + len(df_away_losses)
    return loss_count


def get_draw_count(data: pd.DataFrame, team: str) -> int:
    """Get count of draws by team (Expects DataFrame having `LeagueMatch` data)"""
    team_is_playing = (data['home_team'] == team) | (data['away_team'] == team)
    is_drawn = (data['home_goals'] == data['away_goals'])
    data = data[team_is_playing & is_drawn]
    draw_count = len(data)
    return draw_count


def get_goals_scored(data: pd.DataFrame, team: str) -> int:
    """Get count of goals scored by team (Expects DataFrame having `LeagueMatch` data)"""
    home_goals = data[data['home_team'] == team]['home_goals'].sum()
    away_goals = data[data['away_team'] == team]['away_goals'].sum()
    goals_scored = home_goals + away_goals
    return goals_scored


def get_goals_allowed(data: pd.DataFrame, team: str) -> int:
    """Get count of goals allowed by team (Expects DataFrame having `LeagueMatch` data)"""
    home_goals_allowed = data[data['home_team'] == team]['away_goals'].sum()
    away_goals_allowed = data[data['away_team'] == team]['home_goals'].sum()
    goals_allowed = home_goals_allowed + away_goals_allowed
    return goals_allowed


def get_clean_sheet_count(data: pd.DataFrame, team: str) -> int:
    """Get count of clean sheets kept by team (Expects DataFrame having `LeagueMatch` data)"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_cs_away = data[team_is_away & (data['home_goals'] == 0)]
    df_cs_home = data[team_is_home & (data['away_goals'] == 0)]
    number_of_clean_sheets = len(df_cs_away) + len(df_cs_home)
    return number_of_clean_sheets


def get_clean_sheets_against_count(data: pd.DataFrame, team: str) -> int:
    """Get count of clean sheets kept against given team (Expects DataFrame having `LeagueMatch` data)"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_cs_against_away = data[team_is_away & (data['away_goals'] == 0)]
    df_cs_against_home = data[team_is_home & (data['home_goals'] == 0)]
    number_of_clean_sheets_against = len(df_cs_against_away) + len(df_cs_against_home)
    return number_of_clean_sheets_against


def get_rout_count(data: pd.DataFrame, team: str, goal_margin: int) -> int:
    """Get count of wins by team that are by margin >= `goal_margin` (Expects DataFrame having `LeagueMatch` data)"""
    data['goal_margin'] = (data['home_goals'] - data['away_goals']).abs()
    df_rout_subset = data[data['goal_margin'] >= goal_margin]
    team_is_home = (df_rout_subset['home_team'] == team)
    team_is_away = (df_rout_subset['away_team'] == team)
    df_rout_home = df_rout_subset[team_is_home & (df_rout_subset['home_goals'] > df_rout_subset['away_goals'])]
    df_rout_away = df_rout_subset[team_is_away & (df_rout_subset['away_goals'] > df_rout_subset['home_goals'])]
    total_routs = len(df_rout_home) + len(df_rout_away)
    return total_routs


def get_capitulation_count(data: pd.DataFrame, team: str, goal_margin: int) -> int:
    """Get count of losses by team that are by margin >= `goal_margin` (Expects DataFrame having `LeagueMatch` data)"""
    data['goal_margin'] = (data['home_goals'] - data['away_goals']).abs()
    df_capitulation_subset = data[data['goal_margin'] >= goal_margin]
    team_is_home = (df_capitulation_subset['home_team'] == team)
    team_is_away = (df_capitulation_subset['away_team'] == team)
    home_capitulation = (df_capitulation_subset['home_goals'] < df_capitulation_subset['away_goals'])
    away_capitulation = (df_capitulation_subset['away_goals'] < df_capitulation_subset['home_goals'])
    df_capitulation_home = df_capitulation_subset[team_is_home & home_capitulation]
    df_capitulation_away = df_capitulation_subset[team_is_away & away_capitulation]
    total_capitulations = len(df_capitulation_home) + len(df_capitulation_away)
    return total_capitulations


def get_results_string(data: pd.DataFrame) -> Dict[str, str]:
    """
    Gets results-string for games of all teams in DataFrame.
    Each results-string will be in ascending order of 'date' column.
    Expects DataFrame having `LeagueMatch` data.
    Returns dictionary having keys = team names, and values = results-string for said team.
    Example output: {
        "Bayern Munich": "WDLWDLLWWW",
        "Leipzig": "WDDWDWLWLD",
        "Leverkusen": "DLLWWWLLWW",
    }
    """
    dictionary_results = {}
    data.sort_values(by='date', ascending=True, inplace=True, ignore_index=True)
    teams = get_unique_teams(data=data)

    for team in teams:
        dictionary_results[team] = "" # Initialize with empty string
    
    for row in data.itertuples():
        home_team = row.home_team
        away_team = row.away_team
        home_goals = row.home_goals
        away_goals = row.away_goals
        if home_goals > away_goals:
            dictionary_results[home_team] += 'W'
            dictionary_results[away_team] += 'L'
        elif away_goals > home_goals:
            dictionary_results[home_team] += 'L'
            dictionary_results[away_team] += 'W'
        elif home_goals == away_goals:
            dictionary_results[home_team] += 'D'
            dictionary_results[away_team] += 'D'
    return dictionary_results


def get_cumulative_points(data: pd.DataFrame) -> Dict[str, List[int]]:
    """
    Gets cumulative points for games of all teams in DataFrame.
    Cumulative points will be in ascending order of 'date' column.
    Expects DataFrame having `LeagueMatch` data.
    Returns dictionary having keys = team names, and values = list of cumulative points for respective team.
    Example output: {
        "Bayern Munich": [0, 1, 1, 4, 7, 10, 11, 11, 14],
        "Leipzig": [0, 0, 1, 1, 4, 5, 5, 8, 9],
        "Leverkusen": [0, 3, 6, 9, 12, 13, 13, 13, 16],
    }
    """
    dict_cum_pts = {} # Cumulative points by team
    data.sort_values(by='date', ascending=True, inplace=True, ignore_index=True)
    teams = get_unique_teams(data=data)

    for team in teams:
        dict_cum_pts[team] = [0]
    
    for row in data.itertuples():
        home_team = row.home_team
        away_team = row.away_team
        home_goals = row.home_goals
        away_goals = row.away_goals
        latest_home_pts = dict_cum_pts[home_team][-1] # Gets value of latest cumulative points by team
        latest_away_pts = dict_cum_pts[away_team][-1]
        if home_goals > away_goals:
            dict_cum_pts[home_team].append(latest_home_pts + 3)
            dict_cum_pts[away_team].append(latest_away_pts + 0)
        elif away_goals > home_goals:
            dict_cum_pts[home_team].append(latest_home_pts + 0)
            dict_cum_pts[away_team].append(latest_away_pts + 3)
        elif home_goals == away_goals:
            dict_cum_pts[home_team].append(latest_home_pts + 1)
            dict_cum_pts[away_team].append(latest_away_pts + 1)
    return dict_cum_pts


def get_cumulative_goal_difference(data: pd.DataFrame) -> Dict[str, List[int]]:
    """
    Gets cumulative goal differences for games of all teams in DataFrame.
    Cumulative goal differences will be in ascending order of 'date' column.
    Expects DataFrame having `LeagueMatch` data.
    Returns dictionary having keys = team names, and values = list of cumulative goal differences for respective team.
    Example output: {
        "Bayern Munich": [-2, 1, 1, 0, 7, 8, 11, 11, 13],
        "Leipzig": [-2, -1, 1, 0, 4, 4, 6, 11, 12],
        "Leverkusen": [-4, 0, -1, 0, -3, 1, 4, 6, 6],
    }
    """
    dict_cum_gd = {} # Cumulative goal differences by team
    data.sort_values(by='date', ascending=True, inplace=True, ignore_index=True)
    teams = get_unique_teams(data=data)

    for team in teams:
        dict_cum_gd[team] = [0]
    
    for row in data.itertuples():
        home_team = row.home_team
        away_team = row.away_team
        home_goals = row.home_goals
        away_goals = row.away_goals
        gd_absolute = abs(home_goals - away_goals)
        latest_home_gd = dict_cum_gd[home_team][-1] # Gets value of latest cumulative goal differences by team
        latest_away_gd = dict_cum_gd[away_team][-1]
        if home_goals > away_goals:
            dict_cum_gd[home_team].append(latest_home_gd + gd_absolute)
            dict_cum_gd[away_team].append(latest_away_gd - gd_absolute)
        elif away_goals > home_goals:
            dict_cum_gd[home_team].append(latest_home_gd - gd_absolute)
            dict_cum_gd[away_team].append(latest_away_gd + gd_absolute)
        elif home_goals == away_goals:
            dict_cum_gd[home_team].append(latest_home_gd + 0)
            dict_cum_gd[away_team].append(latest_away_gd + 0)
    return dict_cum_gd


def get_longest_streak(results_string: str, by: List[str]) -> int:
    """
    Gets count of longest streak by particular result/s (from the `results_string`).
    >>> results_string = "WWWLLDDWLDDWLDDDLWWWWDWW"
    >>> get_longest_streak(results_string=results_string, by=['W']) # Longest win-streak
    >>> get_longest_streak(results_string=results_string, by=['L']) # Longest loss-streak
    >>> get_longest_streak(results_string=results_string, by=['D']) # Longest draw-streak
    >>> get_longest_streak(results_string=results_string, by=['W', 'D']) # Longest unbeaten-streak
    """
    for desired_result in by:
        if desired_result not in ['W', 'L', 'D']:
            raise ValueError(f"Expected `by` to be in ['W', 'L', 'D'], but got {by}")
    num_results = len(results_string)
    streak_counter = 0
    streaks = []
    for i in range(num_results):
        if results_string[i] in by:
            streak_counter += 1
        else:
            if streak_counter > 0:
                streaks.append(streak_counter)
            streak_counter = 0
        if i == num_results - 1: # For the last index in `results_string`
            streaks.append(streak_counter)
    longest_streak = max(streaks)
    return longest_streak


def add_ranking_column(data: pd.DataFrame,
                       rank_column_name: str,
                       rank_by: List[str],
                       ascending: List[bool]) -> pd.DataFrame:
    """Adds ranking column based on `rank_by` column/s to DataFrame"""
    if len(rank_by) != len(ascending):
        raise ValueError(
            "Expected `rank_by` and `ascending` to be of same length,"
            f" but got lengths {len(rank_by)} and {len(ascending)} respectively"
        )
    data.sort_values(by=rank_by, ascending=ascending, inplace=True, ignore_index=True)
    rankings = np.arange(start=1, stop=len(data) + 1, step=1)
    data[rank_column_name] = rankings
    column_order = [rank_column_name] + data.drop(labels=[rank_column_name], axis=1).columns.tolist()
    data = data.loc[:, column_order]
    return data


def get_league_standings(data: pd.DataFrame,
                         league: str,
                         season: str) -> pd.DataFrame:
    """
    Gets league standings from data of matches (for one particular league season).
    Expects DataFrame having `LeagueMatch` data.
    Columns expected in `data`: ['home_team', 'away_team', 'home_goals', 'away_goals',
                                 'date', 'season', 'league', 'country']
    Columns returned in League Standings: ['position', 'team', 'games_played', 'points', 'goal_difference',
                                           'wins', 'losses', 'draws', 'goals_scored', 'goals_allowed', 'clean_sheets',
                                           'clean_sheets_against', 'big_wins', 'big_losses', 'results_string',
                                           'cumulative_points', 'cumulative_goal_difference', 'longest_win_streak',
                                           'longest_loss_streak', 'longest_draw_streak', 'longest_unbeaten_streak',
                                           'league', 'season']
    """
    df_league_standings = pd.DataFrame()
    data = filters.filter_league_matches(data=data, league=league, season=season)
    dict_results_string = get_results_string(data=data)
    dict_cum_pts = get_cumulative_points(data=data)
    dict_cum_gd = get_cumulative_goal_difference(data=data)
    teams = get_unique_teams(data=data)
    for team in teams:
        df_by_team = filters.filter_by_team(data=data, team=team)
        games_played = len(df_by_team)
        wins = get_win_count(data=df_by_team, team=team)
        losses = get_loss_count(data=df_by_team, team=team)
        draws = get_draw_count(data=df_by_team, team=team)
        gs = get_goals_scored(data=df_by_team, team=team)
        ga = get_goals_allowed(data=df_by_team, team=team)
        cs = get_clean_sheet_count(data=df_by_team, team=team)
        csa = get_clean_sheets_against_count(data=df_by_team, team=team)
        routs = get_rout_count(data=df_by_team, team=team, goal_margin=3)
        capitulations = get_capitulation_count(data=df_by_team, team=team, goal_margin=3)
        df_temp = pd.DataFrame(data={
            'team': team,
            'games_played': games_played,
            'points': 3 * wins + draws,
            'goal_difference': gs - ga,
            'wins': wins,
            'losses': losses,
            'draws': draws,
            'goals_scored': gs,
            'goals_allowed': ga,
            'clean_sheets': cs,
            'clean_sheets_against': csa,
            'big_wins': routs,
            'big_losses': capitulations,
            'results_string': dict_results_string[team],
            'cumulative_points': stringify_list_of_nums(array=dict_cum_pts[team]),
            'cumulative_goal_difference': stringify_list_of_nums(array=dict_cum_gd[team]),
            'longest_win_streak': get_longest_streak(results_string=dict_results_string[team], by=['W']),
            'longest_loss_streak': get_longest_streak(results_string=dict_results_string[team], by=['L']),
            'longest_draw_streak': get_longest_streak(results_string=dict_results_string[team], by=['D']),
            'longest_unbeaten_streak': get_longest_streak(results_string=dict_results_string[team], by=['W', 'D']),
        }, index=[0])
        df_league_standings = pd.concat(objs=[df_league_standings, df_temp], ignore_index=True, sort=False)
    df_league_standings = add_ranking_column(data=df_league_standings,
                                             rank_column_name='position',
                                             rank_by=['points', 'goal_difference'],
                                             ascending=[False, False])
    df_league_standings['league'] = league
    df_league_standings['season'] = season
    return df_league_standings


def get_historical_league_standings() -> pd.DataFrame:
    """Gets league standings from data of matches (for all seasons and for all leagues)"""
    df_all_league_standings = pd.DataFrame()
    qs_matches = LeagueMatch.objects.all()
    data = queryset_to_dataframe(qs=qs_matches, drop_id=True)
    leagues = sorted(data['league'].unique().tolist())
    seasons = sorted(data['season'].unique().tolist())
    for league in leagues:
        for season in seasons:
            df_temp = get_league_standings(data=data, league=league, season=season)
            df_all_league_standings = pd.concat(objs=[df_all_league_standings, df_temp], ignore_index=True, sort=False)
    return df_all_league_standings