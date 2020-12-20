import React, { useState } from 'react';
import LeagueDataTable from './LeagueDataTable';
import { LeagueTableBarChart, LeagueGoalDifferenceBarChart } from './LeagueCharts';
import { ColumnsLeagueResults, ColumnsLeagueTable, ColumnsLeagueStats } from './Columns';
import { getLeagueStandings } from '../api/getData';


export default function LeagueTableView() {
    const [data, setData] = useState([]);
    const [league, setLeague] = useState("");
    const [season, setSeason] = useState("");
    const updateLeague = event => setLeague(event.target.value);
    const updateSeason = event => setSeason(event.target.value);
    const updateData = () => {
        getLeagueStandings(league, season)
            .then(function(response) {
                setData(response);
            })
    }

    return (
        <div>
            <h1>League Tables - Top 5 Leagues</h1>
            <br />

            <h3>Enter league and season</h3>
            <form className="league-table-form">
                <select name="league" onChange={updateLeague}>
                    <option>-</option>
                    <option value="EPL">EPL</option>
                    <option value="Bundesliga">Bundesliga</option>
                    <option value="La Liga">La Liga</option>
                    <option value="Ligue 1">Ligue 1</option>
                    <option value="Serie A">Serie A</option>
                </select>
                <select name="season" onChange={updateSeason}>
                    <option>-</option>
                    <option value="2009-10">2009-10</option>
                    <option value="2010-11">2010-11</option>
                    <option value="2011-12">2011-12</option>
                    <option value="2012-13">2012-13</option>
                    <option value="2013-14">2013-14</option>
                    <option value="2014-15">2014-15</option>
                    <option value="2015-16">2015-16</option>
                    <option value="2016-17">2016-17</option>
                    <option value="2017-18">2017-18</option>
                    <option value="2018-19">2018-19</option>
                </select>
                <input
                    type="button"
                    value="Update"
                    onClick={updateData}
                />
            </form>

            <br /><br />
            {/* { data.length > 0 ? <LeagueDataTable dataObj={data} columnsObj={ColumnsLeagueTable} /> : null }
            <br /><br /> */}
            { data.length > 0 ? <LeagueTableBarChart dataObj={data} /> : null }
            <br /><br />
            { data.length > 0 ? <LeagueGoalDifferenceBarChart dataObj={data} /> : null }
            <br /><br />
        </div>
    )
}