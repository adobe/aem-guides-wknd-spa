import React, {Component} from 'react';
import Image from '../Image/Image';
import {MapTo} from '@adobe/cq-react-editable-components';


export const CardEditConfig = {

    emptyLabel: 'Card',

    isEmpty: function(props) {
        return !props || !props.src || props.src.trim().length < 1;
    }
};

export default class Card extends Component {

    get imageContent() {
        return (
            <div className="Card__image">
                <Image {...this.props} />
            </div>)
    }

    get bodyContent() {
        return null;
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
