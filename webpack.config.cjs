// @ts-check
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  devtool: 'inline-source-map',
  // entry: './src/index.jsx',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  output: {
    filename: 'main.js',
    path: path.join(__dirname, 'dist', 'public'),
    publicPath: '/assets/', // Essentially, every file emitted to your output.path directory will be referenced from the output.publicPath location.
  },
  devServer: {
    compress: true,
    port: 8080,
    host: '0.0.0.0',
    static: '/assets/',
    historyApiFallback: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: './index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
};
