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

// webpack.config.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

var isTestEnvironment = process.env.NODE_ENV == 'test';

const serverConfig = {
    // Tell webpack to start bundling our app at app/index.js
    entry: './src/server/aem-processor.js',
    target: 'node',
    externals: [nodeExternals()],
    mode: 'development',
    // Output our app to the dist/ directory
    output: {
        globalObject: `typeof self !== 'undefined' ? self : this`,
        filename: isTestEnvironment ? '[name].js' : 'app.js',
        path: path.resolve(__dirname + '/dist'),
        publicPath: '/',
        library: 'ssr',
        libraryTarget: 'commonjs'
    },
    // Emit source maps so we can debug our code in the browser
    devtool: 'source-map',

    // Tell webpack to run our source code through Babel
    module: {
        rules: [
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                  'file-loader',
                  {
                    loader: 'image-webpack-loader',
                    options: {
                      bypassOnDebug: true, // webpack@1.x
                      disable: true, // webpack@2.x and newer
                    },
                  },
                ],
            },
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                {
                    loader: "css-loader" // translates CSS into CommonJS
                },
                {
                    loader: "sass-loader" // compiles Sass to CSS
                }
                ]
            },
            {
                test: /\.css$/,
                use: [
                {
                    loader: "css-loader" // translates CSS into CommonJS
                }
                ]
            }
        ]
    },

    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
        new webpack.EnvironmentPlugin({
            "API_HOST": process.env.API_HOST,
            "APP_ROOT_PATH": process.env.APP_ROOT_PATH
        }),
        new CleanWebpackPlugin(['dist']),
        new WebpackShellPlugin({onBuildEnd:['node ./scripts/postWebhook.js']})
    ]
  };

module.exports = serverConfig;
