from typing import Dict
from django.db import models


class LeagueMatch(models.Model):
    home_team = models.CharField(verbose_name="Home team", max_length=50, null=False)
    away_team = models.CharField(verbose_name="Away team", max_length=50, null=False)
    home_goals = models.IntegerField(verbose_name="Home goals", null=False)
    away_goals = models.IntegerField(verbose_name="Away goals", null=False)
    season = models.CharField(verbose_name="Season", max_length=10, null=False)
    date = models.DateField(verbose_name="Date", null=False)
    league = models.CharField(verbose_name="League", max_length=30, null=False)
    country = models.CharField(verbose_name="Country", max_length=30, null=False)

    class Meta:
        verbose_name = "League Match"
        verbose_name_plural = "League Matches"
    
    def __str__(self) -> str:
        return f"{self.home_team} vs {self.away_team} ({self.league} {self.season})"
    
    def obj_to_dict(self) -> Dict:
        """Converts model object to dictionary, and keeps the relevant keys"""
        dict_obj = self.__dict__
        dict_obj_needed = {
            'home_team': dict_obj['home_team'],
            'away_team': dict_obj['away_team'],
            'home_goals': dict_obj['home_goals'],
            'away_goals': dict_obj['away_goals'],
            'season': dict_obj['season'],
            'date': str(dict_obj['date']),
            'league': dict_obj['league'],
            'country': dict_obj['country'],
        }
        return dict_obj_needed
    
    @property
    def draw(self) -> bool:
        return (self.home_goals == self.away_goals)
    
    @property
    def home_win(self) -> bool:
        return (self.home_goals > self.away_goals)
    
    @property
    def away_win(self) -> bool:
        return (self.home_goals < self.away_goals)
    
    @property
    def one_sided(self) -> bool:
        gd = abs(self.home_goals - self.away_goals)
        return (gd >= 3)



class LeagueStandings(models.Model):
    position = models.IntegerField(verbose_name="Position", null=False, default=0)
    team = models.CharField(verbose_name="Team", max_length=50, null=False)
    games_played = models.IntegerField(verbose_name="Games played", null=False)
    points = models.IntegerField(verbose_name="Points", null=False)
    goal_difference = models.IntegerField(verbose_name="Goal difference", null=False)
    wins = models.IntegerField(verbose_name="Wins", null=False)
    losses = models.IntegerField(verbose_name="Losses", null=False)
    draws = models.IntegerField(verbose_name="Draws", null=False)
    goals_scored = models.IntegerField(verbose_name="Goals scored", null=False)
    goals_allowed = models.IntegerField(verbose_name="Goals allowed", null=False)
    clean_sheets = models.IntegerField(verbose_name="Clean sheets", null=False)
    clean_sheets_against = models.IntegerField(verbose_name="Clean sheets against", null=False)
    big_wins = models.IntegerField(verbose_name="Big wins", null=False)
    big_losses = models.IntegerField(verbose_name="Big losses", null=False)
    season = models.CharField(verbose_name="Season", max_length=10, null=False)
    league = models.CharField(verbose_name="League", max_length=30, null=False)

    class Meta:
        verbose_name = "League Standings"
        verbose_name_plural = "League Standings"
    
    def __str__(self) -> str:
        return f"{self.team} - {self.league} ({self.season})"