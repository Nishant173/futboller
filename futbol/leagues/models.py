from typing import Dict, Union
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
    
    @property
    def is_draw(self) -> bool:
        return (self.home_goals == self.away_goals)
    
    @property
    def is_home_win(self) -> bool:
        return (self.home_goals > self.away_goals)
    
    @property
    def is_away_win(self) -> bool:
        return (self.home_goals < self.away_goals)
    
    @property
    def winner(self) -> str:
        if self.is_draw:
            return "None"
        if self.is_home_win:
            return self.home_team
        return self.away_team
    
    @property
    def loser(self) -> str:
        if self.is_draw:
            return "None"
        if self.is_home_win:
            return self.away_team
        return self.home_team
    
    @property
    def goal_difference(self) -> int:
        return abs(self.home_goals - self.away_goals)
    
    @property
    def is_one_sided(self) -> bool:
        """Returns True if the match is one-sided (if one team wins by margin of 3 or more goals)"""
        return (self.goal_difference >= 3)



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
    results_string = models.CharField(verbose_name="Results string",
                                      max_length=38,
                                      null=False,
                                      default="")
    cumulative_points = models.CharField(verbose_name="Cumulative points",
                                         max_length=200,
                                         null=False,
                                         default="")
    cumulative_goal_difference = models.CharField(verbose_name="Cumulative goal difference",
                                                  max_length=200,
                                                  null=False,
                                                  default="")
    longest_win_streak = models.IntegerField(verbose_name="Longest win streak", null=False, default=-1)
    longest_loss_streak = models.IntegerField(verbose_name="Longest loss streak", null=False, default=-1)
    longest_draw_streak = models.IntegerField(verbose_name="Longest draw streak", null=False, default=-1)
    longest_unbeaten_streak = models.IntegerField(verbose_name="Longest unbeaten streak", null=False, default=-1)
    season = models.CharField(verbose_name="Season", max_length=10, null=False)
    league = models.CharField(verbose_name="League", max_length=30, null=False)

    class Meta:
        verbose_name = "League Standings"
        verbose_name_plural = "League Standings"
    
    def __str__(self) -> str:
        return f"{self.team} - {self.league} ({self.season})"
    
    @property
    def is_league_winner(self) -> bool:
        """Returns True if the team won their league that season; False otherwise"""
        return (self.position == 1)



class CrossLeagueStandings(models.Model):
    position = models.IntegerField(verbose_name="Position", null=False, default=0)
    team = models.CharField(verbose_name="Team", max_length=50, null=False)
    games_played = models.IntegerField(verbose_name="Games played", null=False)
    avg_points = models.FloatField(verbose_name="Average points", null=False)
    avg_goal_difference = models.FloatField(verbose_name="Average goal difference", null=False)
    win_percent = models.FloatField(verbose_name="Win percent", null=False)
    loss_percent = models.FloatField(verbose_name="Loss percent", null=False)
    draw_percent = models.FloatField(verbose_name="Draw percent", null=False)
    avg_goals_scored = models.FloatField(verbose_name="Average goals scored", null=False)
    avg_goals_allowed = models.FloatField(verbose_name="Average goals allowed", null=False)
    clean_sheets_percent = models.FloatField(verbose_name="Clean sheets percent", null=False)
    clean_sheets_against_percent = models.FloatField(verbose_name="Clean sheets against percent", null=False)
    big_win_percent = models.FloatField(verbose_name="Big win percent", null=False)
    big_loss_percent = models.FloatField(verbose_name="Big loss percent", null=False)
    results_string = models.CharField(verbose_name="Results string",
                                      max_length=10000,
                                      null=False,
                                      default="")
    cumulative_points = models.CharField(verbose_name="Cumulative points",
                                         max_length=10000,
                                         null=False,
                                         default="")
    cumulative_goal_difference = models.CharField(verbose_name="Cumulative goal difference",
                                                  max_length=10000,
                                                  null=False,
                                                  default="")
    longest_win_streak = models.IntegerField(verbose_name="Longest win streak", null=False, default=-1)
    longest_loss_streak = models.IntegerField(verbose_name="Longest loss streak", null=False, default=-1)
    longest_draw_streak = models.IntegerField(verbose_name="Longest draw streak", null=False, default=-1)
    longest_unbeaten_streak = models.IntegerField(verbose_name="Longest unbeaten streak", null=False, default=-1)
    league = models.CharField(verbose_name="League", max_length=30, null=False)
    cumulative_points_normalized = models.CharField(verbose_name="Cumulative points normalized",
                                                    max_length=10000,
                                                    null=False,
                                                    default="")
    cumulative_goal_difference_normalized = models.CharField(verbose_name="Cumulative goal difference normalized",
                                                             max_length=10000,
                                                             null=False,
                                                             default="")

    class Meta:
        verbose_name = "Cross League Standings"
        verbose_name_plural = "Cross League Standings"
    
    def __str__(self) -> str:
        return f"{self.team} ({self.league})"