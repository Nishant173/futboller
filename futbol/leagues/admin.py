from django.contrib import admin
from .models import LeagueMatch


class LeagueMatchAdmin(admin.ModelAdmin):
    list_display = ('home_team', 'away_team', 'home_goals', 'away_goals',
                    'season', 'date', 'league', 'country')
    list_filter = ('season', 'league', 'country')
    search_fields = ('home_team', 'away_team')


admin.site.register(LeagueMatch, LeagueMatchAdmin)