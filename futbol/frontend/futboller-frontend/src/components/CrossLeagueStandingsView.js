import React, { useState } from 'react';
import { CrossLeagueScatterChart } from './CrossLeagueCharts';
import { getCrossLeagueStandings } from '../api/getData';


export default function CrossLeagueStandingsView() {
    const [data, setData] = useState([]);
    const updateData = () => {
        getCrossLeagueStandings()
            .then(function(response) {
                setData(response);
            })
    }

    return (
        <div>
            <h1>Cross League Standings - Top 5 Leagues</h1>
            <br />

            <form className="cross-league-table-form">
                <input
                    type="button"
                    value="Re-load"
                    onClick={updateData}
                />
            </form>

            <br /><br />
            { data.length > 0 ? <CrossLeagueScatterChart dataObj={data} /> : null }
            <br /><br />
        </div>
    )
}