import React, {Component} from 'react';
import {MapTo} from '@adobe/aem-react-editable-components';

require('./Image.scss');

export const ImageEditConfig = {

    emptyLabel: 'Image',

    isEmpty: function(props) {
        return !props || !props.src || props.src.trim().length < 1;
    }
};

export default class Image extends Component {

    get content() {
        return <img
                className="Image-src"
                src={this.props.src}
                alt={this.props.alt}
                title={this.props.title ? this.props.title : this.props.alt} />;
    }

    render() {
        if(ImageEditConfig.isEmpty(this.props)) {
            return null;
        }

        return (
                <div className="Image">
                    {this.content}
                </div>
        );
    }
}

MapTo('wknd-spa-react/components/image')(Image, ImageEditConfig);