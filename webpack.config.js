const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devServer: {
    historyApiFallback: true,
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",
  entry: [
    "./src/index.tsx",
    "webpack-dev-server/client?http://127.0.0.1:8080",
    "webpack/hot/only-dev-server",
  ],

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
    "react-redux": "ReactRedux",
    "react-router": "ReactRouter",
    "react-router-redux": "ReactRouterRedux",
    "redux": "Redux",
    "redux-saga": "ReduxSaga",
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        loaders: ["react-hot-loader/webpack", "ts-loader"]
      }, {
        test: /\.less$/,
        loader: extractCSS.extract(["css-loader", "less-loader"])
      }, {
        test: /\.scss$/,
        loader: extractCSS.extract(["css-loader", "sass-loader"])
      }, {
        test: /\.css$/,
        loader: extractCSS.extract(["css-loader"])
      }, {
        test: /\.(jpe?g|png|gif|svg|eot|woff|svg|ttf|json)/,
        loader: "file-loader"
      },
    ],
  },

  output: {
    chunkFilename: "[name]-[chunkhash].js",
    filename: "bundle.js",
    publicPath: "http://127.0.0.1:8080/",
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: "src/assets/fonts/antd-icons.woff", to: "assets/fonts/antd-icons.woff" },
      { from: "src/assets/favicon.png", to: "assets/favicon.png" },
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
    extractCSS,
  ],

  resolve: {
    alias: {
      src: path.join(__dirname, "/src"),
    },
    extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".less"],
  },
};