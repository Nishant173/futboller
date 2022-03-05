LEAGUES = ['Bundesliga', 'EPL', 'La Liga', 'Ligue 1', 'Serie A']

LEAGUE_SEASONS_AVAILABLE = [
    "2009-10", "2010-11", "2011-12", "2012-13", "2013-14",
    "2014-15", "2015-16", "2016-17", "2017-18", "2018-19",
    "2019-20", "2020-21", "2021-22",
]

LEAGUE_TO_COUNTRY_MAPPER = {
    'Bundesliga': 'Germany',
    'EPL': 'England',
    'La Liga': 'Spain',
    'Ligue 1': 'France',
    'Serie A': 'Italy',
}

NUM_TEAMS_PER_SEASON = {
    'Bundesliga': 18,
    'EPL': 20,
    'La Liga': 20,
    'Ligue 1': 20,
    'Serie A': 20,   
}

NUM_GAMES_PER_SEASON = {
    'Bundesliga': 306,
    'EPL': 380,
    'La Liga': 380,
    'Ligue 1': 380,
    'Serie A': 380,   
}


# Used to map legacy team-names to Understat team-names
# Has keys = legacy team-names, and values = understat team-names
LEGACY_TO_UNDERSTAT_MAPPER = {
    'Ath Bilbao': 'Athletic Club',
    'Ath Madrid': 'Atletico Madrid',
    'Betis': 'Real Betis',
    'Celta': 'Celta Vigo',
    'Dortmund': 'Borussia Dortmund',
    'Ein Frankfurt': 'Eintracht Frankfurt',
    'Espanol': 'Espanyol',
    'FC Koln': 'FC Cologne',
    'Fortuna Dusseldorf': 'Fortuna Duesseldorf',
    'Hertha': 'Hertha Berlin',
    'Huesca': 'SD Huesca',
    'Leverkusen': 'Bayer Leverkusen',
    "M'gladbach": 'Borussia M.Gladbach',
    'Mainz': 'Mainz 05',
    'Man City': 'Manchester City',
    'Man United': 'Manchester United',
    'Milan': 'AC Milan',
    'Newcastle': 'Newcastle United',
    'Paris SG': 'Paris Saint Germain',
    'Parma': 'Parma Calcio 1913',
    'RB Leipzig': 'RasenBallsport Leipzig',
    'Sociedad': 'Real Sociedad',
    'Spal': 'SPAL 2013',
    'St Etienne': 'Saint-Etienne',
    'Stuttgart': 'VfB Stuttgart',
    'Valladolid': 'Real Valladolid',
    'West Brom': 'West Bromwich Albion',
    'Wolves': 'Wolverhampton Wanderers',
}