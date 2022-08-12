import React from "react";
import { EditableComponent, MapTo } from "@adobe/aem-react-editable-components";
import { Link } from "react-router-dom";

require("./Navigation.scss");

const NavigationEditConfig = {
  emptyLabel: "Navigation",
  isEmpty: function (props) {
    return !props || !props.items || props.items.length < 1;
  },
};

const Navigation = (props) => {
  const cssBlock = "Navigation";

  const renderGroupNav = (children) => {
    if (children === null || children.length < 1) {
      return null;
    }
    return (
      <ul className={`${cssBlock}__group`}>
        {children.map((item, index) => {
          return renderNavItem(item, index);
        })}
      </ul>
    );
  };

  const renderNavItem = (item, index) => {
    const cssClass =
      `${cssBlock}__item ${cssBlock}__item--level-${item.level}` +
      (item.active ? ` ${cssBlock}__item--active` : "");
    return (
      <li key={index} className={cssClass}>
        {renderLink(item)}
        {renderGroupNav(item.children)}
      </li>
    );
  };

  const renderLink = (item) => {
    return (
      <Link
        to={item.url}
        title={item.title}
        aria-current={item.active && "page"}
        className={`${cssBlock}__item-link`}
      >
        {item.title}
      </Link>
    );
  };

  if (NavigationEditConfig.isEmpty(props)) {
    return null;
  }

  return <nav className="Navigation">{renderGroupNav(props.items)}</nav>;
};

const EditableNavigation = (props) => {
  return (
    <EditableComponent config={NavigationEditConfig} {...props}>
      <Navigation {...props} />
    </EditableComponent>
  );
};

export default MapTo("wknd-spa-react/components/navigation")(
  EditableNavigation
);
