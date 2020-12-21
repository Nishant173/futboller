import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import "./Navbar.css";


export default function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    };

    useEffect(() => {
        showButton();
    }, []);

    window.addEventListener("resize", showButton);
    
    return (
        <>
            <nav className="navbar">
                <nav className="navbar-container">
                    <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                        Futboller <i className="fab fa-typo3" />
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? "fas fa-times" : "fas fa-bars"} />
                    </div>

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