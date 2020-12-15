VERSION_PREFIX = "/api/v1"

ENDPOINTS = [
    {
        "endpoint": f"{VERSION_PREFIX}/documentation/",
        "description": "Gets API documentation",
        "parameters": [],
        "example": f"{VERSION_PREFIX}/documentation/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{VERSION_PREFIX}/teams/",
        "description": "Gets list of all teams",
        "parameters": [
            {
                "name": "nameContains",
                "datatype": "str",
                "required": False,
                "description": "Filters teams by case-insensitive search",
            },
        ],
        "example": f"{VERSION_PREFIX}/teams/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{VERSION_PREFIX}/leagues/",
        "description": "Gets list of all leagues",
        "parameters": [],
        "example": f"{VERSION_PREFIX}/leagues/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{VERSION_PREFIX}/seasons/",
        "description": "Gets list of all seasons",
        "parameters": [],
        "example": f"{VERSION_PREFIX}/seasons/",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{VERSION_PREFIX}/league-matches/",
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
        "example": f"{VERSION_PREFIX}/league-matches/?league=EPL&season=2017-18&matchup=Arsenal,Chelsea",
        "methods": ["GET"],
    },
    {
        "endpoint": f"{VERSION_PREFIX}/league-standings/",
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
        "example": f"{VERSION_PREFIX}/league-standings/?league=Bundesliga&season=2012-13",
        "methods": ["GET"],
    },
]