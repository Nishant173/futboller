import React from 'react'
import { connect } from 'react-redux'
import { Button, Dropdown, Menu } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import * as ResultsTimelineActions from '../../store/actions/ResultsTimelineActions'
import { Loader } from '../../components/loaders/Loader'
import { ScatterChart } from '../../components/charts/ScatterChart'
import { getMonthMapper } from '../../jsUtils/datetimes'
import { getValuesByKey } from '../../jsUtils/general'
import { CONTAINER_STYLES, RESULT_STRING_COLOR_MAPPER } from '../../config'

import TEAM_NAMES_BY_LEAGUE from '../../TeamsByLeague.json'
import LEAGUE_NAMES from '../../Leagues.json'
import SEASON_NAMES from '../../Seasons.json'


const { SubMenu } = Menu

const DEFAULTS = {
    team: 'Real Madrid',
    season: '2018-19',
}


// Used to add matchday field to the results-timeline array, for x-axis of scatter chart
function addMatchdayField(resultsTimelineArray, fieldName) {
    let resultsTimelineWithMatchday = []
    let matchday = 1
    for (let row of resultsTimelineArray) {
        row[fieldName] = matchday
        resultsTimelineWithMatchday.push(row)
        matchday += 1
    }
    return resultsTimelineWithMatchday
}


// Returns array of colors to use in scatter chart. Color corresponds to the goal difference
function getColorsFromGoalDifferences(goalDifferences) {
    let colors = []
    for (let gd of goalDifferences) {
        if (gd > 0) {
            colors.push(RESULT_STRING_COLOR_MAPPER['W'])
        }
        else if (gd < 0) {
            colors.push(RESULT_STRING_COLOR_MAPPER['L'])
        }
        else {
            colors.push(RESULT_STRING_COLOR_MAPPER['D'])
        }
    }
    return colors
}


// Takes date-string of format "yyyy-mm-dd"
function prettifyDateString(dateString) {
    const mapMonthNumberToName = getMonthMapper()
    let [year, month, day] = dateString.split('-')
    month = mapMonthNumberToName[parseInt(month)]
    return `${day} ${month}, ${year}`
}


// Returns an array having the details to be displayed on hovering over the scatter points
function getScatterLabelsArray(resultsTimelineArray) {
    let scatterLabelsArray = []
    for (let row of resultsTimelineArray) {
        const scatterLabel = `${row.homeTeam} ${row.homeGoals}-${row.awayGoals} ${row.awayTeam} (${prettifyDateString(row.date)})`
        scatterLabelsArray.push(scatterLabel)
    }
    return scatterLabelsArray
}


class ResultsTimeline extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            team: DEFAULTS.team,
            season: DEFAULTS.season,
            wrangledDataObj: {},
        }
        this.updateTeam = this.updateTeam.bind(this)
        this.updateSeason = this.updateSeason.bind(this)
        this.updateData = this.updateData.bind(this)
        this.updateWrangledData = this.updateWrangledData.bind(this)
    }

    updateTeam(event) {
        this.setState({
            team: event.key,
        })
    }

    updateSeason(event) {
        this.setState({
            season: event.key,
        })
    }

    updateData() {
        const { team, season } = this.state
        this.props.getResultsTimelineData({
            team: team,
            season: season,
        })
    }

    updateWrangledData() {
        const { ResultsTimelineData, ResultsTimelineDataApiStatus } = this.props
        if (ResultsTimelineData.length > 0 && ResultsTimelineDataApiStatus === 'success') {
            const goalDifferences = getValuesByKey(ResultsTimelineData, "goalDifference")
            this.setState({
                wrangledDataObj: {
                    teamOfInterest: ResultsTimelineData[0]['teamOfInterest'],
                    colorsArray: getColorsFromGoalDifferences(goalDifferences),
                    scatterLabelsArray: getScatterLabelsArray(ResultsTimelineData),
                },
            })
        }
    }

    componentDidMount() {
        this.updateData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { ResultsTimelineData } = this.props
        if (prevProps.ResultsTimelineData !== ResultsTimelineData && ResultsTimelineData.length > 0) {
            this.updateWrangledData()
        }
    }

    render() {
        const { ResultsTimelineData, ResultsTimelineDataApiStatus } = this.props
        const { wrangledDataObj } = this.state
        const dataIsAvailable = (ResultsTimelineData.length > 0)

        const seasonsMenu = (
            <Menu>
                {
                    SEASON_NAMES.reverse().map((season) => (
                        <Menu.Item key={season} onClick={this.updateSeason}>
                            <p>
                                { season }
                                &nbsp;
                                { this.state.season === season ? <SelectOutlined /> : null }
                            </p>
                        </Menu.Item>
                    ))
                }
            </Menu>
        )
        const teamsMenu = (
            <Menu>
                {
                    LEAGUE_NAMES.map((league) => (
                        <SubMenu title={league}>
                            {
                                TEAM_NAMES_BY_LEAGUE[league].map((team) => (
                                    <Menu.Item key={team} onClick={this.updateTeam}>
                                        <p>
                                            { team }
                                            &nbsp;
                                            { this.state.team === team ? <SelectOutlined /> : null }
                                        </p>
                                    </Menu.Item>
                                ))
                            }
                        </SubMenu>
                    ))
                }
            </Menu>
        )

        return (
            <div style={CONTAINER_STYLES}>
                <h1>Results Timeline (by team) - Top 5 Leagues</h1>
                <br />

                <Dropdown overlay={teamsMenu}>
                    <Button>{this.state.team === "" ? "Team" : this.state.team}</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <Dropdown overlay={seasonsMenu}>
                    <Button>{this.state.season === "" ? "Season" : this.state.season}</Button>
                </Dropdown>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.updateData} disabled={false}>
                    Fetch data
                </Button>

                {
                    ResultsTimelineDataApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                    dataIsAvailable ?
                    <div style={{paddingLeft: '10%', paddingRight: '10%'}}>
                        <br />
                        <ScatterChart
                            title={`Results Timeline - ${wrangledDataObj['teamOfInterest']}`}
                            xLabel="Matchday"
                            yLabel="GoalDifference"
                            arrayOfObjects={addMatchdayField(ResultsTimelineData, "matchday")}
                            scatterLabelsArray={wrangledDataObj['scatterLabelsArray']}
                            xObj="matchday"
                            yObj="goalDifference"
                            color={wrangledDataObj['colorsArray']}
                        />
                    </div>
                    : null
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        ResultsTimelineData: state.ResultsTimelineReducer.ResultsTimelineData,
        ResultsTimelineDataApiStatus: state.ResultsTimelineReducer.ResultsTimelineDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getResultsTimelineData: (objQueryParams) => {
            dispatch(ResultsTimelineActions.getResultsTimelineData(objQueryParams))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsTimeline)