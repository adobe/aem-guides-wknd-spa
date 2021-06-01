import React, {Component} from 'react';
import {MapTo} from '@adobe/aem-react-editable-components';
import {Link} from "react-router-dom";


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

        if(children === null || children.length < 1 ) {
            return null;
        }
        return (<ul className={this.baseCss + '__group'}>
                    {children.map(
                        (item,index) => { return this.renderNavItem(item,index)}
                    )}
                </ul>
        );
   }

   renderNavItem(item, index) {
      const cssClass = this.baseCss + '__item ' +
                         this.baseCss + '__item--level-' + item.level + ' ' +
                         (item.active ? ' ' + this.baseCss + '__item--active' : '');
        return (
            <li key={this.baseCss + '__item-' + index} className={cssClass}>
                    { this.renderLink(item) }
                    { this.renderGroupNav(item.children) }
            </li>
        );
   }

   renderLink(item){
    return (
        <Link to={item.url} title={item.title} aria-current={item.active && 'page'}
           className={this.baseCss + '__item-link'}>{item.title}</Link>
    );
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