from rest_framework.decorators import api_view
from rest_framework.response import Response
from leagues import filters, queries
from leagues.models import LeagueMatch, LeagueStandings, CrossLeagueStandings
from utilities import casing, utils
from . import docs


@api_view(['GET'])
def get_documentation(request):
    return Response(data=docs.ENDPOINTS, status=200)


@api_view(['GET'])
def get_teams(request):
    name_contains = request.GET.get('nameContains', default=None)
    teams = queries.get_teams()
    teams = filters.filter_teams_by_icontains(teams=teams, name_contains=name_contains)
    return Response(data=teams, status=200)


@api_view(['GET'])
def get_leagues(request):
    leagues = queries.get_leagues()
    return Response(data=leagues, status=200)


@api_view(['GET'])
def get_seasons(request):
    seasons = queries.get_seasons()
    return Response(data=seasons, status=200)


@api_view(['GET'])
def get_league_matches(request):
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
    df_matches = utils.switch_column_casing(data=df_matches, func=casing.sc2lcc)
    matches = utils.dataframe_to_list(data=df_matches)
    return Response(data=matches, status=200)


@api_view(['GET'])
def get_league_standings(request):
    league = request.GET['league']
    season = request.GET['season']
    qs_standings = LeagueStandings.objects.filter(league=league) & LeagueStandings.objects.filter(season=season)
    df_standings = utils.queryset_to_dataframe(qs=qs_standings, drop_id=True)
    df_standings['cumulative_points'] = df_standings['cumulative_points'].apply(utils.listify_string_of_nums)
    df_standings['cumulative_goal_difference'] = df_standings['cumulative_goal_difference'].apply(utils.listify_string_of_nums)
    df_standings = utils.switch_column_casing(data=df_standings, func=casing.sc2lcc)
    league_standings = utils.dataframe_to_list(data=df_standings)
    return Response(data=league_standings, status=200)


@api_view(['GET'])
def get_cross_league_standings(request):
    qs_cross_standings = CrossLeagueStandings.objects.all()
    df_cross_standings = utils.queryset_to_dataframe(qs=qs_cross_standings, drop_id=True)
    df_cross_standings['cumulative_points'] = df_cross_standings['cumulative_points'].apply(utils.listify_string_of_nums)
    df_cross_standings['cumulative_goal_difference'] = df_cross_standings['cumulative_goal_difference'].apply(utils.listify_string_of_nums)
    df_cross_standings = utils.switch_column_casing(data=df_cross_standings, func=casing.sc2lcc)
    cross_league_standings = utils.dataframe_to_list(data=df_cross_standings)
    return Response(data=cross_league_standings, status=200)