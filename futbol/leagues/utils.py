from typing import List
import pandas as pd


def get_unique_teams(data: pd.DataFrame) -> List[str]:
    """
    Gets list of all unique teams present in DataFrame.
    Expects DataFrame having `LeagueMatch` data.
    """
    teams_series = pd.concat(objs=[data['home_team'], data['away_team']]).sort_values(ascending=True)
    unique_teams = teams_series.unique().tolist()
    return unique_teams


def get_teams_from_matchup(matchup: str) -> List[str]:
    """Gets list of teams from `matchup` string, which can contain two teams i.e; 'Arsenal,Chelsea'"""
    teams = str(matchup).split(',')
    return teams


def get_goals_scored_per_match(data: pd.DataFrame) -> float:
    """Takes DataFrame having `LeagueMatch` data, and returns average goals scored per match"""
    goals_scored = data['home_goals'].sum() + data['away_goals'].sum()
    goals_scored_per_match = goals_scored / len(data)
    return goals_scored_per_match


def get_big_results_percentage(data: pd.DataFrame, goal_margin: int) -> float:
    """
    Expects DataFrame having `LeagueMatch` data.
    Gets percentage of big results i.e; percent of matches having goal difference >= `goal_margin`
    """
    df = data.copy(deep=True)
    num_games_played = len(df)
    df['goal_margin'] = (df['home_goals'] - df['away_goals']).abs()
    df_big_results = df[df['goal_margin'] >= goal_margin]
    big_results_pct = len(df_big_results) * 100 / num_games_played
    return big_results_pct


def get_clean_sheets_percentage(data: pd.DataFrame) -> float:
    """
    Expects DataFrame having `LeagueMatch` data.
    Gets percentage of matches in which at least one team kept a clean sheet
    """
    df = data.copy(deep=True)
    num_games_played = len(df)
    df_matches_with_clean_sheets = df[(df['home_goals'] == 0) | (df['away_goals'] == 0)]
    clean_sheets_pct = len(df_matches_with_clean_sheets) * 100 / num_games_played
    return clean_sheets_pct


def verbosify_month_group(month_group: str) -> str:
    """
    Takes in string of year and month i.e; "2009-12" (Format: "yyyy-mm").
    Returns the verbose English representation of the same i.e; "2009 December".
    """
    yyyy, mm = month_group.split('-')
    dict_month_mapper = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December',
    }
    verbosified = f"{yyyy} {dict_month_mapper[mm]}"
    return verbosified