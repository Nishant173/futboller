from django.urls import path
from . import views

urlpatterns = [
    path(route='documentation/', view=views.get_documentation, name='documentation'),
    path(route='teams/', view=views.get_teams, name='teams'),
    path(route='leagues/', view=views.get_leagues, name='leagues'),
    path(route='seasons/', view=views.get_seasons, name='seasons'),
    path(route='matches', view=views.get_matches, name='matches'),
    path(route='league-standings', view=views.get_league_standings, name='league-standings'),
]