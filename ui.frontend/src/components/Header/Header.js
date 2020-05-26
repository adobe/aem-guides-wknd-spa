//Header.js
import React, {Component} from 'react';
import wkndLogoDark from '../../media/wknd-logo-dk.png';
require('./Header.scss');
export default class Header extends Component {

    get logo() {
        return (
            <div className="Logo">
                <img className="Logo-img" src={wkndLogoDark} alt="WKND SPA" />
            </div>
        );
    }

    render() {
        return (
                <header className="Header">
                    <div className="Header-container">
                        {this.logo}
                    </div>
                </header>
        );
    }
}