export const COLUMNS_PARTITIONED_STATS_BY_TEAM = [
    {
        selector: 'partitionNumber',
        name: 'Partition',
        sortable: true,
        right: true,
    },
    {
        selector: 'team',
        name: 'Team',
        sortable: true,
        left: true,
        width: 'fixed',
    },
    {
        selector: 'gamesPlayed',
        name: 'GamesPlayed',
        sortable: true,
        right: true,
    },
    {
        selector: 'startDate',
        name: 'StartDate',
        right: true,
    },
    {
        selector: 'endDate',
        name: 'EndDate',
        right: true,
    },
    {
        selector: 'avgPoints',
        name: 'AvgPoints',
        sortable: true,
        right: true,
    },
    {
        selector: 'avgGoalDifference',
        name: 'AvgGoalDifference',
        sortable: true,
        right: true,
    },
    {
        selector: 'winPercent',
        name: 'WinPercent',
        sortable: true,
        right: true,
    },
    {
        selector: 'lossPercent',
        name: 'LossPercent',
        sortable: true,
        right: true,
    },
    {
        selector: 'drawPercent',
        name: 'DrawPercent',
        sortable: true,
        right: true,
    },
]