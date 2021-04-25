from typing import Any, Dict, List, Union
import numpy as np
import pandas as pd

from futbol import config
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
from .utils import sort_by_date_string_column
from py_utils.data_analysis.transform import (
    add_partitioning_column,
    dataframe_to_list,
    round_off_columns,
)
from py_utils.general.utils import integerify_if_possible


GoalRelatedStatsOverTime = List[Dict[str, Union[int, float, str]]]


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
        routs = get_rout_count(data=df_by_matchup, team=team, goal_margin=config.BIG_RESULT_GOAL_MARGIN)
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


def _get_absolute_partitioned_stats(data: pd.DataFrame,
                                    team: str) -> pd.DataFrame:
    """
    Helper function that calculates absolute partitioned stats by team.
    Returns DataFrame wherein each row has stats of one partition of team's matches.
    """
    df = filters.filter_by_team(data=data, team=team)
    date_format = "%Y-%m-%d"
    df['date'] = pd.to_datetime(arg=df['date'], format=date_format)
    df.sort_values(by='date', ascending=True, ignore_index=True, inplace=True)
    num_unique_months = df['date'].dt.strftime("%Y-%m").nunique()
    df['date'] = df['date'].dt.strftime(date_format)
    df = add_partitioning_column(data=df,
                                 num_partitions=int(np.ceil(num_unique_months / 3)),
                                 column_name="partition_number")
    df_abs_partitioned_stats = pd.DataFrame(data={
        'team': team,
        'games_played': df.groupby(by="partition_number").apply(len),
        'start_date': df.groupby(by="partition_number").apply(lambda dframe: dframe['date'].iloc[0]),
        'end_date': df.groupby(by="partition_number").apply(lambda dframe: dframe['date'].iloc[-1]),
        'wins': df.groupby(by="partition_number").apply(get_win_count, team=team),
        'losses': df.groupby(by="partition_number").apply(get_loss_count, team=team),
        'draws': df.groupby(by="partition_number").apply(get_draw_count, team=team),
        'goals_scored': df.groupby(by="partition_number").apply(get_goals_scored, team=team),
        'goals_allowed': df.groupby(by="partition_number").apply(get_goals_allowed, team=team),
        'clean_sheets': df.groupby(by="partition_number").apply(get_clean_sheet_count, team=team),
        'clean_sheets_against': df.groupby(by="partition_number").apply(get_clean_sheets_against_count, team=team),
        'big_wins': df.groupby(by="partition_number").apply(get_rout_count, team=team, goal_margin=config.BIG_RESULT_GOAL_MARGIN),
        'big_losses': df.groupby(by="partition_number").apply(get_capitulation_count, team=team, goal_margin=config.BIG_RESULT_GOAL_MARGIN),
    }).reset_index()
    df_abs_partitioned_stats['points'] = 3 * df_abs_partitioned_stats['wins'] + df_abs_partitioned_stats['draws']
    df_abs_partitioned_stats['goal_difference'] = df_abs_partitioned_stats['goals_scored'] - df_abs_partitioned_stats['goals_allowed']
    return df_abs_partitioned_stats


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
                          team: str,
                          normalize: bool) -> pd.DataFrame:
    """
    Takes DataFrame having `LeagueMatch` data.
    Returns DataFrame having partitioned stats (either absolute or normalized) for the given team.
    """
    df_partitioned_stats = _get_absolute_partitioned_stats(data=data, team=team)
    if normalize:
        df_partitioned_stats = _get_normalized_partitioned_stats(data=df_partitioned_stats)
    return df_partitioned_stats


def _get_goal_differences(data: pd.DataFrame, team: str):
    """
    Takes in `LeagueMatch` data of one team, along with name of said team.
    Returns list of goal differences from point-of-view of the given team.
    """
    df = data.copy(deep=True)
    list_gds = []
    for row in df.itertuples():
        if row.home_team == team:
            list_gds.append(row.home_goals - row.away_goals)
        elif row.away_team == team:
            list_gds.append(row.away_goals - row.home_goals)
    return list_gds


def _get_result_from_goal_difference(goal_difference: int) -> str:
    if goal_difference > 0:
        return 'W'
    if goal_difference < 0:
        return 'L'
    return 'D'


def get_results_timeline(data: pd.DataFrame, team: str) -> pd.DataFrame:
    """
    Takes in `LeagueMatch` data of one team.
    Returns DataFrame having results timeline for given team.
    """
    df = data.copy(deep=True)
    if df.empty:
        return pd.DataFrame()
    gds = _get_goal_differences(data=df, team=team)
    results = list(map(_get_result_from_goal_difference, gds))
    df_results_timeline = pd.DataFrame(data={
        'team_of_interest': team,
        'league': df['league'].iloc[0],
        'home_team': df['home_team'],
        'away_team': df['away_team'],
        'home_goals': df['home_goals'],
        'away_goals': df['away_goals'],
        'goal_difference': gds,
        'result': results,
        'date': df['date'],
    })
    df_results_timeline = sort_by_date_string_column(
        data=df_results_timeline,
        date_string_column="date",
        date_format="%Y-%m-%d",
        ascending=True,
    )
    return df_results_timeline


def _get_best_performers_by_league(data: pd.DataFrame, league: str) -> pd.DataFrame:
    df = data.copy(deep=True)
    df = df[df['league'] == league]
    df['avg_goals_scored'] = (df['goals_scored'] / df['games_played']).apply(round, args=[3])
    df['avg_goals_allowed'] = (df['goals_allowed'] / df['games_played']).apply(round, args=[3])
    df['clean_sheet_percent'] = (df['clean_sheets'] * 100 / df['games_played']).apply(round, args=[2])
    df['big_win_percent'] = (df['big_wins'] * 100 / df['games_played']).apply(round, args=[2])
    best_gspg = df['avg_goals_scored'].max()
    best_gapg = df['avg_goals_allowed'].min()
    best_cs_pct = df['clean_sheet_percent'].max()
    best_big_win_percent = df['big_win_percent'].max()
    df_best_attack = df[df['avg_goals_scored'] == best_gspg]
    df_best_defence = df[df['avg_goals_allowed'] == best_gapg]
    df_best_clean_sheet_pct = df[df['clean_sheet_percent'] == best_cs_pct]
    df_best_big_win_percent = df[df['big_win_percent'] == best_big_win_percent]
    df_best_performers_by_league = pd.DataFrame(data={
        'league': league,
        'teams': [
            df_best_attack['team'].tolist(),
            df_best_defence['team'].tolist(),
            df_best_clean_sheet_pct['team'].tolist(),
            df_best_big_win_percent['team'].tolist(),
        ],
        'stat_name': [
            'bestAvgGoalsScored',
            'bestAvgGoalsAllowed',
            'bestCleanSheetPercent',
            'bestBigWinPercent',
        ],
        'stat_reading': [
            integerify_if_possible(number=best_gspg),
            integerify_if_possible(number=best_gapg),
            integerify_if_possible(number=best_cs_pct),
            integerify_if_possible(number=best_big_win_percent),
        ],
    })
    return df_best_performers_by_league


def get_best_performers(data: pd.DataFrame, season: str) -> pd.DataFrame:
    """
    Takes in DataFrame of league standings for one season (for all leagues).
    Returns DataFrame having the best performers for given season (for all leagues).
    Columns returned: ['league', 'teams', 'stat_name', 'stat_reading']
    """
    df = data.copy(deep=True)
    df = df[df['season'] == season]
    df_best_perf = pd.DataFrame()
    for league, df_by_league in df.groupby(by='league'):
        df_best_perf_by_league = _get_best_performers_by_league(
            data=df_by_league,
            league=league,
        )
        df_best_perf = pd.concat(objs=[df_best_perf, df_best_perf_by_league], ignore_index=True, sort=False)
    return df_best_perf


def reformat_best_performers(data: pd.DataFrame) -> Any:
    """
    Takes DataFrame having the best performers for one season (for all leagues), and re-formats it (by league).
    Returns nested dictionary object.
    """
    dict_best_performers = {}
    for league, df_temp in data.groupby(by='league'):
        dict_best_performers[league] = {
            'bestAvgGoalsScored': {
                'teams': df_temp[df_temp['stat_name'] == 'bestAvgGoalsScored']['teams'],
                'reading': df_temp[df_temp['stat_name'] == 'bestAvgGoalsScored']['stat_reading'].iloc[0],
            },
            'bestAvgGoalsAllowed': {
                'teams': df_temp[df_temp['stat_name'] == 'bestAvgGoalsAllowed']['teams'],
                'reading': df_temp[df_temp['stat_name'] == 'bestAvgGoalsAllowed']['stat_reading'].iloc[0],
            },
            'bestCleanSheetPercent': {
                'teams': df_temp[df_temp['stat_name'] == 'bestCleanSheetPercent']['teams'],
                'reading': df_temp[df_temp['stat_name'] == 'bestCleanSheetPercent']['stat_reading'].iloc[0],
            },
            'bestBigWinPercent': {
                'teams': df_temp[df_temp['stat_name'] == 'bestBigWinPercent']['teams'],
                'reading': df_temp[df_temp['stat_name'] == 'bestBigWinPercent']['stat_reading'].iloc[0],
            },
        }
    return dict_best_performers


def reformat_goal_related_stats(data: pd.DataFrame) -> Dict[str, GoalRelatedStatsOverTime]:
    """
    Helper function that re-formats goal-related-stats-over-time from DataFrame format to
    dictionary format, wherein the resulting dictionary has keys = league name, and
    values = list of dictionaries having goal-related-stats-over-time (for respective league).
    """
    dictionary_goal_related_stats = {}
    for league, df_by_league in data.groupby(by='league'):
        dictionary_goal_related_stats[league] = dataframe_to_list(data=df_by_league)
    return dictionary_goal_related_stats


def reformat_league_standings(data: pd.DataFrame) -> Dict[str, List]:
    """
    Takes DataFrame of league standings for one season (for all leagues).
    Returns dictionary having keys = league names, and values = list of given season's league standings
    for the respective league.
    """
    dict_league_standings = {}
    for league, df_temp in data.groupby(by='league'):
        df_by_league = df_temp.sort_values(by='position', ascending=True, ignore_index=True)
        dict_league_standings[league] = dataframe_to_list(data=df_by_league)
    return dict_league_standings