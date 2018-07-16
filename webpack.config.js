const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const SpritesmithPlugin = require('webpack-spritesmith');

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
        test: /\.woff$/,
        use: "file-loader",
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      },
    ],
  },
  // devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      open: false,
      notify: false,
      port: 3000,
      server: { baseDir: ['dist'] },
      ui: false,
    }),
    new CopyWebpackPlugin(['assets/index.html', 'assets/images/cursor.png']),
    new ExtractTextPlugin("styles.css"),
    new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, 'assets/images/atlas'),
        glob: '**/*.png',
      },
      target: {
        image: path.resolve(__dirname, 'dist/atlas.png'),
        css: [[path.resolve(__dirname, 'dist/atlas.json'), {
          format: 'json_texture'
        }]],
      },
      spritesmithOptions: {
        padding: 2,
      }
    }),
  ]
};
