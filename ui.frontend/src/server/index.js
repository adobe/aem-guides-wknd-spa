/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
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
// Expose XMLHttpRequest globally so ModelManager can use it
import express from "express";
import bodyParser from "body-parser";

const processor = require('./aem-processor');

var exapp = express();
//Here we are configuring express to use body-parser as middle-ware.
exapp.use(bodyParser.urlencoded({ extended: false }));
exapp.use(bodyParser.json());
exapp.use(express.static("dist"));

exapp.get(['/content/wknd-events/react*.html', '/conf/wknd-events/react/settings/wcm/templates*.html'], (req, res, next) => {
    if (!process.env.API_HOST) {
        console.error("You have not set any api host. Be sure you set the environment variable API_HOST before running the command");
        process.exit(1);
    }

    if (!process.env.APP_ROOT_PATH) {
        console.error("You have not set any root path for app. Be sure you set the environment variable APP_ROOT_PATH before running the command");
        process.exit(1);
    }

    let pagePath = req.path.replace('.html', '');

    let args = {
        pagePath: pagePath,
        pageRoot: process.env.APP_ROOT_PATH,
        wcmmode: req.headers['wcmmode'] || '',
        apiHost: process.env.API_HOST,
        method: 'GET'
    };

    return processor.processSPA(args).then((response) => {
        res.send(response);
    }).catch((error) => {
        next(error);
    });
});
 
exapp.post(['/content/wknd-events/react*.html', '/conf/wknd-events/react/settings/wcm/templates*.html'], (req, res, next) => {
    const wcmMode = req.headers['wcm-mode'];
    const pageModelRootPath = req.headers['page-model-root-url'] || process.env.APP_ROOT_PATH;
    let model = req.body;
    let pagePath = req.path.replace('.html', '');
    let args = {
        pagePath: pagePath,
        pageRoot: pageModelRootPath,
        wcmmode: wcmMode,
        data: model,
        method: 'POST'
    };

    return processor.processSPA(args).then((response) => {
        res.send(response);
    }).catch((error) => {
        next(error);
    });
});

exapp.listen(4200, () => console.log('Example exapp listening on port 4200!'));

module.exports = exapp;