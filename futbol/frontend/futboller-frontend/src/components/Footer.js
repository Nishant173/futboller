import React from 'react';
import { Link } from "react-router-dom";
import { Button } from './Button';
import "./Footer.css";


export default function Footer() {
    return (
        <div className="footer-container">
            {/* <div className="footer-links">
                <div className="footer-link-wrapper">
                    <div className="footer-link-items">
                        <h2>About</h2>
                        <Link to="/sign-up">Sign up</Link>
                        <Link to="/">Some dead link</Link>
                        <Link to="/">Some dead link</Link>
                        <Link to="/">Some dead link</Link>
                        <Link to="/">Some dead link</Link>
                    </div>
                </div>
            </div> */}

            <section className="social-media">
                <div className="social-media-wrap">
                    <div className="footer-logo">
                        <Link className="social-logo" to="/">
                            Futboller <i className="fab fa-typo3"></i>
                        </Link>
                    </div>
                    <small className="website-rights">
                        Futboller Copyright 2020
                    </small>
                    <Link
                        className="social-icon-link twitter"
                        to="https://twitter.com/nishant173"
                        target="_blank"
                        aria-label="Twitter"
                    >
                        <i className="fab fa-twitter" />
                    </Link>
                    <Link
                        className="social-icon-link linkedin"
                        to="https://www.linkedin.com/in/nishant-rao-4b086a113/"
                        target="_blank"
                        aria-label="LinkedIn"
                    >
                        <i className="fab fa-linkedin" />
                    </Link>
                </div>
            </section>

        </div>
    )
}