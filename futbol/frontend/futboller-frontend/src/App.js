import './App.css'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Navbar from './components/navbar/Navbar'
import Home from './containers/HomePage'
import LeagueStandings from './containers/LeagueStandings'
import LeagueHeadToHeadStats from './containers/LeagueHeadToHeadStats'
import PartitionedStatsByTeam from './containers/PartitionedStatsByTeam'
import GoalRelatedStatsOverTime from './containers/GoalRelatedStatsOverTime'
import CrossLeagueStandings from './containers/CrossLeagueStandings'
import CrossLeagueStatsByTeam from './containers/CrossLeagueStatsByTeam'


export default function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/league-standings" component={LeagueStandings} />
          <Route exact path="/league-h2h-stats" component={LeagueHeadToHeadStats} />
          <Route exact path="/partitioned-stats" component={PartitionedStatsByTeam} />
          <Route exact path="/goal-related-stats" component={GoalRelatedStatsOverTime} />
          <Route exact path="/cross-league-standings" component={CrossLeagueStandings} />
          <Route exact path="/cross-league-stats-by-team" component={CrossLeagueStatsByTeam} />
        </Switch>
      </Router>
    </div>
  )
}