import pandas as pd

from futbol import config
from .models import LeagueMatch
from .utils import (
    get_goals_scored_per_match,
    get_goal_difference_per_match,
    get_big_results_percentage,
    get_clean_sheets_percentage,
    verbosify_month_group,
)
from py_utils.data_analysis.transform import round_off_columns
from py_utils.django_utils.utils import queryset_to_dataframe


def get_goal_related_stats() -> pd.DataFrame:
    """Returns DataFrame having goal related stats over time (for all leagues, by month)"""
    qs_matches = LeagueMatch.objects.all()
    df = queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df['date'] = pd.to_datetime(arg=df['date'], format="%Y-%m-%d")
    df['month_group'] = df['date'].dt.strftime(date_format="%Y-%m")
    df_grs_over_time = pd.DataFrame(data={
        'games_played': df.groupby(by=['league', 'month_group']).apply(len),
        'avg_goals_scored': df.groupby(by=['league', 'month_group']).apply(get_goals_scored_per_match),
        'avg_goal_difference': df.groupby(by=['league', 'month_group']).apply(get_goal_difference_per_match),
        'percent_one_sided_games': df.groupby(by=['league', 'month_group']).apply(get_big_results_percentage, goal_margin=config.BIG_RESULT_GOAL_MARGIN),
        'percent_games_with_clean_sheets': df.groupby(by=['league', 'month_group']).apply(get_clean_sheets_percentage),
    }).reset_index()
    df_grs_over_time['month_group_verbose'] = df_grs_over_time['month_group'].apply(verbosify_month_group)
    df_grs_over_time.sort_values(by=['league', 'month_group'], ascending=[True, True], ignore_index=True, inplace=True)
    df_grs_over_time = round_off_columns(
        data=df_grs_over_time,
        columns=['avg_goals_scored', 'avg_goal_difference', 'percent_one_sided_games', 'percent_games_with_clean_sheets'],
        round_by=4,
    )
    column_order = [
        'league', 'month_group', 'month_group_verbose', 'games_played', 'avg_goals_scored',
        'avg_goal_difference', 'percent_one_sided_games', 'percent_games_with_clean_sheets',
    ]
    df_grs_over_time = df_grs_over_time.loc[:, column_order]
    return df_grs_over_time