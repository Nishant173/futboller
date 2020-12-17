from django.urls import path
from . import views

urlpatterns = [
    path(route='documentation/', view=views.get_documentation, name='api-documentation'),
    path(route='teams/', view=views.get_teams, name='api-teams'),
    path(route='leagues/', view=views.get_leagues, name='api-leagues'),
    path(route='seasons/', view=views.get_seasons, name='api-seasons'),
    path(route='league-matches/', view=views.get_league_matches, name='api-league-matches'),
    path(route='league-standings/', view=views.get_league_standings, name='api-league-standings'),
    path(route='cross-league-standings/', view=views.get_cross_league_standings, name='api-cross-league-standings'),
]