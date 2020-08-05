global.fetch = require('node-fetch/lib/index');

import { CustomModelClient } from "./CustomModelClient";
import React from "react";
import ReactDOMServer from 'react-dom/server';
import App from "../App";
import { StaticRouter } from "react-router-dom";
import { Constants, EditorContext } from '@adobe/cq-react-editable-components';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';
import '../components/import-components';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

/**
 * Renders a valid model to a html stringify
 *
 * @param   {Object} model - the model to render
 * @param   {[type]} pagePath - the pagePath of the current model
 * @param   {[type]} requestUrl - the request url
 * @param   {[type]} requestPath - the request path 
 * @param   {[type]} pageModelRootPath - Path to the app root
 * @param   {[type]} isInEditor - Is the app used in the context of the page editor
 * @returns {String} the string serialization of the html output + state
 */
function renderModelToHTMLString(model, pagePath, requestUrl, requestPath, pageModelRootPath, isInEditor) {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={ requestUrl } context={{}}>
      <EditorContext.Provider value={isInEditor}>
        <App
          cqChildren={model[Constants.CHILDREN_PROP]} 
          cqItems={model[Constants.ITEMS_PROP]} 
          cqItemsOrder={model[Constants.ITEMS_ORDER_PROP]} 
          cqPath={pageModelRootPath} 
          locationPathname={requestPath}
        />
      </EditorContext.Provider>
     </StaticRouter>
 );

 console.log(html);

 // We are using ' for the string to we need to make sure we are encoding all other '
 let state = {
     rootModel : model,
     rootModelUrl: ModelManager.rootPath,
     pagePath
 };
 let stateStr = JSON.stringify(state);

 return `${html}
     <script type="application/json" id="__INITIAL_STATE__">
         ${stateStr}
     </script>`;
};

async function processSPA(args) {
  if(args.method && args.method === 'GET') {
    return processGet(args);
  } else {
    return processPost(args);
  }
};

async function processPost(args) {
  const APP_ROOT_PATH = '/content/wknd-spa-react/us/en';
  const wcmMode = args.wcmmode;
  const isInEditor = wcmMode && wcmMode === 'EDIT' || wcmMode === 'PREVIEW';
  const pageModelRootPath = args.pageRoot || APP_ROOT_PATH;
  let modelData = args.data;
  let pagePath = args.pagePath.replace('.html', '');
  console.log(modelData);
  let modelClient = new CustomModelClient('Basic YWRtaW46YWRtaW4=');
  await ModelManager.initialize({path: pageModelRootPath, model: modelData, modelClient: modelClient});
  const response = await renderModelToHTMLString(modelData, pagePath, args.pagePath, args.pagePath, pageModelRootPath, isInEditor);
  return response;
};

async function processGet(args) {
  const APP_ROOT_PATH = args.pageRoot || '/content/wknd-spa-react/us/en';

  const API_HOST = args.apiHost || 'http://localhost:4502'

  const wcmMode = args.wcmmode;
  const isInEditor = wcmMode && wcmMode === 'EDIT' || wcmMode === 'PREVIEW';
  const pageModelRootPath = args.pageRoot || APP_ROOT_PATH;
  let modelData = args.data;
  let pagePath = args.pagePath.replace('.html', '');

  let modelClient = new CustomModelClient('Basic YWRtaW46YWRtaW4=', API_HOST);
  await ModelManager.initialize({path: pageModelRootPath, model: modelData, modelClient: modelClient});
  const model = await ModelManager.getData({ path: pagePath });
  const response = await renderModelToHTMLString(model, pagePath, args.pagePath, args.pagePath, pageModelRootPath, isInEditor);
  return response;
};

exports.processSPA = processSPA;