const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    index: {
      import: './source/index.js',
    },
  },

  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'distribution'),
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './source/pages/index.html',
    }),

    new CopyPlugin({
      // Tell webpack to copy assets from public to distrubiution
      // This is useful for our favicon generation
      patterns: [{ from: 'public' }],
    }),

    new MiniCssExtractPlugin(),

    new webpack.ProvidePlugin({
      Swal: 'sweetalert2',
    }),
  ],

  module: {
    rules: [
      {
        // Tell Webpack to parse html files and process them.
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              // Tell webpack to import and process images inside html files.
              // Learn more: https://webpack.js.org/loaders/html-loader/#sources
              {
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
            ],
          },
        },
      },

      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: { version: '3.8', proposals: true },
                  targets: { node: 'current' },
                },
              ],
            ],
          },
        },
      },

      {
        test: /\.s?css$/,
        oneOf: [
          {
            test: /\.module\.s?css$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: { modules: true },
              },
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          },
        ],
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
