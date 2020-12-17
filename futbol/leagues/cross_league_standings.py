from typing import Dict
import numpy as np
import pandas as pd
from . import filters
from .league_standings import (get_results_string,
                               get_cumulative_points,
                               get_cumulative_goal_difference,
                               get_win_count,
                               get_loss_count,
                               get_draw_count,
                               get_goals_scored,
                               get_goals_allowed,
                               get_clean_sheet_count,
                               get_clean_sheets_against_count,
                               get_rout_count,
                               get_capitulation_count,
                               get_longest_streak)
from .models import LeagueMatch
from .utils import get_unique_teams
from utilities import utils


def add_cross_league_ranking(data: pd.DataFrame, column_name: str) -> pd.DataFrame:
    """Adds ranking column (`column_name`) based on ['avg_points', 'avg_goal_difference', 'games_played'] columns"""
    data.sort_values(by=['avg_points', 'avg_goal_difference', 'games_played'],
                     ascending=[False, False, False],
                     inplace=True,
                     ignore_index=True)
    rankings = np.arange(start=1, stop=len(data) + 1, step=1)
    data[column_name] = rankings
    column_order = [column_name] + data.drop(labels=[column_name], axis=1).columns.tolist()
    data = data.loc[:, column_order]
    return data


def get_cross_league_standings() -> pd.DataFrame:
    """
    Gets cross league standings from `LeagueMatch` data (for all leagues and for all seasons).
    Columns returned in Cross League Standings:
        ['position', 'team', 'games_played', 'avg_points', 'avg_goal_difference',
         'win_percent', 'loss_percent', 'draw_percent', 'avg_goals_scored', 'avg_goals_allowed',
         'clean_sheets_percent', 'clean_sheets_against_percent', 'big_win_percent', 'big_loss_percent',
         'results_string', 'cumulative_points', 'cumulative_goal_difference', 'longest_win_streak',
         'longest_loss_streak', 'longest_draw_streak', 'longest_unbeaten_streak', 'league',
         'cumulative_points_normalized', 'cumulative_goal_difference_normalized']
    """
    qs_matches = LeagueMatch.objects.all()
    data = utils.queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df_cls = pd.DataFrame() # Initialize DataFrame of cross league standings
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
            'avg_points': (3 * wins + draws) / games_played,
            'avg_goal_difference': (gs - ga) / games_played,
            'win_percent': wins * 100 / games_played,
            'loss_percent': losses * 100 / games_played,
            'draw_percent': draws * 100 / games_played,
            'avg_goals_scored': gs / games_played,
            'avg_goals_allowed': ga / games_played,
            'clean_sheets_percent': cs * 100 / games_played,
            'clean_sheets_against_percent': csa * 100 / games_played,
            'big_win_percent': routs * 100 / games_played,
            'big_loss_percent': capitulations * 100 / games_played,
            'results_string': dict_results_string[team],
            'cumulative_points': utils.stringify_list_of_nums(array=dict_cum_pts[team]),
            'cumulative_goal_difference': utils.stringify_list_of_nums(array=dict_cum_gd[team]),
            'longest_win_streak': get_longest_streak(results_string=dict_results_string[team], by=['W']),
            'longest_loss_streak': get_longest_streak(results_string=dict_results_string[team], by=['L']),
            'longest_draw_streak': get_longest_streak(results_string=dict_results_string[team], by=['D']),
            'longest_unbeaten_streak': get_longest_streak(results_string=dict_results_string[team], by=['W', 'D']),
            'league': df_by_team['league'].unique().tolist()[0],
        }, index=[0])
        df_cls = pd.concat(objs=[df_cls, df_temp], ignore_index=True, sort=False)
    
    max_num_games_played = int(df_cls['games_played'].max())
    df_cls['cumulative_points'] = df_cls['cumulative_points'].apply(utils.listify_string_of_nums)
    df_cls['cumulative_goal_difference'] = df_cls['cumulative_goal_difference'].apply(utils.listify_string_of_nums)
    df_cls['cumulative_points_normalized'] = df_cls['cumulative_points'].apply(utils.spread_array, to=max_num_games_played)
    df_cls['cumulative_goal_difference_normalized'] = df_cls['cumulative_goal_difference'].apply(utils.spread_array, to=max_num_games_played)
    df_cls['cumulative_points'] = df_cls['cumulative_points'].apply(utils.stringify_list_of_nums)
    df_cls['cumulative_goal_difference'] = df_cls['cumulative_goal_difference'].apply(utils.stringify_list_of_nums)
    df_cls['cumulative_points_normalized'] = df_cls['cumulative_points_normalized'].apply(utils.stringify_list_of_nums)
    df_cls['cumulative_goal_difference_normalized'] = df_cls['cumulative_goal_difference_normalized'].apply(utils.stringify_list_of_nums)
    df_cls = add_cross_league_ranking(data=df_cls, column_name='position')
    df_cls = utils.round_off_columns(data=df_cls, mapper={
        'avg_points': 4,
        'avg_goal_difference': 4,
        'avg_goals_scored': 3,
        'avg_goals_allowed': 3,
        'win_percent': 2,
        'loss_percent': 2,
        'draw_percent': 2,
        'clean_sheets_percent': 2,
        'clean_sheets_against_percent': 2,
        'big_win_percent': 2,
        'big_loss_percent': 2,
    })
    return df_cls