import React, {Component} from 'react';
import {EditableComponent, MapTo} from '@adobe/aem-react-editable-components';

require('./Image.scss');

export const ImageEditConfig = {
    emptyLabel: 'Image',

    isEmpty: function(props) {
        return !props || !props.src || props.src.trim().length < 1;
    }
};

class Image extends Component {

    get content() {
        return <img
                className="Image-src"
                src={this.props.src}
                alt={this.props.alt}
                title={this.props.title ? this.props.title : this.props.alt} />;
    }

    render() {
        console.log(this.props);
        
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

const EditableImage = (props) => { 
    return <EditableComponent config={ImageEditConfig} {...props}>
        <Image />
    </EditableComponent>
}

export default MapTo('wknd-spa-react/components/image')(EditableImage);