//Header.js
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
require('./Header.css');

export default class Header extends Component {

    render() {
        return (
                <header className="Header">
                    <div className="Header-container">
                        <Link to="/content/wknd-spa-react/us/en/home.html">
                            <h1>WKND</h1>
                        </Link>
                        
                    </div>
                </header>
        );
    }
}

