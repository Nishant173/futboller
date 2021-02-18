import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "./Navbar.css"


export default function Navbar() {
    const [click, setClick] = useState(false)
    const closeMobileMenu = () => setClick(false)
    
    return (
        <>
            <nav className="navbar">
                <nav className="navbar-container">
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        Futboller
                    </Link>

                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <Link to="/league-standings" className="nav-links" onClick={closeMobileMenu}>
                                Standings
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/league-h2h-stats" className="nav-links" onClick={closeMobileMenu}>
                                H2H
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/partitioned-stats" className="nav-links" onClick={closeMobileMenu}>
                                PartitionedStats
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/goal-related-stats" className="nav-links" onClick={closeMobileMenu}>
                                GoalRelatedStats
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/cross-league-standings" className="nav-links" onClick={closeMobileMenu}>
                                AcrossLeagues
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/cross-league-stats-by-team" className="nav-links" onClick={closeMobileMenu}>
                                AcrossLeaguesByTeam
                            </Link>
                        </li>
                    </ul>
                </nav>
            </nav>
        </>
    )
}