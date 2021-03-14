import React from 'react'
import { connect } from 'react-redux'

import * as CrossLeagueStandingsActions from '../../store/actions/CrossLeagueStandingsActions'
import { ScatterChart } from '../../components/charts/ScatterChart'
import { Loader } from '../../components/loaders/Loader'
import { GridTable } from '../../components/tables/Table'
import {
    ceil,
    generateRandomHexCode,
    getValuesByKey,
    max,
    maxOfAbsValues,
} from '../../jsUtils/general'
import { COLUMNS_CROSS_LEAGUE_TABLE, COLUMNS_CROSS_LEAGUE_STATS } from './tableColumns'


function sliceByPosition(array, start, stop) {
    return array.slice(start-1, stop)
}

function sliceTop80(array) {
    return sliceByPosition(array, 1, 80)
}


class CrossLeagueStandings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            wrangledDataObj: {},
        }
        this.updateWrangledData = this.updateWrangledData.bind(this)
    }

    updateData() {
        this.props.getCrossLeagueStandingsData()
    }

    updateWrangledData() {
        const { CLSData } = this.props
        this.setState({
            wrangledDataObj: {
                teams: getValuesByKey(CLSData, "team"),
                avgPoints: getValuesByKey(CLSData, "avgPoints"),
                avgGoalDifference: getValuesByKey(CLSData, "avgGoalDifference"),
                avgGoalsScored: getValuesByKey(CLSData, "avgGoalsScored"),
                avgGoalsAllowed: getValuesByKey(CLSData, "avgGoalsAllowed"),
            },
        })
    }

    componentDidMount() {
        this.updateData()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { CLSData } = this.props
        if (prevProps.CLSData !== CLSData && CLSData.length > 0) {
            this.updateWrangledData()
        }
    }

    render() {
        const { wrangledDataObj } = this.state
        const { CLSData, CLSDataApiStatus } = this.props
        const dataIsAvailable = (CLSData.length > 0 && Object.keys(wrangledDataObj).length > 0)

        return (
            <div>
                <h1>Cross League Standings - Top 5 Leagues</h1>
                <br />

                {
                    CLSDataApiStatus === 'initiated' ?
                    <Loader />
                    : null
                }

                {
                    dataIsAvailable ?
                    <>
                        <br /><br />
                        <GridTable
                            arrayOfObjects={CLSData}
                            columnsData={COLUMNS_CROSS_LEAGUE_TABLE}
                        />
                        <br /><br />
                        <GridTable
                            arrayOfObjects={CLSData}
                            columnsData={COLUMNS_CROSS_LEAGUE_STATS}
                        />
                        <br /><br />
                        <ScatterChart
                            title="AvgPoints vs AvgGoalDifference"
                            xLabel="AvgPoints"
                            yLabel="AvgGoalDifference"
                            arrayOfObjects={sliceTop80(CLSData)}
                            scatterLabelsArray={sliceTop80(wrangledDataObj['teams'])}
                            xObj="avgPoints"
                            yObj="avgGoalDifference"
                            xLow={0}
                            xHigh={ceil(max(sliceTop80(wrangledDataObj['avgPoints'])))}
                            yLow={-maxOfAbsValues(sliceTop80(wrangledDataObj['avgGoalDifference']))}
                            yHigh={maxOfAbsValues(sliceTop80(wrangledDataObj['avgGoalDifference']))}
                            color={generateRandomHexCode()}
                        />
                        <br /><br />
                        <ScatterChart
                            title="AvgGoalsScored vs AvgGoalsAllowed"
                            xLabel="AvgGoalsScored"
                            yLabel="AvgGoalsAllowed"
                            arrayOfObjects={sliceTop80(CLSData)}
                            scatterLabelsArray={sliceTop80(wrangledDataObj['teams'])}
                            xObj="avgGoalsScored"
                            yObj="avgGoalsAllowed"
                            xLow={0}
                            xHigh={ceil(max(sliceTop80(wrangledDataObj['avgGoalsScored'])))}
                            yLow={0}
                            yHigh={ceil(max(sliceTop80(wrangledDataObj['avgGoalsAllowed'])))}
                            color={generateRandomHexCode()}
                        />
                    </>
                    : null
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        CLSData: state.CrossLeagueStandingsReducer.CLSData,
        CLSDataApiStatus: state.CrossLeagueStandingsReducer.CLSDataApiStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getCrossLeagueStandingsData: () => {
            dispatch(CrossLeagueStandingsActions.getCrossLeagueStandingsData())
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CrossLeagueStandings)