import React from "react";
// Import the "not-EditableImage" Image component, since this will be embedded within the context of the EditableCard component
import { Image } from "../Image/Image";
import { Link } from "react-router-dom";
import { EditableComponent, MapTo } from "@adobe/aem-react-editable-components";

require("./Card.scss");

export const CardEditConfig = {
  emptyLabel: "Card",
  isEmpty: function (props) {
    return !props || !props.src || props.src.trim().length < 1;
  }
};

const Card = (props) => {
  const lastModifiedDisplayDate = () => {
    const lastModifiedDate = props?.cardLastModified
      ? new Date(props.cardLastModified)
      : null;

    if (lastModifiedDate) {
      return lastModifiedDate.toLocaleDateString();
    }
    return null;
  };

  const ctaButton = () => {
    if (props.ctaLinkURL && props.ctaText) {
      return (
        <div className="Card__action-container">
          <Link
            to={props.ctaLinkURL}
            title={props.title}
            className="Card__action-link"
          >
            {props.ctaText}
          </Link>
        </div>
      );
    }

    return null;
  };

  const imageContent = () => {
    return (
      <div className="Card__image">
        // This is embedding the "non-editable Image" component, as the EditableCard provides the edit chrome for this entire component, including the embedded image
        <Image {...props} />
      </div>
    );
  };

  const bodyContent = () => {
    return (
      <div className="Card__content">
        <h2 className="Card__title">
          {props.cardTitle}
          <span className="Card__lastmod">{lastModifiedDisplayDate()}</span>
        </h2>
        {ctaButton()}
      </div>
    );
  };

  if (CardEditConfig.isEmpty(props)) {
    return null;
  }

  return (
    <div className="Card">
      {imageContent()}
      {bodyContent()}
    </div>
  );
};

const EditableCard = (props) => {
  return (
    <EditableComponent config={CardEditConfig} {...props}>
      <Card {...props} />
    </EditableComponent>
  );
};

export default MapTo("wknd-spa-react/components/card")(EditableCard);
