export const COLUMNS_LEAGUE_TABLE = [
    {
        field: 'position',
        headerName: 'Position',
        type: 'number',
        width: 150,
    },
    {
        field: 'team',
        headerName: 'Team',
        width: 200,
    },
    {
        field: 'gamesPlayed',
        headerName: 'GamesPlayed',
        type: 'number',
        width: 150,
    },
    {
        field: 'points',
        headerName: 'Points',
        type: 'number',
        width: 150,
    },
    {
        field: 'goalDifference',
        headerName: 'GoalDifference',
        type: 'number',
        width: 150,
    },
    {
        field: 'resultsString',
        headerName: 'Results',
        width: 500,
    },
]


export const COLUMNS_LEAGUE_STATS = [
    {
        field: 'position',
        headerName: 'Position',
        type: 'number',
        width: 150,
    },
    {
        field: 'team',
        headerName: 'Team',
        width: 200,
    },
    {
        field: 'goalsScored',
        headerName: 'GoalsScored',
        type: 'number',
        width: 150,
    },
    {
        field: 'goalsAllowed',
        headerName: 'GoalsAllowed',
        type: 'number',
        width: 150,
    },
    {
        field: 'cleanSheets',
        headerName: 'CleanSheetsFor',
        type: 'number',
        width: 200,
    },
    {
        field: 'cleanSheetsAgainst',
        headerName: 'CleanSheetsAgainst',
        type: 'number',
        width: 200,
    },
    {
        field: 'bigWins',
        headerName: 'BigWins',
        type: 'number',
        width: 150,
    },
    {
        field: 'bigLosses',
        headerName: 'BigLosses',
        type: 'number',
        width: 150,
    },
]


export const COLUMNS_EXCEL_LEAGUE_DATA = COLUMNS_LEAGUE_TABLE.concat(COLUMNS_LEAGUE_STATS.slice(2))