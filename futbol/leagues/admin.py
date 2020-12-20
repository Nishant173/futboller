from django.contrib import admin
from .models import LeagueMatch, LeagueStandings, CrossLeagueStandings


class LeagueMatchAdmin(admin.ModelAdmin):
    list_display = ('home_team', 'away_team', 'home_goals', 'away_goals',
                    'season', 'date', 'league', 'country')
    list_filter = ('season', 'league', 'country')
    search_fields = ('home_team', 'away_team')


class LeagueStandingsAdmin(admin.ModelAdmin):
    list_display = ('position', 'team', 'games_played', 'points', 'goal_difference',
                    'season', 'league', 'results_string')
    list_filter = ('season', 'league', 'team', 'points', 'goal_difference')
    search_fields = ('season', 'league', 'team')


class CrossLeagueStandingsAdmin(admin.ModelAdmin):
    list_display = ('position', 'team', 'games_played', 'avg_points', 'avg_goal_difference',
                    'win_percent', 'loss_percent', 'league')
    list_filter = ('league', )
    search_fields = ('league', 'team')


admin.site.register(LeagueMatch, LeagueMatchAdmin)
admin.site.register(LeagueStandings, LeagueStandingsAdmin)
admin.site.register(CrossLeagueStandings, CrossLeagueStandingsAdmin)