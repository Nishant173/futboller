import './App.css'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

import Navbar from './components/navbar/Navbar'
import Home from './containers/HomePage'
import LeagueStandings from './containers/LeagueStandings'
import CrossLeagueStandings from './containers/CrossLeagueStandings'


export default function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/league-standings" component={LeagueStandings} />
          <Route exact path="/cross-league-standings" component={CrossLeagueStandings} />
        </Switch>
      </Router>
    </div>
  )
}