from django.urls import path
from . import views


urlpatterns = [
    path(route='teams/', view=views.get_teams, name='teams'),
    path(route='teams-by-league/', view=views.get_teams_by_league, name='teams-by-league'),
    path(route='leagues/', view=views.get_leagues, name='leagues'),
    path(route='seasons/', view=views.get_seasons, name='seasons'),
    path(route='general-stats/', view=views.get_general_stats, name='general-stats'),
    path(route='league-matches/', view=views.get_league_matches, name='league-matches'),
    path(route='head-to-head-stats/', view=views.get_head_to_head_stats, name='head-to-head-stats'),
    path(route='partitioned-stats/', view=views.get_partitioned_stats, name='partitioned-stats'),
    path(route='goal-related-stats/', view=views.get_goal_related_stats, name='goal-related-stats'),
    path(route='league-standings/', view=views.get_league_standings, name='league-standings'),
    path(route='cross-league-standings/', view=views.get_cross_league_standings, name='cross-league-standings'),
]