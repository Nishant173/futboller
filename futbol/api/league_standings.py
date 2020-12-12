import numpy as np
import pandas as pd
from . import filters, utils
# pd.set_option('mode.chained_assignment', None)


def get_win_count(data: pd.DataFrame, team: str) -> int:
    """Get count of wins per team"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_home_wins = data[team_is_home & (data['home_goals'] > data['away_goals'])]
    df_away_wins = data[team_is_away & (data['away_goals'] > data['home_goals'])]
    win_count = len(df_home_wins) + len(df_away_wins)
    return win_count


def get_loss_count(data: pd.DataFrame, team: str) -> int:
    """Get count of losses per team"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_home_losses = data[team_is_home & (data['home_goals'] < data['away_goals'])]
    df_away_losses = data[team_is_away & (data['away_goals'] < data['home_goals'])]
    loss_count = len(df_home_losses) + len(df_away_losses)
    return loss_count


def get_draw_count(data: pd.DataFrame) -> int:
    """Get count of draws per team"""
    df_draws = data[data['home_goals'] == data['away_goals']]
    draw_count = len(df_draws)
    return draw_count


def get_goals_scored(data: pd.DataFrame, team: str) -> int:
    """Get count of goals scored per team"""
    home_goals = data[data['home_team'] == team]['home_goals'].sum()
    away_goals = data[data['away_team'] == team]['away_goals'].sum()
    goals_scored = home_goals + away_goals
    return goals_scored


def get_goals_allowed(data: pd.DataFrame, team: str) -> int:
    """Get count of goals allowed per team"""
    home_goals_allowed = data[data['home_team'] == team]['away_goals'].sum()
    away_goals_allowed = data[data['away_team'] == team]['home_goals'].sum()
    goals_allowed = home_goals_allowed + away_goals_allowed
    return goals_allowed


def get_clean_sheet_count(data: pd.DataFrame, team: str) -> int:
    """Takes in team name, and returns number of clean sheets for that team"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_cs_away = data[team_is_away & (data['home_goals'] == 0)]
    df_cs_home = data[team_is_home & (data['away_goals'] == 0)]
    number_of_clean_sheets = len(df_cs_away) + len(df_cs_home)
    return number_of_clean_sheets


def get_clean_sheets_against_count(data: pd.DataFrame, team: str) -> int:
    """Takes in team name, and returns number of clean sheets against that particular team"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_cs_against_away = data[team_is_away & (data['away_goals'] == 0)]
    df_cs_against_home = data[team_is_home & (data['home_goals'] == 0)]
    number_of_clean_sheets_against = len(df_cs_against_away) + len(df_cs_against_home)
    return number_of_clean_sheets_against


def get_rout_count(data: pd.DataFrame, team: str, goal_margin: int) -> int:
    """Get count of number of times team wins by margin of `goal_margin` or more goals"""
    data['goal_margin'] = (data['home_goals'] - data['away_goals']).abs()
    df_rout_subset = data[data['goal_margin'] >= goal_margin]
    team_is_home = (df_rout_subset['home_team'] == team)
    team_is_away = (df_rout_subset['away_team'] == team)
    df_rout_home = df_rout_subset[team_is_home & (df_rout_subset['home_goals'] > df_rout_subset['away_goals'])]
    df_rout_away = df_rout_subset[team_is_away & (df_rout_subset['away_goals'] > df_rout_subset['home_goals'])]
    total_routs = len(df_rout_home) + len(df_rout_away)
    return total_routs


def get_capitulation_count(data: pd.DataFrame, team: str, goal_margin: int) -> int:
    """Get count of number of times team loses by margin of `goal_margin` or more goals"""
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


def get_league_standings(data: pd.DataFrame) -> pd.DataFrame:
    """Gets league standings from data of matches in said league (for one particular season)"""
    teams = utils.get_teams(data=data)
    df_league_standings = pd.DataFrame()
    for team in teams:
        df_by_team = filters.filter_by_team(data=data, team=team)

        played = utils.get_games_played(data=df_by_team)
        wins = get_win_count(data=df_by_team, team=team)
        losses = get_loss_count(data=df_by_team, team=team)
        draws = get_draw_count(data=df_by_team)
        gs = get_goals_scored(data=df_by_team, team=team)
        ga = get_goals_allowed(data=df_by_team, team=team)
        cs = get_clean_sheet_count(data=df_by_team, team=team)
        csa = get_clean_sheets_against_count(data=df_by_team, team=team)
        routs = get_rout_count(data=df_by_team, team=team, goal_margin=3)
        capitulations = get_capitulation_count(data=df_by_team, team=team, goal_margin=3)
        
        df_temp = pd.DataFrame(data={
            'team': team,
            'played': played,
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
            'big_losses': capitulations
        }, index=[0])
        df_league_standings = pd.concat(objs=[df_league_standings, df_temp],
                                        ignore_index=True,
                                        sort=False)
    
    df_league_standings.sort_values(by=['points', 'goal_difference'],
                                    ascending=[False, False],
                                    inplace=True,
                                    ignore_index=True)
    standings = np.arange(start=1, stop=len(df_league_standings) + 1, step=1)
    df_league_standings['standings'] = standings
    columns = ['standings'] + df_league_standings.drop(labels=['standings'], axis=1).columns.tolist()
    df_league_standings = df_league_standings.loc[:, columns]
    return df_league_standings