import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import LeagueStandingsView from './components/LeagueStandingsView';
import CrossLeagueStandingsView from './components/CrossLeagueStandingsView';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/league-standings" component={LeagueStandingsView} />
          <Route exact path="/cross-league-standings" component={CrossLeagueStandingsView} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;