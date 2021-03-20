import React from 'react'
import { connect } from 'react-redux'
import { Card, Statistic, Row, Col } from 'antd'

import * as GeneralStatsActions from '../../store/actions/GeneralStatsActions'
import { Loader } from '../../components/loaders/Loader'


class Home extends React.Component {
    
    updateData() {
        this.props.getGeneralStatsData()
    }

    componentDidMount() {
        this.updateData()
    }

    render() {
        const { GeneralStatsData, GeneralStatsDataApiStatus } = this.props
        const dataIsAvailable = (Object.keys(GeneralStatsData).length > 0)
        let numUniqueTeamsByLeague = {}
        let avgGoalsScoredByLeague = {}
        let avgGoalDifferenceByLeague = {}
        let currentSeasonLeagueLeaders = {}
        if (dataIsAvailable) {
            numUniqueTeamsByLeague = GeneralStatsData['numUniqueTeamsByLeague']
            avgGoalsScoredByLeague = GeneralStatsData['avgGoalsScoredByLeague']
            avgGoalDifferenceByLeague = GeneralStatsData['avgGoalDifferenceByLeague']
            currentSeasonLeagueLeaders = GeneralStatsData['currentSeasonLeagueLeaders']
        }

        return (
            <Card>
                { GeneralStatsDataApiStatus === 'initiated' ? <Loader /> : null }
                {
                    dataIsAvailable ?
                    <>
                        <h3>General stats</h3>
                        <Row>
                            <Col span={8}>
                                <Statistic title="Number of league matches in database" value={GeneralStatsData['numLeagueMatchesInDb']} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Date of first collected record" value={GeneralStatsData['dateOfFirstCollectedRecord']} />
                            </Col>
                            <Col span={8}>
                                <Statistic title="Date of last collected record" value={GeneralStatsData['dateOfLastCollectedRecord']} />
                            </Col>
                        </Row>
                        <br />
                        <h3>Number of teams over the years</h3>
                        <Row>
                            <Col span={4}>
                                <Statistic title="Bundesliga" value={numUniqueTeamsByLeague['Bundesliga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="EPL" value={numUniqueTeamsByLeague['EPL']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="La Liga" value={numUniqueTeamsByLeague['La Liga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Ligue 1" value={numUniqueTeamsByLeague['Ligue 1']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Serie A" value={numUniqueTeamsByLeague['Serie A']} />
                            </Col>
                        </Row>
                        <br />
                        <h3>Goals scored per game</h3>
                        <Row>
                            <Col span={4}>
                                <Statistic title="Bundesliga" value={avgGoalsScoredByLeague['Bundesliga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="EPL" value={avgGoalsScoredByLeague['EPL']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="La Liga" value={avgGoalsScoredByLeague['La Liga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Ligue 1" value={avgGoalsScoredByLeague['Ligue 1']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Serie A" value={avgGoalsScoredByLeague['Serie A']} />
                            </Col>
                        </Row>
                        <br />
                        <h3>Goal difference per game</h3>
                        <Row>
                            <Col span={4}>
                                <Statistic title="Bundesliga" value={avgGoalDifferenceByLeague['Bundesliga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="EPL" value={avgGoalDifferenceByLeague['EPL']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="La Liga" value={avgGoalDifferenceByLeague['La Liga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Ligue 1" value={avgGoalDifferenceByLeague['Ligue 1']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Serie A" value={avgGoalDifferenceByLeague['Serie A']} />
                            </Col>
                        </Row>
                        <br />
                        <h3>Current season's league leader</h3>
                        <Row style={{alignItems: 'center'}}>
                            <Col span={4}>
                                <Statistic title="Bundesliga" value={currentSeasonLeagueLeaders['Bundesliga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="EPL" value={currentSeasonLeagueLeaders['EPL']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="La Liga" value={currentSeasonLeagueLeaders['La Liga']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Ligue 1" value={currentSeasonLeagueLeaders['Ligue 1']} />
                            </Col>
                            <Col span={5}>
                                <Statistic title="Serie A" value={currentSeasonLeagueLeaders['Serie A']} />
                            </Col>
                        </Row>
                    </>
                    : null
                }
            </Card>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        GeneralStatsData: state.GeneralStatsReducer.GeneralStatsData,
        GeneralStatsDataApiStatus: state.GeneralStatsReducer.GeneralStatsDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getGeneralStatsData: () => {
            dispatch(GeneralStatsActions.getGeneralStatsData())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)