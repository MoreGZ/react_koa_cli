const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackCommonConfig = require('./webpack.common.config');

module.exports = {
  ...webpackCommonConfig,

  output: {
    filename: 'js/[name][hash].js',
    path: path.resolve(__dirname, '../../server/statics'),
    publicPath: '/',
  },

  mode: 'production',

  module: {
    rules: [
      ...webpackCommonConfig.module.rules,
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader, // replace ExtractTextPlugin.extract({..})
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              modifyVars: {
                'primary-color': '#bb9d77',
                'border-color-base': '#bb9d77',
              },
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    ...webpackCommonConfig.plugins,

    // 提取css文件
    new MiniCssExtractPlugin({
      filename: './css/[name][contenthash].css',
      chunkFilename: '[id].css',
    }),

    // 去除旧的打包文件
    new CleanWebpackPlugin({
      dry: false,
      dangerouslyAllowCleanPatternsOutsideProject: true,
      cleanOnceBeforeBuildPatterns: ['js/*', 'css/*'],
    }),
  ],

  // 压缩代码
  optimization: {
    splitChunks: false,
    minimizer: [
      new TerserWebpackPlugin({}),
      new OptimizeCSSAssetsPlugin({}),
    ],
  },
  // 设置信息展示
  stats: 'minimal',
};
