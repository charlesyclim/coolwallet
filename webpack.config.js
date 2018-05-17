var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

var config = {
  context: __dirname + '/src', // `__dirname` is root of project and `src` is source
  entry: {
    app: './index.js',
  },
  output: {
    path:  path.join(__dirname, 'dist'), // `dist` is the destination
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {   test: /\.html$/,
          use: 'html-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use:['style-loader','css-loader'],

      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
  },
  mode: 'development',
  plugins: [
    new CopyWebpackPlugin([
            { from: 'public'
            }
    ]),
    new HtmlWebpackPlugin({
        template: 'public/index.html'
    }),
  ]
};

module.exports = config;
