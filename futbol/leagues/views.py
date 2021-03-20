from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from . import filters, queries
from .models import LeagueMatch, LeagueStandings, CrossLeagueStandings, GoalRelatedStats
from .utils import get_teams_from_matchup
from . import wrangler
from py_utils.data_analysis.transform import (dataframe_to_list,
                                              switch_column_casing)
from py_utils.django_utils.utils import queryset_to_dataframe
from py_utils.general.casing import sc2lcc
from py_utils.general.utils import listify_string_of_nums


@api_view(['GET'])
def get_general_stats(request):
    """Gets general overall statistics from leagues data"""
    num_league_matches_in_db = queries.get_league_matches_count()
    dict_date_limits_of_matches = queries.get_date_limits_of_league_matches()
    dict_num_unique_teams_by_league = queries.get_num_unique_teams_by_league()
    dict_grs_by_league = queries.get_goal_related_stats_by_league()
    dict_current_season_league_leaders = queries.get_current_season_league_leaders()
    dictionary_general_stats = {
        'num_league_matches_in_db': num_league_matches_in_db,
        'date_of_first_collected_record': dict_date_limits_of_matches['first_available_date'],
        'date_of_last_collected_record': dict_date_limits_of_matches['last_available_date'],
        'num_unique_teams_by_league': dict_num_unique_teams_by_league,
        'avg_goals_scored_by_league': dict_grs_by_league['avg_goals_scored'],
        'avg_goal_difference_by_league': dict_grs_by_league['avg_goal_difference'],
        'current_season_league_leaders': dict_current_season_league_leaders,
    }
    dictionary_general_stats_camel_cased = {}
    for key, value in dictionary_general_stats.items():
        dictionary_general_stats_camel_cased[sc2lcc(string=key)] = value
    return Response(data=dictionary_general_stats_camel_cased, status=status.HTTP_200_OK)


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
    team = request.GET.get('team', default=None)
    home_team = request.GET.get('homeTeam', default=None)
    away_team = request.GET.get('awayTeam', default=None)
    league = request.GET.get('league', default=None)
    season = request.GET.get('season', default=None)
    start_date = request.GET.get('startDate', default=None)
    end_date = request.GET.get('endDate', default=None)
    month_group_verbose = request.GET.get('monthGroupVerbose', default=None)
    gd = request.GET.get('goalDifference', default=None)
    min_gd = request.GET.get('minGoalDifference', default=None)
    max_gd = request.GET.get('maxGoalDifference', default=None)
    matchup = request.GET.get('matchup', default=None)
    winning_team = request.GET.get('winningTeam', default=None)
    losing_team = request.GET.get('losingTeam', default=None)
    
    qs_matches = LeagueMatch.objects.all()
    df_matches = queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df_matches = filters.filter_league_matches(
        data=df_matches,
        team=team,
        home_team=home_team,
        away_team=away_team,
        league=league,
        season=season,
        start_date=start_date,
        end_date=end_date,
        month_group_verbose=month_group_verbose,
        gd=int(gd) if gd else None,
        min_gd=int(min_gd) if min_gd else None,
        max_gd=int(max_gd) if max_gd else None,
        matchup=matchup,
        winning_team=winning_team,
        losing_team=losing_team,
    )
    df_matches = switch_column_casing(data=df_matches, func=sc2lcc)
    matches = dataframe_to_list(data=df_matches)
    return Response(data=matches, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_head_to_head_stats(request):
    matchup = request.GET['matchup']
    teams = get_teams_from_matchup(matchup=matchup)
    qs_matches = LeagueMatch.objects.all()
    df_matches = queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df_h2h_stats = wrangler.get_h2h_stats(data=df_matches, teams=teams)
    if df_h2h_stats.empty:
        return Response(data=[], status=status.HTTP_200_OK)
    df_h2h_stats = switch_column_casing(data=df_h2h_stats, func=sc2lcc)
    h2h_stats = dataframe_to_list(data=df_h2h_stats)
    return Response(data=h2h_stats, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_partitioned_stats(request):
    team = request.GET['team']
    qs_matches = LeagueMatch.objects.all()
    df_matches = queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df_partitioned_stats = wrangler.get_partitioned_stats(data=df_matches, team=team, normalize=True)
    if df_partitioned_stats.empty:
        return Response(data=[], status=status.HTTP_200_OK)
    df_partitioned_stats = switch_column_casing(data=df_partitioned_stats, func=sc2lcc)
    partitioned_stats = dataframe_to_list(data=df_partitioned_stats)
    return Response(data=partitioned_stats, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_goal_related_stats(request):
    qs_grs = GoalRelatedStats.objects.all()
    df_goal_related_stats = queryset_to_dataframe(qs=qs_grs, drop_id=True)
    if df_goal_related_stats.empty:
        return Response(data={}, status=status.HTTP_200_OK)
    df_goal_related_stats = switch_column_casing(data=df_goal_related_stats, func=sc2lcc)
    goal_related_stats = wrangler.reformat_goal_related_stats(data=df_goal_related_stats)
    return Response(data=goal_related_stats, status=status.HTTP_200_OK)


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
    team = request.GET.get('team', default=None)
    league = request.GET.get('league', default=None)
    qs_cls = CrossLeagueStandings.objects.all()
    df_cls = queryset_to_dataframe(qs=qs_cls, drop_id=True)
    df_cls = filters.filter_cross_league_standings(data=df_cls,
                                                   team=team,
                                                   league=league)
    if df_cls.empty:
        return Response(data=[], status=status.HTTP_200_OK)
    df_cls['cumulative_points'] = df_cls['cumulative_points'].apply(listify_string_of_nums)
    df_cls['cumulative_goal_difference'] = df_cls['cumulative_goal_difference'].apply(listify_string_of_nums)
    df_cls['cumulative_points_normalized'] = df_cls['cumulative_points_normalized'].apply(listify_string_of_nums)
    df_cls['cumulative_goal_difference_normalized'] = df_cls['cumulative_goal_difference_normalized'].apply(listify_string_of_nums)
    df_cls = switch_column_casing(data=df_cls, func=sc2lcc)
    cls = dataframe_to_list(data=df_cls)
    return Response(data=cls, status=status.HTTP_200_OK)