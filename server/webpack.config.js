const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: [
    "./server/index.ts",
  ],

  module: {
      loaders: [
        { test: /\.ts?$/, loaders: ["babel-loader?presets[]=es2015&presets[]=stage-0", "ts-loader"] },
        { test: /\.(json)/, loader: "json-loader" },
      ],
  },

  output: {
    filename: "server.js",
    path: path.join(__dirname, "/../dist"),
  },

  resolve: {
      extensions: [".webpack.js", ".web.js", ".ts", ".tx", ".js"],
  },

  target: "node",
};
