import React, {Component} from 'react';
import Image from '../Image/Image';
import {Link} from "react-router-dom";
import {MapTo} from '@adobe/cq-react-editable-components';

require('./Card.scss');

export const CardEditConfig = {

    emptyLabel: 'Card',

    isEmpty: function(props) {
        return !props || !props.src || props.src.trim().length < 1;
    }
};

export default class Card extends Component {

    get ctaButton() {
        if(this.props && this.props.ctaLinkURL && this.props.ctaText) {
            return (
                <div className="Card__action-container">
                    <Link to={this.props.ctaLinkURL} title={this.props.title}
                        className="Card__action-link">
                        {this.props.ctaText}
                    </Link>
                </div>
            );
        }

        return null;
    }

    get lastModifiedDisplayDate() {
        const lastModifiedDate = this.props.cardLastModified ? new Date(this.props.cardLastModified) : null;

        if (lastModifiedDate) {
            return lastModifiedDate.toLocaleDateString();
        }
        return null;
    }

    get imageContent() {
        return (
            <div className="Card__image">
                <Image {...this.props} />
            </div>)
    }

    get bodyContent() {
        return  (
            <div className="Card__content">
                <h2 className="Card__title"> {this.props.cardTitle}
                    <span className="Card__lastmod">
                        {this.lastModifiedDisplayDate}
                    </span>
                </h2>
                {this.ctaButton}
            </div>
        );
    }

    render() {
        if(CardEditConfig.isEmpty(this.props)) {
            return null;
        }

        return (<div className="Card">
                {this.imageContent}
                {this.bodyContent}
            </div>);
    }
}

MapTo('wknd-spa-react/components/card')(Card, CardEditConfig);
