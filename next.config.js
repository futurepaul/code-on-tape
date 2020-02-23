const withCSS = require("@zeit/next-css");
const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
// const MONACO_DIR = path.resolve(__dirname, "./node_modules/monaco-editor");

module.exports = withCSS({
  // webpack: (config, options) => {
  webpack: config => {
    config.plugins.push(
      new MonacoWebpackPlugin({
        publicPath: "",
        filename: `static/[name].worker.js`,
        features: ["wordHighlighter", "bracketMatching"]
      })
    );

    return config;
  },

  env: {
    SPACES_ENDPOINT: process.env.SPACES_ENDPOINT,
    SPACES_ACCESS_KEY_ID: process.env.SPACES_ACCESS_KEY_ID,
    SPACES_SECRET_KEY: process.env.SPACES_SECRET_KEY,
    BUCKET: process.env.BUCKET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
  }
});
