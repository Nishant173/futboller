import React from 'react'
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
import { Menu } from 'antd'
import { HomeFilled } from '@ant-design/icons'
import 'antd/dist/antd.css'

import { SITE_NAME } from './../../config'
import Home from './../../containers/HomePage'
import LeagueStandings from './../../containers/LeagueStandings'
import LeagueHeadToHeadStats from './../../containers/LeagueHeadToHeadStats'
import PartitionedStatsByTeam from './../../containers/PartitionedStatsByTeam'
import GoalRelatedStatsOverTime from './../../containers/GoalRelatedStatsOverTime'
import CrossLeagueStandings from './../../containers/CrossLeagueStandings'
import CrossLeagueStatsByTeam from './../../containers/CrossLeagueStatsByTeam'


const { SubMenu } = Menu


export default class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedPage: 'home',
        }

        this.updateSelectedPage = this.updateSelectedPage.bind(this)
    }

    updateSelectedPage(event) {
        this.setState({ selectedPage: event.key })
    }

    render() {
        const { selectedPage } = this.state

        return (
            <BrowserRouter>
                <Menu
                    onClick={this.updateSelectedPage}
                    selectedKeys={[selectedPage]}
                    mode="horizontal"
                >
                    <Menu.Item onClick={this.updateSelectedPage} key="home" icon={<HomeFilled />}>
                        <Link key="home" to="/">
                            { SITE_NAME }
                        </Link>
                    </Menu.Item>

                    <SubMenu onClick={this.updateSelectedPage} key="submenu-leagues" title="Leagues">
                        <Menu.ItemGroup onClick={this.updateSelectedPage} title="By league">
                            <Menu.Item onClick={this.updateSelectedPage} key="league-standings">
                                <Link key="league-standings" to="/league-standings">
                                    League Standings
                                </Link>
                            </Menu.Item>
                            <Menu.Item onClick={this.updateSelectedPage} key="league-h2h-stats">
                                <Link key="league-h2h-stats" to="/league-h2h-stats">
                                    Head-to-head stats
                                </Link>
                            </Menu.Item>
                            <Menu.Item onClick={this.updateSelectedPage} key="partitioned-stats">
                                <Link key="partitioned-stats" to="/partitioned-stats">
                                    Partitioned Stats (by team)
                                </Link>
                            </Menu.Item>
                            <Menu.Item onClick={this.updateSelectedPage} key="goal-related-stats">
                                <Link key="goal-related-stats" to="/goal-related-stats">
                                    Goal Related Stats
                                </Link>
                            </Menu.Item>
                        </Menu.ItemGroup>

                        <Menu.ItemGroup onClick={this.updateSelectedPage} title="Across leagues">
                            <Menu.Item onClick={this.updateSelectedPage} key="cross-league-standings">
                                <Link key="cross-league-standings" to="/cross-league-standings">
                                    Cross League Standings
                                </Link>
                            </Menu.Item>
                            <Menu.Item onClick={this.updateSelectedPage} key="cross-league-stats-by-team">
                                <Link key="cross-league-stats-by-team" to="/cross-league-stats-by-team">
                                    Cross League Stats (by team)
                                </Link>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </SubMenu>
                </Menu>

                <Switch>
                    <Route exact={true} path="/" component={Home} />
                    <Route exact={true} path="/league-standings" component={LeagueStandings} />
                    <Route exact={true} path="/league-h2h-stats" component={LeagueHeadToHeadStats} />
                    <Route exact={true} path="/partitioned-stats" component={PartitionedStatsByTeam} />
                    <Route exact={true} path="/goal-related-stats" component={GoalRelatedStatsOverTime} />
                    <Route exact={true} path="/cross-league-standings" component={CrossLeagueStandings} />
                    <Route exact={true} path="/cross-league-stats-by-team" component={CrossLeagueStatsByTeam} />
                </Switch>
            </BrowserRouter>
        )
    }
}