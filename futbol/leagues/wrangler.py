from typing import List
import numpy as np
import pandas as pd

from . import filters
from .league_standings import (get_win_count,
                               get_loss_count,
                               get_draw_count,
                               get_goals_scored,
                               get_goals_allowed,
                               get_clean_sheet_count,
                               get_clean_sheets_against_count,
                               get_rout_count,
                               get_capitulation_count,
                               get_results_string,
                               get_longest_streak)
from py_utils.data_analysis.transform import (
    add_partitioning_column,
    round_off_columns,
)


def get_h2h_stats(data: pd.DataFrame,
                  teams: List[str]) -> pd.DataFrame:
    """
    Takes DataFrame having `LeagueMatch` data, and calculates H2H stats between given two teams.
    Either returns DataFrame having following columns: `[
        'team', 'games_played', 'points', 'wins', 'draws', 'goals_scored',
        'clean_sheets', 'routs', 'results_string', 'longest_win_streak',
        'longest_winless_streak', 'longest_unbeaten_streak'
    ]` or an empty DataFrame (if no H2H matchups exist for given two teams)
    """
    df_h2h_stats = pd.DataFrame()
    df_by_matchup = data.copy(deep=True)
    df_by_matchup.sort_values(by='date', ascending=True, inplace=True, ignore_index=True)
    df_by_matchup = filters.filter_by_matchup(data=df_by_matchup, teams=teams)
    if df_by_matchup.empty:
        return pd.DataFrame()
    dict_results_string = get_results_string(data=df_by_matchup)
    games_played = len(df_by_matchup)
    for team in teams:
        results_string = dict_results_string[team]
        wins = get_win_count(data=df_by_matchup, team=team)
        draws = get_draw_count(data=df_by_matchup, team=team)
        goals_scored = get_goals_scored(data=df_by_matchup, team=team)
        clean_sheets = get_clean_sheet_count(data=df_by_matchup, team=team)
        routs = get_rout_count(data=df_by_matchup, team=team, goal_margin=3)
        df_temp = pd.DataFrame(data={
            'team': team,
            'games_played': games_played,
            'points': 3 * wins + draws,
            'wins': wins,
            'draws': draws,
            'goals_scored': goals_scored,
            'clean_sheets': clean_sheets,
            'routs': routs,
            'results_string': results_string,
            'longest_win_streak': get_longest_streak(results_string=results_string, by=['W']),
            'longest_winless_streak': get_longest_streak(results_string=results_string, by=['D', 'L']),
            'longest_unbeaten_streak': get_longest_streak(results_string=results_string, by=['W', 'D']),
        }, index=[0])
        df_h2h_stats = pd.concat(objs=[df_h2h_stats, df_temp], ignore_index=True, sort=False)
    return df_h2h_stats


def _get_absolute_partitioned_stats(data_by_team: pd.DataFrame,
                                    team: str) -> pd.DataFrame:
    """
    Helper function that calculates absolute partitioned stats by team.
    Returns DataFrame wherein each row has stats of one partition of team's matches.
    """
    df = data_by_team.copy(deep=True)
    df['date'] = pd.to_datetime(arg=df['date'], format="%Y-%m-%d")
    df.sort_values(by='date', ascending=True, ignore_index=True, inplace=True)
    num_unique_months = df['date'].dt.strftime("%Y-%m").nunique()
    df['date'] = df['date'].dt.strftime("%Y-%m-%d")
    df = add_partitioning_column(data=df,
                                 num_partitions=int(np.ceil(num_unique_months / 3)),
                                 column_name="partition_number")
    big_result_goal_margin = 3 # To decide BigWins / BigLosses
    df_partitioned_stats = pd.DataFrame(data={
        'team': team,
        'games_played': df.groupby(by="partition_number").apply(len),
        'start_date': df.groupby(by="partition_number").apply(lambda dfrm: dfrm['date'].iloc[0]),
        'end_date': df.groupby(by="partition_number").apply(lambda dfrm: dfrm['date'].iloc[-1]),
        'wins': df.groupby(by="partition_number").apply(
            func=get_win_count,
            team=team,
        ).rename("wins"),
        'losses': df.groupby(by="partition_number").apply(
            func=get_loss_count,
            team=team,
        ).rename("losses"),
        'draws': df.groupby(by="partition_number").apply(
            func=get_draw_count,
            team=team,
        ).rename("draws"),
        'goals_scored': df.groupby(by="partition_number").apply(
            func=get_goals_scored,
            team=team,
        ).rename("goals_scored"),
        'goals_allowed': df.groupby(by="partition_number").apply(
            func=get_goals_allowed,
            team=team,
        ).rename("goals_allowed"),
        'clean_sheets': df.groupby(by="partition_number").apply(
            func=get_clean_sheet_count,
            team=team,
        ).rename("clean_sheets"),
        'clean_sheets_against': df.groupby(by="partition_number").apply(
            func=get_clean_sheets_against_count,
            team=team,
        ).rename("clean_sheets_against"),
        'big_wins': df.groupby(by="partition_number").apply(
            func=get_rout_count,
            team=team,
            goal_margin=big_result_goal_margin,
        ).rename("big_wins"),
        'big_losses': df.groupby(by="partition_number").apply(
            func=get_capitulation_count,
            team=team,
            goal_margin=big_result_goal_margin,
        ).rename("big_losses"),
    }).reset_index()
    df_partitioned_stats['points'] = 3 * df_partitioned_stats['wins'] + df_partitioned_stats['draws']
    df_partitioned_stats['goal_difference'] = df_partitioned_stats['goals_scored'] - df_partitioned_stats['goals_allowed']
    return df_partitioned_stats


def _get_normalized_partitioned_stats(data: pd.DataFrame) -> pd.DataFrame:
    """Helper function that normalizes certain columns from the absolute partitioned stats"""
    df = data.copy(deep=True)
    df['win_percent'] = df['wins'] * 100 / df['games_played']
    df['loss_percent'] = df['losses'] * 100 / df['games_played']
    df['draw_percent'] = df['draws'] * 100 / df['games_played']
    df['clean_sheets_percent'] = df['clean_sheets'] * 100 / df['games_played']
    df['clean_sheets_against_percent'] = df['clean_sheets_against'] * 100 / df['games_played']
    df['big_wins_percent'] = df['big_wins'] * 100 / df['games_played']
    df['big_losses_percent'] = df['big_losses'] * 100 / df['games_played']
    df['avg_goals_scored'] = df['goals_scored'] / df['games_played']
    df['avg_goals_allowed'] = df['goals_allowed'] / df['games_played']
    df['avg_goal_difference'] = df['goal_difference'] / df['games_played']
    df['avg_points'] = df['points'] / df['games_played']
    df.drop(labels=[
                'wins', 'losses', 'draws', 'big_wins', 'big_losses', 'clean_sheets', 'clean_sheets_against',
                'goals_scored', 'goals_allowed', 'points', 'goal_difference',
            ],
            axis=1,
            inplace=True)
    df = round_off_columns(data=df,
                           columns=[
                               'win_percent', 'loss_percent', 'draw_percent', 'clean_sheets_percent',
                               'clean_sheets_against_percent', 'big_wins_percent', 'big_losses_percent',
                           ],
                           round_by=2)
    df = round_off_columns(data=df,
                           columns=['avg_goals_scored', 'avg_goals_allowed', 'avg_goal_difference', 'avg_points'],
                           round_by=4)
    return df


def get_partitioned_stats(data: pd.DataFrame,
                          team: str) -> pd.DataFrame:
    """
    Takes DataFrame having `LeagueMatch` data.
    Returns DataFrame having normalized partitioned stats (for the given team).
    """
    df_by_team = filters.filter_by_team(data=data, team=team)
    df_abs_partitioned_stats = _get_absolute_partitioned_stats(data_by_team=df_by_team, team=team)
    df_norm_partitioned_stats = _get_normalized_partitioned_stats(data=df_abs_partitioned_stats)
    return df_norm_partitioned_stats