from typing import List
import pandas as pd
from futbol import config
from py_utils.data_analysis.explore import (
    has_all_expected_columns,
)


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
        self.__df_ls = df_league_standings[(df_league_standings['league'] == league) & (df_league_standings['season'] == season)].copy(deep=True)
        self.__league = league
        self.__season = season
        self.__max_num_games_per_team = config.NUM_GAMES_PER_TEAM_BY_LEAGUE[self.__league]
        self.__expected_columns = ['position', 'team', 'games_played', 'points', 'goal_difference']
        self.__validate_inputs()
        return None
    
    def __str__(self) -> str:
        return f"LeagueTitleRace - {self.__league} ({self.__season})"
    
    def __validate_inputs(self) -> None:
        """
        Validation method that is to be called at the end of the constructor.
        Will throw an appropriate error if necessary.
        Returns None if no errors are caught.
        """
        has_only_one_league = (self.__df_ls['league'].nunique() == 1)
        has_only_one_season = (self.__df_ls['season'].nunique() == 1)
        has_the_given_league = (self.__league in self.__df_ls['league'].unique().tolist())
        has_the_given_season = (self.__season in self.__df_ls['season'].unique().tolist())
        has_all_needed_teams = (self.num_unique_teams == config.NUM_TEAMS_BY_LEAGUE[self.__league])
        has_correct_length = (len(self.__df_ls) == config.NUM_TEAMS_BY_LEAGUE[self.__league])
        has_expected_columns = has_all_expected_columns(
            data=self.__df_ls,
            expected_columns=self.__expected_columns,
        )
        if not has_only_one_league:
            raise InvalidLeagueStandingsError(f"Expected only one league's data, but got {self.__df_ls['league'].nunique()}")
        if not has_only_one_season:
            raise InvalidLeagueStandingsError(f"Expected only one season's data, but got {self.__df_ls['season'].nunique()}")
        if not has_the_given_league:
            raise InvalidLeagueStandingsError(f"Expected the league '{self.__league}' to be in the DataFrame")
        if not has_the_given_season:
            raise InvalidLeagueStandingsError(f"Expected the season '{self.__season}' to be in the DataFrame")
        if not has_all_needed_teams:
            raise InvalidLeagueStandingsError(
                f"Expected {config.NUM_TEAMS_BY_LEAGUE[self.__league]} teams for the league '{self.__league}', but got {self.num_unique_teams}"
            )
        if not has_correct_length:
            raise InvalidLeagueStandingsError(
                f"Expected DataFrame to have {config.NUM_TEAMS_BY_LEAGUE[self.__league]} rows i.e; one row per team, but got {len(self.__df_ls)} rows"
            )
        if not has_expected_columns:
            raise InvalidLeagueStandingsError(f"Expected columns {self.__expected_columns}, but got {self.__df_ls.columns.tolist()}")
        return None
    
    @property
    def unique_teams(self) -> List[str]:
        return sorted(self.__df_ls['team'].unique().tolist())
    
    @property
    def num_unique_teams(self) -> int:
        return len(self.unique_teams)
    
    @property
    def teams_with_max_points(self) -> List[str]:
        return self.__df_ls[self.__df_ls['points'] == self.max_points]['team'].tolist()
    
    @property
    def teams_without_max_points(self) -> List[str]:
        return self.__df_ls[self.__df_ls['points'] != self.max_points]['team'].tolist()
    
    @property
    def league_season_has_concluded(self) -> bool:
        return (self.__df_ls['games_played'].sum() == self.num_unique_teams * self.__max_num_games_per_team)
    
    @property
    def league_leader(self) -> str:
        return self.__df_ls[self.__df_ls['position'] == 1]['team'].iloc[0]
    
    @property
    def max_points(self) -> int:
        """Returns maximum points obtained between all teams"""
        return self.__df_ls['points'].max()
    
    def __can_win_the_league(self,
                             team: str,
                             position: int,
                             games_played: int,
                             points: int,
                             points_of_current_league_leader: int,
                             league_season_has_concluded: bool) -> bool:
        """
        Returns True if the given team can make up enough points to catch up to the team/s having
        maximum points currently; otherwise returns False.
        """
        if league_season_has_concluded:
            if position == 1:
                return True
            return False
        # Logic for an ongoing league season
        has_max_points = (points_of_current_league_leader == points)
        if has_max_points:
            return True
        games_remaining = self.__max_num_games_per_team - games_played
        max_points_limit_of_this_team = points + (games_remaining * 3)
        can_win_league_title = (max_points_limit_of_this_team >= points_of_current_league_leader)
        return can_win_league_title

    def get_league_title_contenders(self) -> pd.DataFrame:
        """
        Returns DataFrame having `LeagueStandings` data and the following additional columns: ['can_win_the_league']
        """
        df_ls = self.__df_ls.copy(deep=True)
        all_teams = self.unique_teams
        league_season_has_concluded = self.league_season_has_concluded
        points_of_current_league_leader = self.max_points
        
        can_be_league_winner = []
        for team in all_teams:
            dict_standings_by_team = df_ls[df_ls['team'] == team].iloc[0].to_dict()
            can_win_the_league = self.__can_win_the_league(
                team=team,
                position=dict_standings_by_team['position'],
                games_played=dict_standings_by_team['games_played'],
                points=dict_standings_by_team['points'],
                points_of_current_league_leader=points_of_current_league_leader,
                league_season_has_concluded=league_season_has_concluded,
            )
            can_be_league_winner.append({
                'team': team,
                'can_win_the_league': can_win_the_league,
            })
        df_can_be_league_winner = pd.DataFrame(data=can_be_league_winner)
        df_league_title_contenders = pd.merge(
            left=df_ls,
            right=df_can_be_league_winner,
            how='outer',
            on=['team'],
        )
        return df_league_title_contenders
    
    @property
    def teams_in_title_race(self) -> List[str]:
        df_ltc = self.get_league_title_contenders()
        teams_still_in_title_race = df_ltc[df_ltc['can_win_the_league'] == True]['team'].tolist()
        return teams_still_in_title_race
    
    @property
    def is_league_winner_decided(self) -> bool:
        return len(self.teams_in_title_race) == 1
    
    @property
    def league_winner(self) -> str:
        """Returns league winner if the league is decided; otherwise returns 'NA'"""
        if self.is_league_winner_decided:
            return self.league_leader
        return "NA"