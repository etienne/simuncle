const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        }),
      },
      {
        test: /\.(svg)$/,
        use: "file-loader",
      },
    ],
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      open: false,
      notify: false,
      port: 3000,
      server: { baseDir: ['dist'] },
      ui: false,
    }),
    new ExtractTextPlugin("styles.css"),
  ]
};
