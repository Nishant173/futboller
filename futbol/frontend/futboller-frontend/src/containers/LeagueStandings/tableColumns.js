import { RESULT_STRING_COLOR_MAPPER } from './../../config'


export const COLUMNS_LEAGUE_TABLE = [
    {
        selector: 'position',
        name: 'Position',
        sortable: true,
        right: true,
    },
    {
        selector: 'team',
        name: 'Team',
        sortable: true,
        left: true,
        width: '200px',
        grow: 1.6,
    },
    {
        selector: 'resultsString',
        name: 'Form',
        sortable: false,
        left: true,
        width: '140px',
        cell: row => (
            <div style={{marginTop: '5%'}}>
                {
                    row['resultsString'].slice(-5).split('').map((resultString) => (
                        <>
                            <span
                                style={
                                    {
                                        'backgroundColor': RESULT_STRING_COLOR_MAPPER[resultString],
                                        'display': 'inline-block',
                                        'height': '15px',
                                        'width': '15px',
                                        'borderRadius': '50%',
                                    }
                                }
                            />
                            &nbsp;
                        </>
                    ))
                }
            </div>
        ),
    },
    {
        selector: 'gamesPlayed',
        name: 'GamesPlayed',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'points',
        name: 'Points',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'goalDifference',
        name: 'GoalDifference',
        sortable: true,
        right: true,
        width: '150px',
    },
    {
        selector: 'wins',
        name: 'Wins',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'losses',
        name: 'Losses',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'draws',
        name: 'Draws',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'goalsScored',
        name: 'GoalsScored',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'goalsAllowed',
        name: 'GoalsAllowed',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'cleanSheets',
        name: 'CleanSheetsFor',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'cleanSheetsAgainst',
        name: 'CleanSheetsAgainst',
        sortable: true,
        right: true,
        width: '150px',
    },
    {
        selector: 'bigWins',
        name: 'BigWins',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'bigLosses',
        name: 'BigLosses',
        sortable: true,
        right: true,
        width: '100px',
    },
    {
        selector: 'longestUnbeatenStreak',
        name: 'LongestUnbeatenStreak',
        sortable: true,
        right: true,
        width: '150px',
    },
    {
        selector: 'longestWinStreak',
        name: 'LongestWinStreak',
        sortable: true,
        right: true,
        width: '150px',
    },
    {
        selector: 'longestLossStreak',
        name: 'LongestLossStreak',
        sortable: true,
        right: true,
        width: '150px',
    },
    {
        selector: 'longestDrawStreak',
        name: 'LongestDrawStreak',
        sortable: true,
        right: true,
        width: '150px',
    },
]