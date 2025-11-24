const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Load .env file manually to ensure it's available for DefinePlugin
require('dotenv').config();

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/', // Critical for production - ensures assets load correctly
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images/',
              publicPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Dotenv plugin must come first to load .env file
    new Dotenv({
      systemvars: true, // Load system environment variables as well
      safe: false, // Allow empty variables
      defaults: false, // Don't use .env.example as fallback
    }),
    // DefinePlugin reads from process.env after Dotenv loads it
    new webpack.DefinePlugin({
      'process.env.REACT_APP_SHOPIFY_DOMAIN': JSON.stringify(process.env.REACT_APP_SHOPIFY_DOMAIN || ''),
      'process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN': JSON.stringify(process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN || ''),
    }),
    // Copy public assets (images, etc.) to dist folder
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public', to: '', globOptions: { ignore: ['**/index.html'] } }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
