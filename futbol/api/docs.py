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
                "name": "offset",
                "datatype": "int",
                "required": False,
                "description": "Position of starting record in dataset. Default: 1",
            },
            {
                "name": "limit",
                "datatype": "int",
                "required": False,
                "description": "Number of records you want to retrieve. Maximum allowed limit is 25. Default: 25",
            },
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
                "name": "offset",
                "datatype": "int",
                "required": False,
                "description": "Position of starting record in dataset. Default: 1",
            },
            {
                "name": "limit",
                "datatype": "int",
                "required": False,
                "description": "Number of records you want to retrieve. Maximum allowed limit is 25. Default: 25",
            },
        ],
        "example": f"{API_VERSION}/leagues/cross-league-standings/?offset=30&limit=10",
        "methods": ["GET"],
    },
]