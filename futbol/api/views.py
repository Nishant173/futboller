from rest_framework.decorators import api_view
from django.http import JsonResponse
from leagues.models import LeagueMatch
from . import docs
from . import filters
from . import queries
from . import utils


@api_view(['GET'])
def get_documentation(request):
    endpoints = docs.ENDPOINTS
    return JsonResponse(data=endpoints, safe=False)


@api_view(['GET'])
def get_teams(request):
    teams = queries.get_teams()
    return JsonResponse(data=teams, safe=False)


@api_view(['GET'])
def get_leagues(request):
    leagues = queries.get_leagues()
    return JsonResponse(data=leagues, safe=False)


@api_view(['GET'])
def get_seasons(request):
    seasons = queries.get_seasons()
    return JsonResponse(data=seasons, safe=False)


@api_view(['GET'])
def get_matches(request):
    team = request.GET.get('team', default=None)
    league = request.GET.get('league', default=None)
    season = request.GET.get('season', default=None)
    gd = request.GET.get('goalDifference', default=None)
    min_gd = request.GET.get('minGoalDifference', default=None)
    max_gd = request.GET.get('maxGoalDifference', default=None)
    matchup = request.GET.get('matchup', default=None)
    winning_team = request.GET.get('winningTeam', default=None)
    losing_team = request.GET.get('losingTeam', default=None)
    
    qs_matches = LeagueMatch.objects.all()
    df_matches = utils.queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df_matches = filters.filter_league_data(data=df_matches,
                                            team=team,
                                            league=league,
                                            season=season,
                                            gd=int(gd) if gd else None,
                                            min_gd=int(min_gd) if min_gd else None,
                                            max_gd=int(max_gd) if max_gd else None,
                                            matchup=matchup,
                                            winning_team=winning_team,
                                            losing_team=losing_team)
    matches = df_matches.to_dict(orient='records')
    return JsonResponse(data=matches, safe=False)