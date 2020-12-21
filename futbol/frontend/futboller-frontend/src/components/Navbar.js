import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.css";


export default function Navbar() {
    const [click, setClick] = useState(false);
    const closeMobileMenu = () => setClick(false);
    
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
                                LeagueStandings
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/cross-league-standings" className="nav-links" onClick={closeMobileMenu}>
                                CrossLeagueStandings
                            </Link>
                        </li>
                    </ul>
                </nav>
            </nav>
        </>
    )
}