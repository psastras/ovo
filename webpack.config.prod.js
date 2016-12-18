const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    index: ["babel-polyfill", "./src/index.tsx"],
    vendor: ["react", "antd", "superagent", "redux", "lodash", "nprogress", "rc-animate", "moment",
      "json-format", "react-addons-css-transition-group", "react-dom", "react-router",
      "react-router-redux", "redux-actions", "redux-promise"],
  },

  module: {
      loaders: [
        // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
        { test: /\.tsx?$/, loaders: ["babel-loader?presets[]=es2015&presets[]=stage-0", "ts-loader"] },
        { test: /\.less$/, loader: ExtractTextPlugin.extract({ fallbackLoader: "style-loader",
          loader: "css-loader!less-loader"})},
        { test: /\.scss$/, loader: ExtractTextPlugin.extract({ fallbackLoader: "style-loader",
          loader: "css-loader!sass-loader"})},
        { test: /\.css$/, loader: ExtractTextPlugin.extract({fallbackLoader: "style-loader", loader: "css"}) },
        { test: /\.(jpe?g|png|gif|svg|eot|woff|svg|ttf|json)/, loader: "file-loader" },
      ],
  },

  output: {
    chunkFilename: "[name]-[chunkhash].js",
    filename: "bundle.js",
    path: __dirname + "/dist",
    publicPath: "/",
  },

  plugins: [
    new CopyWebpackPlugin([{
      from: "src/assets/fonts/antd-icons.woff", to: "assets/fonts/antd-icons.woff",
    }]),
    new ExtractTextPlugin("[name].css"),
    new webpack.optimize.CommonsChunkPlugin({name: "vendor", filename: "vendor.bundle.js"}),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
    new HtmlWebpackPlugin({
      template: "src/assets/index.html",
    }),
  ],

  resolve: {
      alias: {
        src: path.join(__dirname, "/src"),
      },
      extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".less"],
  },
};