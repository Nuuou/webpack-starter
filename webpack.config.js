const webpack = require('webpack');
const path = require('path');
const getPort = require('get-port');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
      loader: MiniCssExtractPlugin.loader,
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

const devServer = {
  enabled: false,
  port: 9000,
};
const browserSync = {
  enabled: true,
  port: 9000,
  host: 'localhost:8080',
};


const webpackConfig = {
  entry: {
    main: './_ui/skin/src/js/main.tsx',
    style: './_ui/skin/src/js/main.scss',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve('./_ui/skin/src/'),
    },
  },
  output: {
    path: path.resolve('_ui/skin/dist'),
    filename: 'js/[name].js',
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
    new webpack.ProgressPlugin(),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new StylelintPlugin({
      fix: true,
    }),
    new FriendlyErrorsWebpackPlugin(),
  ],
  devtool: 'source-map',
  stats: {
    all: false,
    builtAt: true,
  },
};

if (devServer.enabled) {
  webpackConfig.devServer = {
    contentBase: path.resolve('.'),
    host: 'localhost',
    port: devServer.port,
    publicPath: `http://localhost:${devServer.port}/_ui/skin/dist`,
    historyApiFallback: true,
    hot: true,
  };
}

module.exports = (async () => {
  const port = await getPort({
    port: getPort.makeRange(3005, 3100),
  });

  if (browserSync.enabled) {
    webpackConfig.plugins.push(
      new BrowserSyncPlugin({
        port,
        notify: true,
        proxy: browserSync.host,
        files: [
          '_ui/skin/dist/**/*',
        ],
      }, {
        injectCss: true,
        reload: false,
      }),
    );
  }

  if (devServer.enabled) {
    webpackConfig.devServer = {
      port,
      contentBase: path.resolve('.'),
      host: 'localhost',
      publicPath: `http://localhost:${port}/_ui/skin/dist`,
      historyApiFallback: true,
      hot: true,
    };
  }

  return webpackConfig;
});
