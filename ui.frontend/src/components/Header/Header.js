import React, {Component} from 'react';
import wkndLogoDark from '../../media/wknd-logo-dk.png';
import backIcon from '../../media/icon-back.svg';
import {MapTo} from '@adobe/cq-react-editable-components';
import { withRouter } from "react-router";
import {Link} from "react-router-dom";

require('./Header.scss');

export const HeaderEditConfig = {

    emptyLabel: 'Header',

    isEmpty: function(props) {
        return !props || !props.items || props.items.length < 1;
    }
};

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {isMenuOpen: false};
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.goBack = this.handleBackClick.bind(this);
    }

    /* Update the state when the menu is clicked */
    handleMenuClick() {
        this.setState(state => ({
            isMenuOpen: !state.isMenuOpen
        }));
    }

    /* Render the menu toggle */
    get menuToggle() {
        return (
            <button className="Menu-toggle"  aria-expanded={this.state.isMenuOpen} title="Toggle Menu" onClick={this.handleMenuClick} >
                <span></span>
                <span></span>
                <span></span>
            </button>
        )
    }

    /* return to the previous page using react router history props */
    handleBackClick() {
        this.props.history.goBack();
    }

    /* Render the back button */
    get backButton() {
        //don't show the back button on the home page
        if(this.props.location.pathname === this.homeLink) {
            return null;
        }
        return (<button className="Backbutton" aria-label="Return to previous page" onClick={this.goBack}>
                    <img className="Backbutton-icon" src={backIcon} alt="Return" />
                </button>
        );
    }

    get homeLink() {
        //TODO: update to be dynamic
        return "/content/wknd-spa-react/us/en/home.html";
    }

    get navigation() {
        //TODO: update to be dynamic
        return <div class="Navigation">Navigation</div>;
    }

    get logo() {
        const homeLink = this.homeLink;
        let logo;
        if(homeLink) {
            logo = (<Link className="Logo-link"  to={this.homeLink}>
                        <img className="Logo-img" src={wkndLogoDark} alt="WKND SPA" />
                    </Link>);
        } else {
            logo = <img className="Logo-img" src={wkndLogoDark} alt="WKND SPA" />
        }

        return (
            <div className="Logo">
                {logo}
            </div>
        );
    }
    
    render() {
        if(HeaderEditConfig.isEmpty(this.props)) {
            return null;
        }

         return (
            <header className={this.state.isMenuOpen ? 'Header Header--menuOpen' : 'Header'}>
                <div className="Header-container">
                    {this.menuToggle}
                    {this.logo}
                    {this.backButton}
                </div>
                <div className="Header-navigation">
                    {this.navigation}
                </div>
            </header>
        );
    }
}

MapTo('wknd-spa-react/components/header')(withRouter(Header), HeaderEditConfig);