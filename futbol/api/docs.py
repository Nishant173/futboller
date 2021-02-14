from futbol.config import API_VERSION


ENDPOINTS = [
    {
        "endpoint": f"{API_VERSION}/documentation/",
        "description": "Gets API documentation",
        "parameters": [],
        "example": f"{API_VERSION}/documentation/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/teams/",
        "description": "Gets list of all teams",
        "parameters": [
            {
                "name": "nameContains",
                "datatype": "str",
                "required": False,
                "description": "Filters teams by case-insensitive search",
            },
        ],
        "example": f"{API_VERSION}/leagues/teams/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/leagues/",
        "description": "Gets list of all leagues",
        "parameters": [],
        "example": f"{API_VERSION}/leagues/leagues/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/seasons/",
        "description": "Gets list of all seasons",
        "parameters": [],
        "example": f"{API_VERSION}/leagues/seasons/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/league-matches/",
        "description": "Gets list of league matches (filter parameters are allowed)",
        "parameters": [
            {
                "name": "team",
                "datatype": "str",
                "required": False,
            },
            {
                "name": "league",
                "datatype": "str",
                "required": False,
            },
            {
                "name": "season",
                "datatype": "str",
                "required": False,
            },
            {
                "name": "goalDifference",
                "datatype": "int",
                "required": False,
            },
            {
                "name": "minGoalDifference",
                "datatype": "int",
                "required": False,
            },
            {
                "name": "maxGoalDifference",
                "datatype": "int",
                "required": False,
            },
            {
                "name": "matchup",
                "datatype": "str",
                "required": False,
                "description": "Filters matches by head-to-head matchup between 2 teams",
                "format": "<team1>,<team2>",
            },
            {
                "name": "winningTeam",
                "datatype": "str",
                "required": False,
            },
            {
                "name": "losingTeam",
                "datatype": "str",
                "required": False,
            },
        ],
        "example": f"{API_VERSION}/leagues/league-matches/?league=EPL&season=2017-18&matchup=Arsenal,Chelsea",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/head-to-head-stats/",
        "description": "Gets list having head-to-head-stats (based on matchup)",
        "parameters": [
            {
                "name": "matchup",
                "datatype": "str",
                "required": True,
            },
        ],
        "example": f"{API_VERSION}/leagues/head-to-head-stats/?matchup=Manchester United,Manchester City",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/partitioned-stats/",
        "description": "Gets list having partitioned-stats (by team). The partitions will be in ascending order of date",
        "parameters": [
            {
                "name": "team",
                "datatype": "str",
                "required": True,
            },
        ],
        "example": f"{API_VERSION}/leagues/partitioned-stats/?team=Manchester United",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/goal-scoring-stats/",
        "description": "Gets dictionary having goal scoring stats over time (by leagues). Keys = league name, and values = list of goal scoring stats over time",
        "parameters": [],
        "example": f"{API_VERSION}/leagues/goal-scoring-stats/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/goal-difference-stats/",
        "description": "Gets dictionary having goal difference stats over time (by leagues). Keys = league name, and values = list of goal difference stats over time",
        "parameters": [],
        "example": f"{API_VERSION}/leagues/goal-difference-stats/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/league-standings/",
        "description": "Gets list having league-standings (based on parameters)",
        "parameters": [
            {
                "name": "league",
                "datatype": "str",
                "required": True,
            },
            {
                "name": "season",
                "datatype": "str",
                "required": True,
            },
        ],
        "example": f"{API_VERSION}/leagues/league-standings/?league=Bundesliga&season=2012-13",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{API_VERSION}/leagues/cross-league-standings/",
        "description": "Gets list having cross-league-standings",
        "parameters": [
            {
                "name": "team",
                "datatype": "str",
                "required": False,
            },
            {
                "name": "league",
                "datatype": "str",
                "required": False,
            },
        ],
        "example": f"{API_VERSION}/leagues/cross-league-standings/?league=EPL&team=Arsenal",
        "methods": ["GET"],
    },
]