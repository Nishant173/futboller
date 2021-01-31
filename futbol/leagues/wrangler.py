from typing import List
import pandas as pd

from . import filters
from .league_standings import (get_win_count,
                               get_draw_count,
                               get_goals_scored,
                               get_clean_sheet_count,
                               get_rout_count,
                               get_results_string,
                               get_longest_streak)


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