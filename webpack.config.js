/* eslint-disable no-undef */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// eslint-disable-next-line no-undef
module.exports = (env) => ({
  entry: './src/js/index.js',
  output: {
    filename: 'main.[contenthash].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'main.[contenthash].css',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.js$/,
        loader: 'ify-loader',
      },
      {
        test: /\.scss$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2)$/i,
        type: 'asset/resource',
      },
    ],
  },
});
