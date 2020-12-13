import numpy as np
import pandas as pd
from leagues.models import LeagueMatch
from . import filters, utils
pd.set_option('mode.chained_assignment', None)


def get_win_count(data: pd.DataFrame, team: str) -> int:
    """Get count of wins by team"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_home_wins = data[team_is_home & (data['home_goals'] > data['away_goals'])]
    df_away_wins = data[team_is_away & (data['away_goals'] > data['home_goals'])]
    win_count = len(df_home_wins) + len(df_away_wins)
    return win_count


def get_loss_count(data: pd.DataFrame, team: str) -> int:
    """Get count of losses by team"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_home_losses = data[team_is_home & (data['home_goals'] < data['away_goals'])]
    df_away_losses = data[team_is_away & (data['away_goals'] < data['home_goals'])]
    loss_count = len(df_home_losses) + len(df_away_losses)
    return loss_count


def get_draw_count(data: pd.DataFrame, team: str) -> int:
    """Get count of draws by team"""
    team_is_playing = (data['home_team'] == team) | (data['away_team'] == team)
    is_drawn = (data['home_goals'] == data['away_goals'])
    data = data[team_is_playing & is_drawn]
    draw_count = len(data)
    return draw_count


def get_goals_scored(data: pd.DataFrame, team: str) -> int:
    """Get count of goals scored by team"""
    home_goals = data[data['home_team'] == team]['home_goals'].sum()
    away_goals = data[data['away_team'] == team]['away_goals'].sum()
    goals_scored = home_goals + away_goals
    return goals_scored


def get_goals_allowed(data: pd.DataFrame, team: str) -> int:
    """Get count of goals allowed by team"""
    home_goals_allowed = data[data['home_team'] == team]['away_goals'].sum()
    away_goals_allowed = data[data['away_team'] == team]['home_goals'].sum()
    goals_allowed = home_goals_allowed + away_goals_allowed
    return goals_allowed


def get_clean_sheet_count(data: pd.DataFrame, team: str) -> int:
    """Get count of clean sheets kept by team"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_cs_away = data[team_is_away & (data['home_goals'] == 0)]
    df_cs_home = data[team_is_home & (data['away_goals'] == 0)]
    number_of_clean_sheets = len(df_cs_away) + len(df_cs_home)
    return number_of_clean_sheets


def get_clean_sheets_against_count(data: pd.DataFrame, team: str) -> int:
    """Get count of clean sheets against given team"""
    team_is_home = (data['home_team'] == team)
    team_is_away = (data['away_team'] == team)
    df_cs_against_away = data[team_is_away & (data['away_goals'] == 0)]
    df_cs_against_home = data[team_is_home & (data['home_goals'] == 0)]
    number_of_clean_sheets_against = len(df_cs_against_away) + len(df_cs_against_home)
    return number_of_clean_sheets_against


def get_rout_count(data: pd.DataFrame, team: str, goal_margin: int) -> int:
    """Get count of wins by team that are by margin >= `goal_margin`"""
    data['goal_margin'] = (data['home_goals'] - data['away_goals']).abs()
    df_rout_subset = data[data['goal_margin'] >= goal_margin]
    team_is_home = (df_rout_subset['home_team'] == team)
    team_is_away = (df_rout_subset['away_team'] == team)
    df_rout_home = df_rout_subset[team_is_home & (df_rout_subset['home_goals'] > df_rout_subset['away_goals'])]
    df_rout_away = df_rout_subset[team_is_away & (df_rout_subset['away_goals'] > df_rout_subset['home_goals'])]
    total_routs = len(df_rout_home) + len(df_rout_away)
    return total_routs


def get_capitulation_count(data: pd.DataFrame, team: str, goal_margin: int) -> int:
    """Get count of losses by team that are by margin >= `goal_margin`"""
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


def add_ranking(data: pd.DataFrame, column_name: str) -> pd.DataFrame:
    """Adds ranking column (`column_name`) based on ['points', 'goal_difference'] columns"""
    data.sort_values(by=['points', 'goal_difference'], ascending=[False, False], inplace=True, ignore_index=True)
    rankings = np.arange(start=1, stop=len(data) + 1, step=1)
    data[column_name] = rankings
    column_order = [column_name] + data.drop(labels=[column_name], axis=1).columns.tolist()
    data = data.loc[:, column_order]
    return data


def get_league_standings(data: pd.DataFrame) -> pd.DataFrame:
    """Gets league standings from data of matches (for one season)"""
    teams = utils.get_teams(data=data)
    df_league_standings = pd.DataFrame()
    for team in teams:
        df_by_team = filters.filter_by_team(data=data, team=team)
        games_played = utils.get_games_played(data=df_by_team)
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
        }, index=[0])
        df_league_standings = pd.concat(objs=[df_league_standings, df_temp], ignore_index=True, sort=False)
    df_league_standings = add_ranking(data=df_league_standings, column_name='position')
    return df_league_standings


def get_historical_league_standings() -> pd.DataFrame:
    """Gets league standings from data of matches (for all seasons and for all leagues)"""
    df_league_standings = pd.DataFrame()
    qs_matches = LeagueMatch.objects.all()
    data = utils.queryset_to_dataframe(qs=qs_matches, drop_id=True)
    leagues = sorted(data['league'].unique().tolist())
    seasons = sorted(data['season'].unique().tolist())
    for league in leagues:
        for season in seasons:
            df_by_season = data.loc[((data['league'] == league) & (data['season'] == season)), :]
            df_temp = get_league_standings(data=df_by_season)
            df_temp['league'] = league
            df_temp['season'] = season
            df_league_standings = pd.concat(objs=[df_league_standings, df_temp], ignore_index=True, sort=False)
    return df_league_standings