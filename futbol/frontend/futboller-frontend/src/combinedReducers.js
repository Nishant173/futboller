import LeagueStandingsReducer from './store/reducers/LeagueStandingsReducer'
import LeagueMatchesReducer from './store/reducers/LeagueMatchesReducer'
import CrossLeagueStandingsReducer from './store/reducers/CrossLeagueStandingsReducer'
import GoalRelatedStatsReducer from './store/reducers/GoalRelatedStatsReducer'
import HeadToHeadStatsReducer from './store/reducers/HeadToHeadStatsReducer'
import PartitionedStatsReducer from './store/reducers/PartitionedStatsReducer'
import GeneralStatsReducer from './store/reducers/GeneralStatsReducer'
import ResultsTimelineReducer from './store/reducers/ResultsTimelineReducer'

const combinedReducers = {
    LeagueStandingsReducer: LeagueStandingsReducer,
    LeagueMatchesReducer: LeagueMatchesReducer,
    CrossLeagueStandingsReducer: CrossLeagueStandingsReducer,
    GoalRelatedStatsReducer: GoalRelatedStatsReducer,
    HeadToHeadStatsReducer: HeadToHeadStatsReducer,
    PartitionedStatsReducer: PartitionedStatsReducer,
    GeneralStatsReducer: GeneralStatsReducer,
    ResultsTimelineReducer: ResultsTimelineReducer,
}

export default combinedReducers