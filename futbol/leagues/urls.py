from django.urls import path
from . import views


urlpatterns = [
    path(route='teams/', view=views.get_teams, name='teams'),
    path(route='leagues/', view=views.get_leagues, name='leagues'),
    path(route='seasons/', view=views.get_seasons, name='seasons'),
    path(route='league-matches/', view=views.get_league_matches, name='league-matches'),
    path(route='league-standings/', view=views.get_league_standings, name='league-standings'),
    path(route='cross-league-standings/', view=views.get_cross_league_standings, name='cross-league-standings'),
]