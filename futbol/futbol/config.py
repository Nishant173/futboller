'''
This file is for custom configurations and/or globally accessable constants/variables that can
be used throughout the project.
'''

API_VERSION = "api/v1"
DB_FILEPATH = "db.sqlite3"
TBL_LEAGUE_MATCHES = "leagues_leaguematch"
TBL_LEAGUE_STANDINGS = "leagues_leaguestandings"
TBL_CROSS_LEAGUE_STANDINGS = "leagues_crossleaguestandings"
TBL_GOAL_RELATED_STATS = "leagues_goalrelatedstats"
CURRENT_SEASON = '2020-21'
BIG_RESULT_GOAL_MARGIN = 3 # If goal difference in a match is >= this number, it is considered a big result

# For current season
NUM_TEAMS_BY_LEAGUE = {
    'Bundesliga': 18,
    'EPL': 20,
    'La Liga': 20,
    'Ligue 1': 20,
    'Serie A': 20,
}

NUM_GAMES_PER_TEAM_BY_LEAGUE = {
    league : ((num_teams - 1) * 2) for league, num_teams in NUM_TEAMS_BY_LEAGUE.items()
}