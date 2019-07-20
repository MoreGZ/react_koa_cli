const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const sourcePath = path.resolve(__dirname, '../src');
const entryKeys = fs.readdirSync(sourcePath);
const entries = {};
const aliases = {};
const htmlWebpackPlugins = [];
const commonScriptsEntries = ['common'];
entryKeys.forEach((value) => {
  entries[value] = path.resolve(sourcePath, value, 'index.tsx');
  aliases[`@${value}`] = `${sourcePath}/${value}/`;
  if (!commonScriptsEntries.includes(value)) {
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: './web/config/templete.html',
      filename: `../views/${value}.html`,
      chunks: [...commonScriptsEntries, value],
    }));
  }
});

module.exports = {
  entry: entries,
  resolve: {
    extensions: ['.js', 'jsx', '.ts', '.tsx', '.json'],
    alias: Object.assign({}, aliases),
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [tsImportPluginFactory({
              style: true,
              libraryName: 'antd',
            })],
          }),
          compilerOptions: {
            module: 'es2015',
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /(\.jsx|\.js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'env', 'react',
            ],
            plugins: [['import', {
              libraryName: 'antd',
              style: true, // or 'css'
            }]],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    ...htmlWebpackPlugins,
    // 进度条
    new ProgressBarPlugin(),
  ],
};
