import React from "react";
import { EditableComponent, MapTo } from "@adobe/aem-react-editable-components";

export const CustomEditConfig = {
  emptyLabel: "Custom",

  isEmpty: function (props) {
    return !props || !props.message || props.message.trim().length < 1;
  },
};

const Custom = (props) => {
  if (CustomEditConfig.isEmpty(props)) {
    return null;
  }

  return (
    <div className="CustomComponent">
      <h2 className="CustomComponent__message">{props.message}</h2>
    </div>
  );
};

const EditableCustom = (props) => {
  return (
    <EditableComponent config={CustomEditConfig} {...props}>
      <Custom {...props} />
    </EditableComponent>
  );
};

export default MapTo("wknd-spa-react/components/custom-component")(
  EditableCustom
);
