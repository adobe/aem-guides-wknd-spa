/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

import { EditableComponent, MapTo } from "@adobe/aem-react-editable-components";
import DOMPurify from "dompurify";
import React from "react";
import extractModelId from "../../utils/extract-model-id";

require("./Text.scss");

/**
 * Default Edit configuration for the Text component that interact with the Core Text component and sub-types
 *
 * @type EditConfig
 */
const TextEditConfig = {
  emptyLabel: "Text",

  isEmpty: function (props) {
    return !props || !props.text || props.text.trim().length < 1;
  },
};

const Text = (props) => {
  const richTextContent = () => {
    return (
      <div
        id={extractModelId(props.cqPath)}
        data-rte-editelement
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(props.text),
        }}
      />
    );
  };

  const textContent = () => {
    return <div>{props.text}</div>;
  };

  return props.richText ? richTextContent() : textContent();
};

const EditableText = (props) => {
  return (
    <EditableComponent config={TextEditConfig} {...props}>
      <Text {...props} />
    </EditableComponent>
  );
};

export default MapTo("wknd-spa-react/components/text")(EditableText);
