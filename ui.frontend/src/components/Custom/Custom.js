import React, {Component} from 'react';

export const CustomEditConfig = {

    emptyLabel: 'Custom',

    isEmpty: function(props) {
        return !props || !props.message || props.message.trim().length < 1;
    }
};

export default class Custom extends Component {

    render() {
        if(CustomEditConfig.isEmpty(this.props)) {
            return null;
        }

        return (
            <div class="CustomComponent">
                <h2 class="CustomComponent__message">{this.props.message}</h2>
            </div> 
        );
    }
}
