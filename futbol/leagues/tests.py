# Run these tests with .\manage.py test leagues

from django.test import TestCase
import numpy as np
import pandas as pd
from pandas.testing import assert_frame_equal, assert_series_equal

from .league_standings import (get_win_count,
                               get_loss_count,
                               get_draw_count,
                               get_goals_scored,
                               get_goals_allowed,
                               get_clean_sheet_count,
                               get_clean_sheets_against_count,
                               get_rout_count,
                               get_capitulation_count,
                               get_cumulative_points,
                               get_cumulative_goal_difference,
                               get_longest_streak,
                               get_results_string,
                               get_league_standings,
                               add_ranking_column)


EXPECTED_LEAGUE_MATCH_COLUMNS = [
    "home_team",
    "away_team",
    "home_goals",
    "away_goals",
    "season",
    "date",
    "league",
    "country",
]


EXPECTED_LEAGUE_STANDINGS_COLUMNS = [
    "position",
    "team",
    "games_played",
    "points",
    "goal_difference",
    "wins",
    "losses",
    "draws",
    "goals_scored",
    "goals_allowed",
    "clean_sheets",
    "clean_sheets_against",
    "big_wins",
    "big_losses",
    "results_string",
    "cumulative_points",
    "cumulative_goal_difference",
    "longest_win_streak",
    "longest_loss_streak",
    "longest_draw_streak",
    "longest_unbeaten_streak",
    "season",
    "league",
]


EXPECTED_CROSS_LEAGUE_STANDINGS_COLUMNS = [
    "position",
    "team",
    "games_played",
    "avg_points",
    "avg_goal_difference",
    "win_percent",
    "loss_percent",
    "draw_percent",
    "avg_goals_scored",
    "avg_goals_allowed",
    "clean_sheets_percent",
    "clean_sheets_against_percent",
    "big_win_percent",
    "big_loss_percent",
    "results_string",
    "cumulative_points",
    "cumulative_goal_difference",
    "longest_win_streak",
    "longest_loss_streak",
    "longest_draw_streak",
    "longest_unbeaten_streak",
    "league",
    "cumulative_points_normalized",
    "cumulative_goal_difference_normalized",
]


class LeagueMatchTestCase(TestCase):
    df_league_matches = pd.DataFrame(data={
        'home_team': ['A', 'B', 'C', 'D', 'C', 'B'],
        'away_team': ['D', 'A', 'D', 'B', 'A', 'C'],
        'home_goals': [1, 2, 0, 4, 3, 2],
        'away_goals': [0, 2, 1, 2, 5, 3],
        'date': pd.date_range(start='20/01/2019', periods=6, freq='7D'),
        'season': "MySeason",
        'league': "MyLeague",
        'country': "MyCountry",
    })
    
    def test_get_win_count(self):
        actual = get_win_count(data=LeagueMatchTestCase.df_league_matches, team='A')
        expected = 2
        assert actual == expected
        assert (0 <= actual <= len(LeagueMatchTestCase.df_league_matches))
    
    def test_get_loss_count(self):
        actual = get_loss_count(data=LeagueMatchTestCase.df_league_matches, team='B')
        expected = 2
        assert actual == expected
        assert (0 <= actual <= len(LeagueMatchTestCase.df_league_matches))
    
    def test_get_draw_count(self):
        actual = get_draw_count(data=LeagueMatchTestCase.df_league_matches, team='B')
        expected = 1
        assert actual == expected
        assert (0 <= actual <= len(LeagueMatchTestCase.df_league_matches))
    
    def test_get_goals_scored(self):
        actual = get_goals_scored(data=LeagueMatchTestCase.df_league_matches, team='A')
        expected = 8
        assert actual == expected
        assert (actual >= 0)
    
    def test_get_goals_allowed(self):
        actual = get_goals_allowed(data=LeagueMatchTestCase.df_league_matches, team='A')
        expected = 5
        assert actual == expected
        assert (actual >= 0)
    
    def test_get_clean_sheet_count(self):
        actual = get_clean_sheet_count(data=LeagueMatchTestCase.df_league_matches, team='A')
        expected = 1
        assert actual == expected
        assert (actual >= 0)
    
    def test_get_clean_sheets_against_count(self):
        actual = get_clean_sheets_against_count(data=LeagueMatchTestCase.df_league_matches, team='C')
        expected = 1
        assert actual == expected
        assert (actual >= 0)
    
    def test_get_rout_count(self):
        actual = get_rout_count(data=LeagueMatchTestCase.df_league_matches, team='D', goal_margin=2)
        expected = 1
        assert actual == expected
        assert (actual >= 0)
    
    def test_get_capitulation_count(self):
        actual = get_capitulation_count(data=LeagueMatchTestCase.df_league_matches, team='C', goal_margin=2)
        expected = 1
        assert actual == expected
        assert (actual >= 0)
    
    def test_get_results_string(self):
        actual = get_results_string(data=LeagueMatchTestCase.df_league_matches)
        expected = {
            'A': "WDW",
            'B': "DLL",
            'C': "LLW",
            'D': "LWW",
        }
        assert actual == expected
    
    def test_get_longest_streak(self):
        results_string = 'WWWDLDLLWWLDDDDW'
        actual_win_streak = get_longest_streak(results_string=results_string, by=['W'])
        expected_win_streak = 3
        actual_loss_streak = get_longest_streak(results_string=results_string, by=['L'])
        expected_loss_streak = 2
        actual_draw_streak = get_longest_streak(results_string=results_string, by=['D'])
        expected_draw_streak = 4
        actual_unbeaten_streak = get_longest_streak(results_string=results_string, by=['W', 'D'])
        expected_unbeaten_streak = 5
        assert actual_win_streak == expected_win_streak
        assert actual_loss_streak == expected_loss_streak
        assert actual_draw_streak == expected_draw_streak
        assert actual_unbeaten_streak == expected_unbeaten_streak
    
    def test_get_league_standings(self):
        df_league_standings = get_league_standings(data=LeagueMatchTestCase.df_league_matches,
                                                   league="MyLeague",
                                                   season="MySeason")
        columns = df_league_standings.columns.tolist()
        assert len(df_league_standings) == df_league_standings['team'].nunique()
        assert len(df_league_standings) == df_league_standings['position'].nunique()
        assert sorted(columns) == sorted(EXPECTED_LEAGUE_STANDINGS_COLUMNS)
    
    def test_add_ranking_column(self):
        df_league_standings = get_league_standings(data=LeagueMatchTestCase.df_league_matches,
                                                   league="MyLeague",
                                                   season="MySeason")
        df_ranked_by_goals_allowed = add_ranking_column(data=df_league_standings,
                                                        rank_column_name='rank_by_goals_allowed',
                                                        rank_by=['goals_allowed'],
                                                        ascending=[True])
        actual_ranks = df_ranked_by_goals_allowed['rank_by_goals_allowed'].tolist()
        actual_goals_allowed = df_ranked_by_goals_allowed['goals_allowed'].tolist()
        expected_ranks = list(np.arange(1, len(df_league_standings) + 1))
        expected_goals_allowed = list(sorted(actual_goals_allowed))
        assert actual_ranks == expected_ranks
        assert actual_goals_allowed == expected_goals_allowed