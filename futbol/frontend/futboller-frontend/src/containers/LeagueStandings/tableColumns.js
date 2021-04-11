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
        width: 'fixed',
        grow: 1.6,
    },
    {
        selector: 'resultsString',
        name: 'Form',
        sortable: false,
        left: true,
        width: '140px',
        cell: row => (
            <div>
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
    },
    {
        selector: 'points',
        name: 'Points',
        sortable: true,
        right: true,
    },
    {
        selector: 'goalDifference',
        name: 'GoalDifference',
        sortable: true,
        right: true,
    },
    {
        selector: 'goalsScored',
        name: 'GoalsScored',
        sortable: true,
        right: true,
    },
    {
        selector: 'goalsAllowed',
        name: 'GoalsAllowed',
        sortable: true,
        right: true,
    },
    {
        selector: 'cleanSheets',
        name: 'CleanSheetsFor',
        sortable: true,
        right: true,
    },
    {
        selector: 'cleanSheetsAgainst',
        name: 'CleanSheetsAgainst',
        sortable: true,
        right: true,
    },
    {
        selector: 'bigWins',
        name: 'BigWins',
        sortable: true,
        right: true,
    },
    {
        selector: 'bigLosses',
        name: 'BigLosses',
        sortable: true,
        right: true,
    },
]