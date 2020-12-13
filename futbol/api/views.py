from rest_framework.decorators import api_view
from django.http import JsonResponse
from leagues.models import LeagueMatch, LeagueStandings
from . import docs, filters, queries, utils


@api_view(['GET'])
def get_documentation(request):
    return JsonResponse(data=docs.ENDPOINTS, safe=False)


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


@api_view(['GET'])
def get_league_standings(request):
    league = request.GET['league']
    season = request.GET['season']
    qs_standings = LeagueStandings.objects.filter(league=league) & LeagueStandings.objects.filter(season=season)
    df_standings = utils.queryset_to_dataframe(qs=qs_standings, drop_id=True)
    df_standings['cumulative_points'] = df_standings['cumulative_points'].apply(utils.listify_string_of_nums)
    df_standings['cumulative_goal_difference'] = df_standings['cumulative_goal_difference'].apply(utils.listify_string_of_nums)
    list_league_standings = df_standings.to_dict(orient='records')
    return JsonResponse(data=list_league_standings, safe=False)