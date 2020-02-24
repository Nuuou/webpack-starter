const path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// TODO: Remove this. const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const imgRules = {
  test: /\.(png|jpe?g|gif|webp)$/,
  exclude: /node_modules/,
  use: {
    loader: 'file-loader',
    options: {
      name: (filePath) => {
        const relativePath = path.relative(`${__dirname}/_ui/skin/src`, filePath);
        const prefixes = ['img/', 'js/'];
        let outputPath = '';
        prefixes.forEach((prefix) => {
          if (relativePath.indexOf(prefix) === 0) {
            outputPath = relativePath.split(prefix).slice(1).join('');
          }
        });

        return `img/${outputPath}`;
      },
      publicPath: '../',
    },
  },
};

const tsRules = {
  test: /\.(js|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
    },
    {
      loader: 'ts-loader',
    },
    {
      loader: 'eslint-loader',
      options: {
        fix: true,
      },
    },
  ],
};

const sassRules = {
  test: /\.(sa|sc|c)ss$/,
  use: [
    {
      loader: ExtractCssChunks.loader,
      options: {
        hmr: process.env.NODE_ENV === 'development',
      },
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'resolve-url-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        sassOptions: {
          outputStyle: 'compact',
        },
      },
    },
  ],
};

module.exports = {
  entry: {
    style: './_ui/skin/src/sass/style.scss',
    main: './_ui/skin/src/js/main.js',
    testthing: './_ui/skin/src/js/testthing.tsx',
  },
  output: {
    path: path.resolve('_ui/skin/dist'),
    filename: 'js/[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve('./_ui/skin/src/'),
    },
  },
  optimization: {
    chunkIds: 'named',
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      imgRules,
      tsRules,
      sassRules,
    ],
  },
  plugins: [
    new ExtractCssChunks({
      filename: 'css/[name].css',
    }),
    new IgnoreEmitPlugin(['style.js']),
    new FriendlyErrorsWebpackPlugin(),
    new BrowserSyncPlugin({
      injectCss: true,
      notify: true,
      port: 8081,
      proxy: 'localhost:8080',
      files: [
        '_ui/skin/dist/**/*',
      ],
    }),
    // TODO: Clean Webpack is being overzealous, removing too much randomly.
    //new CleanWebpackPlugin(),
  ],
  devtool: 'source-map',
  stats: {
    all: false,
    builtAt: true,
  },
};
