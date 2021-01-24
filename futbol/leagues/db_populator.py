'''
# Function calls to empty/populate the tables having league related data
from leagues.db_populator import (empty_league_related_tables,
                                  populate_league_related_tables,
                                  print_table_details)

empty_league_related_tables()
populate_league_related_tables()
print_table_details()
'''


from .load2db import (league_matches_to_db,
                      league_standings_to_db,
                      cross_league_standings_to_db)
from .models import LeagueMatch, LeagueStandings, CrossLeagueStandings
from py_utils.data_analysis.explore import is_full
from py_utils.django_utils.utils import queryset_to_dataframe


def empty_league_related_tables() -> None:
    """Empties tables having LeagueMatch, LeagueStandings and CrossLeagueStandings data"""
    qs_matches = LeagueMatch.objects.all()
    qs_standings = LeagueStandings.objects.all()
    qs_cls = CrossLeagueStandings.objects.all()
    qs_matches.delete()
    qs_standings.delete()
    qs_cls.delete()
    is_empty = ((len(qs_matches) == 0) & (len(qs_standings) == 0) & (len(qs_cls) == 0))
    if not is_empty:
        raise Exception("Error. Could not empty all league related tables in the database")
    print("Sucessfully emptied all league related tables in the database")
    return None


def populate_league_related_tables() -> None:
    """
    Populates tables having LeagueMatch, LeagueStandings and CrossLeagueStandings data.
    Note: Appends data to the respective table
    """
    league_matches_to_db(filepath="../data_ingestion/formatted_csv_datasets/Top5LeaguesDataAll.csv")
    league_standings_to_db()
    cross_league_standings_to_db()

    qs_matches = LeagueMatch.objects.all()
    qs_standings = LeagueStandings.objects.all()
    qs_cls = CrossLeagueStandings.objects.all()
    df_matches = queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df_standings = queryset_to_dataframe(qs=qs_standings, drop_id=True)
    df_cls = queryset_to_dataframe(qs=qs_cls, drop_id=True)
    is_fully_populated = (is_full(data=df_matches) & is_full(data=df_standings) & is_full(data=df_cls))
    if not is_fully_populated:
        raise Exception("Error. Could not fully populate all league related tables in the database")
    print("Sucessfully populated all league related tables in the database")
    return None


def print_table_details() -> None:
    qs_matches = LeagueMatch.objects.all()
    qs_standings = LeagueStandings.objects.all()
    qs_cls = CrossLeagueStandings.objects.all()
    df_matches = queryset_to_dataframe(qs=qs_matches, drop_id=True)
    df_standings = queryset_to_dataframe(qs=qs_standings, drop_id=True)
    df_cls = queryset_to_dataframe(qs=qs_cls, drop_id=True)
    df_matches.info()
    df_standings.info()
    df_cls.info()
    print(
        f"LeagueMatches shape: {df_matches.shape}",
        f"LeagueStandings shape: {df_standings.shape}",
        f"CrossLeagueStandings shape: {df_cls.shape}",
        f"LeagueMatches is full: {is_full(data=df_matches)}",
        f"LeagueStandings is full: {is_full(data=df_standings)}",
        f"CrossLeagueStandings is full: {is_full(data=df_cls)}",
        sep="\n\n",
    )
    return None