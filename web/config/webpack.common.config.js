const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const tsImportPluginFactory = require('ts-import-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const sourcePath = path.resolve(__dirname, '../src');
const entryKeys = fs.readdirSync(sourcePath);
const entries = {};
const aliases = {};
const htmlWebpackPlugins = [];
const maniFestPlugin = [];
const commonScriptsEntries = ['common'];
entryKeys.forEach((value) => {
  entries[value] = path.resolve(sourcePath, value, 'index.tsx');
  aliases[`@${value}`] = `${sourcePath}/${value}/`;
  if (!commonScriptsEntries.includes(value)) {
    maniFestPlugin.push(new ManifestPlugin({
      fileName: path.resolve(__dirname, `../../server/manifest/${value}.manifest.json`),
      writeToFileEmit: true,
      seed: {
        css: [],
        js: [],
      },
      // 自定义生成的对象结构
      generate: (seed, files) => {
        const returnSeed = seed;

        files.forEach((file) => {
          if (file.name.endsWith('.js')) {
            returnSeed.css.push(file.path);
          }

          if (file.name.endsWith('.js')) {
            returnSeed.js.push(file.path);
          }
        });

        return returnSeed;
      },

      filter: file => [...commonScriptsEntries, value].indexOf(file.name.split('.')[0]) > -1,
    }));
  }
  if (!commonScriptsEntries.includes(value)) {
    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: './config/templete.html',
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

    // 构建manefest
    ...maniFestPlugin,
    // 进度条
    new ProgressBarPlugin(),
  ],
};
