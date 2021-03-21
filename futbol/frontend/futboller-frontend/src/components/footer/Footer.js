import React from 'react'
import {
    CopyrightCircleOutlined,
    GithubOutlined,
    TwitterOutlined,
} from '@ant-design/icons'
import './Footer.css'

import { CURRENT_YEAR, SITE_NAME } from './../../config'


export default function Footer() {
    return (
        <footer className="footer">
            <div>
                <a target="_blank" rel="noreferrer" href="https://github.com/Nishant173">
                    <GithubOutlined style={{fontSize: '24px'}} />
                </a>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <a target="_blank" rel="noreferrer" href="https://twitter.com/nishant173">
                    <TwitterOutlined style={{fontSize: '24px'}} />
                </a>
                <br />
                <h4 style={{color: 'whitesmoke', fontFamily: "inherit"}}>
                    <CopyrightCircleOutlined /> {SITE_NAME} {CURRENT_YEAR}
                </h4>
            </div>
        </footer>
    )
}