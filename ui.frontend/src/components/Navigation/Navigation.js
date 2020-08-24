import React, {Component} from 'react';
import {MapTo} from '@adobe/aem-react-editable-components';

require('./Navigation.scss');

const NavigationEditConfig = {

    emptyLabel: 'Navigation',
    isEmpty: function(props) {
        return !props || !props.items || props.items.length < 1;
    }
};

/**
 * Navigation Class
 */
export default class Navigation extends Component {

   baseCss = 'Navigation';

   renderGroupNav(children) {
       //TODO: implement renderGroupNav
   }

   renderNavItem(item, index) {
      //TODO: implement renderNavItem
   }

   renderLink(item){
      //TODO: implement renderLink
   }

    render() {

        if(NavigationEditConfig.isEmpty(this.props)) {
           return null;
        }

        return (
                <nav className="Navigation">
                    { this.renderGroupNav(this.props.items) }
                </nav>
        );
    }
}

MapTo("wknd-spa-react/components/navigation")(Navigation, NavigationEditConfig);