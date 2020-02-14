const withCSS = require("@zeit/next-css");
const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
// const MONACO_DIR = path.resolve(__dirname, "./node_modules/monaco-editor");

module.exports = withCSS({
  // webpack: (config, options) => {
  webpack: config => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.ttf$/,
        use: ["file-loader?outputPath=static/css&publicPath=/_next/static/css"]
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: ["url-loader"]
      }
    ];

    config.plugins.push(
      new MonacoWebpackPlugin({
        languages: [],
        publicPath: "",
        filename: `static/[name].worker.js`
      })
    );

    return config;
  },

  env: {
    REACT_APP_GITHUB_CLIENT_ID: "ab59faad995bfde0b585",
    REACT_APP_GITHUB_CLIENT_SECRET: "8ec4077e4b23209d9fd4457579ed0f7bd8964891"
  }
});
