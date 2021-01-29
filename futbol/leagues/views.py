from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import filters, queries
from .models import LeagueMatch, LeagueStandings, CrossLeagueStandings
from py_utils.data_analysis.transform import (dataframe_to_list,
                                              switch_column_casing)
from py_utils.django_utils.utils import queryset_to_dataframe
from py_utils.general.casing import sc2lcc
from py_utils.general.utils import listify_string_of_nums


@api_view(['GET'])
def get_teams(request):
    name_contains = request.GET.get('nameContains', default=None)
    teams = queries.get_teams()
    if name_contains:
        teams = filters.filter_teams_by_icontains(teams=teams, name_contains=name_contains)
    return Response(data=teams, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_leagues(request):
    leagues = queries.get_leagues()
    return Response(data=leagues, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_seasons(request):
    seasons = queries.get_seasons()
    return Response(data=seasons, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_league_matches(request):
    offset = request.GET.get('offset', default=None)
    limit = request.GET.get('limit', default=None)
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
    df_matches = queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df_matches = filters.filter_league_matches(data=df_matches,
                                               team=team,
                                               league=league,
                                               season=season,
                                               gd=int(gd) if gd else None,
                                               min_gd=int(min_gd) if min_gd else None,
                                               max_gd=int(max_gd) if max_gd else None,
                                               matchup=matchup,
                                               winning_team=winning_team,
                                               losing_team=losing_team)
    df_matches = switch_column_casing(data=df_matches, func=sc2lcc)
    matches = dataframe_to_list(data=df_matches)
    return Response(data=matches, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_league_standings(request):
    league = request.GET['league']
    season = request.GET['season']
    qs_standings = LeagueStandings.objects.filter(league=league) & LeagueStandings.objects.filter(season=season)
    df_standings = queryset_to_dataframe(qs=qs_standings, drop_id=True)
    df_standings['cumulative_points'] = df_standings['cumulative_points'].apply(listify_string_of_nums)
    df_standings['cumulative_goal_difference'] = df_standings['cumulative_goal_difference'].apply(listify_string_of_nums)
    df_standings = switch_column_casing(data=df_standings, func=sc2lcc)
    league_standings = dataframe_to_list(data=df_standings)
    return Response(data=league_standings, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_cross_league_standings(request):
    offset = request.GET.get('offset', default=None)
    limit = request.GET.get('limit', default=None)
    qs_cls = CrossLeagueStandings.objects.all()
    df_cls = queryset_to_dataframe(qs=qs_cls, drop_id=True)
    df_cls['cumulative_points'] = df_cls['cumulative_points'].apply(listify_string_of_nums)
    df_cls['cumulative_goal_difference'] = df_cls['cumulative_goal_difference'].apply(listify_string_of_nums)
    df_cls['cumulative_points_normalized'] = df_cls['cumulative_points_normalized'].apply(listify_string_of_nums)
    df_cls['cumulative_goal_difference_normalized'] = df_cls['cumulative_goal_difference_normalized'].apply(listify_string_of_nums)
    df_cls = switch_column_casing(data=df_cls, func=sc2lcc)
    cls = dataframe_to_list(data=df_cls)
    return Response(data=cls, status=status.HTTP_200_OK)