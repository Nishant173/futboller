import LeagueStandingsReducer from './store/reducers/LeagueStandingsReducer'
import CrossLeagueStandingsReducer from './store/reducers/CrossLeagueStandingsReducer'
import GoalRelatedStatsReducer from './store/reducers/GoalRelatedStatsReducer'
import HeadToHeadStatsReducer from './store/reducers/HeadToHeadStatsReducer'
import PartitionedStatsReducer from './store/reducers/PartitionedStatsReducer'

const combinedReducers = {
    LeagueStandingsReducer: LeagueStandingsReducer,
    CrossLeagueStandingsReducer: CrossLeagueStandingsReducer,
    GoalRelatedStatsReducer: GoalRelatedStatsReducer,
    HeadToHeadStatsReducer: HeadToHeadStatsReducer,
    PartitionedStatsReducer: PartitionedStatsReducer,
}

export default combinedReducers