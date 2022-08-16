import React from "react";
import { EditableComponent, MapTo } from "@adobe/aem-react-editable-components";

require("./Image.scss");

export const ImageEditConfig = {
  emptyLabel: "Image",

  isEmpty: function (props) {
    return !props || !props.src || props.src.trim().length < 1;
  },
};

/**
 * Export the non-EditableImage object, so this can be embedded in ../Card/Card.js 
 * and not supersede the Card's edit chrome.
 */
export const Image = (props) => {
  if (ImageEditConfig.isEmpty(props)) {
    return null;
  }

  return (
    <div className="Image">
      <img
        className="Image-src"
        src={props.src}
        alt={props.alt}
        title={props.title ? props.title : props.alt}
      />
    </div>
  );
};

const EditableImage = (props) => {
  return (
    <EditableComponent config={ImageEditConfig} {...props}>
      <Image {...props} />
    </EditableComponent>
  );
};

export default MapTo("wknd-spa-react/components/image")(EditableImage);
