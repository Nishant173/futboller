from typing import List
import pandas as pd
from futbol import config


class InvalidLeagueStandingsError(Exception):
    """Custom exception class for Invalid League Standings DataFrame (when it doesn't contain data for one league and one season)"""
    pass


class LeagueTitleRace:
    def __init__(self,
                 df_league_standings: pd.DataFrame,
                 league: str,
                 season: str) -> None:
        """
        Takes in DataFrame of `LeagueStandings` data, along with league name and season name.
        Columns expected in the DataFrame: ['position', 'team', 'games_played', 'points', 'goal_difference']
        """
        self._df_ls = df_league_standings[(df_league_standings['league'] == league) & (df_league_standings['season'] == season)]
        self._league = league
        self._season = season
        if not self._is_valid:
            raise InvalidLeagueStandingsError("Expected DataFrame having `LeagueStandings` data for the given league and season")
        self._max_num_games_per_team = config.NUM_GAMES_PER_TEAM_BY_LEAGUE[league]
        self._league_leader = self._get_league_leader()
        self._max_points = self._get_max_points()
        self._teams_with_max_points = self._list_teams(has_max_points=True)
        self._teams_without_max_points = self._list_teams(has_max_points=False)
        return None
    
    @property
    def _is_valid(self) -> bool:
        has_only_one_league = (self._df_ls['league'].nunique() == 1)
        has_only_one_season = (self._df_ls['season'].nunique() == 1)
        has_the_given_league = (self._league in self._df_ls['league'].unique().tolist())
        has_the_given_season = (self._season in self._df_ls['season'].unique().tolist())
        has_all_needed_teams = (self.num_unique_teams == config.NUM_TEAMS_BY_LEAGUE[self._league])
        has_correct_length = (len(self._df_ls) == config.NUM_TEAMS_BY_LEAGUE[self._league])
        is_valid_input_dataframe = (
            has_only_one_league & has_only_one_season
            & has_the_given_league & has_the_given_season
            & has_all_needed_teams & has_correct_length
        )
        return is_valid_input_dataframe
    
    def __str__(self) -> str:
        return f"LeagueTitleRace - {self._league} ({self._season})"
    
    @property
    def unique_teams(self) -> List[str]:
        return sorted(self._df_ls['team'].unique().tolist())
    
    @property
    def num_unique_teams(self) -> int:
        return len(self.unique_teams)
    
    def _get_league_leader(self) -> str:
        df_ls = self._df_ls
        league_leader = df_ls[df_ls['position'] == 1]['team'].iloc[0]
        return league_leader
    
    def _get_max_points(self) -> int:
        return self._df_ls['points'].max()
    
    def _list_teams(self, has_max_points: bool) -> List[str]:
        df_ls = self._df_ls
        max_points = self._max_points
        if has_max_points:
            teams = df_ls[df_ls['points'] == max_points]['team'].tolist()
        else:
            teams = df_ls[df_ls['points'] != max_points]['team'].tolist()
        return teams
    
    def _can_win_the_league(self,
                            team: str,
                            games_played: int,
                            points: int) -> bool:
        """
        Returns True if the team can make up enough points to catch up to the team/s having
        maximum points currently. Returns False otherwise.
        """
        points_of_current_league_leader = self._max_points
        has_max_points = (points_of_current_league_leader == points)
        if has_max_points:
            return True
        games_remaining = self._max_num_games_per_team - games_played
        max_points_limit_of_this_team = points + (games_remaining * 3)
        can_win_league_title = (max_points_limit_of_this_team >= points_of_current_league_leader)
        return can_win_league_title

    def get_league_title_contenders(self) -> pd.DataFrame:
        """
        Returns DataFrame having `LeagueStandings` data and the following additional columns: ['can_win_the_league']
        
        Note: Only works on current season's `LeagueStandings` data (as the standings can change).
        Limitations: Only considers points that can be accumulated by teams chasing the league leaders.
        """
        df_ls = self._df_ls.copy(deep=True)
        all_teams = self.unique_teams
        
        list_can_be_league_winner = []
        for team in all_teams:
            dict_standings_by_team = df_ls[df_ls['team'] == team].iloc[0].to_dict()
            can_win_the_league = self._can_win_the_league(
                team=team,
                games_played=dict_standings_by_team['games_played'],
                points=dict_standings_by_team['points'],
            )
            list_can_be_league_winner.append({
                'team': team,
                'can_win_the_league': can_win_the_league,
            })
        df_can_be_league_winner = pd.DataFrame(data=list_can_be_league_winner)
        df_league_title_contenders = pd.merge(
            left=df_ls,
            right=df_can_be_league_winner,
            how='outer',
            on=['team'],
        )
        return df_league_title_contenders
    
    @property
    def is_league_winner_decided(self) -> bool:
        df_league_title_contenders = self.get_league_title_contenders()
        return df_league_title_contenders['can_win_the_league'].sum() == 1
    
    @property
    def teams_in_title_race(self) -> List[str]:
        df_ltc = self.get_league_title_contenders()
        teams_still_in_title_race = df_ltc[df_ltc['can_win_the_league'] == True]['team'].tolist()
        return teams_still_in_title_race
    
    @property
    def league_winner(self) -> str:
        """Returns league winner if the league is decided. Otherwise, returns 'NA'"""
        if self.is_league_winner_decided:
            return self._league_leader
        return "NA"
    
    @property
    def league_leader(self) -> str:
        return self._league_leader