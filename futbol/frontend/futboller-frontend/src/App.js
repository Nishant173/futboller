import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import LeagueTableView from './components/LeagueTableView';
import CrossLeagueTableView from './components/CrossLeagueTableView';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/league-standings" component={LeagueTableView} />
          <Route exact path="/cross-league-standings" component={CrossLeagueTableView} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;