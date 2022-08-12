import React, { useState } from "react";
import wkndLogoDark from "../../media/wknd-logo-dk.png";
import backIcon from "../../media/icon-back.svg";
import { EditableComponent, MapTo } from "@adobe/aem-react-editable-components";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import Navigation from "../Image/Navigation/Navigation";

require("./Header.scss");

export const HeaderEditConfig = {
  emptyLabel: "Header",

  isEmpty: function (props) {
    return !props || !props.items || props.items.length < 1;
  },
};

const Header = (props) => {
  let [menuOpen, setMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleBackClick = () => {
    props.history.goBack();
  };

  const renderMenuToggle = () => {
    return (
      <button
        className="Menu-toggle"
        title="Toggle Menu"
        aria-expanded={menuOpen}
        onClick={handleToggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    );
  };

  const homeLink = () => {
    //expect a single root defined as part of the navigation
    if (!props.items || props.items.length !== 1) {
      return null;
    }

    return props.items[0].url;
  };

  const renderBackButton = () => {
    //don't show the back button on the home page
    if (props.location.pathname === homeLink()) {
      return null;
    }

    return (
      <button
        className="Backbutton"
        aria-label="Return to previous page"
        onClick={handleBackClick}
      >
        <img className="Backbutton-icon" src={backIcon} alt="Return" />
      </button>
    );
  };

  const renderLogo = () => {
    let logo = <img className="Logo-img" src={wkndLogoDark} alt="WKND SPA" />;

    if (homeLink()) {
      logo = (
        <Link className="Logo-link" to={homeLink()}>
          {logo}
        </Link>
      );
    }

    return <div className="Logo">{logo}</div>;
  };

  if (HeaderEditConfig.isEmpty(props)) {
    return null;
  }

  return (
    <header className={menuOpen ? "Header Header--menuOpen" : "Header"}>
      <div className="Header-container">
        {renderMenuToggle()}
        {renderLogo()}
        {renderBackButton()}
      </div>
      <div className="Header-navigation">
        <Navigation {...props} />
      </div>
    </header>
  );
};

const EditableHeader = (props) => {
  return (
    <EditableComponent config={HeaderEditConfig} {...props}>
      <Header {...props} />
    </EditableComponent>
  );
};

export default MapTo("wknd-spa-react/components/header")(
  withRouter(EditableHeader)
);
