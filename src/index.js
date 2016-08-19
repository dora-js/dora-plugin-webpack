import mergeCustomConfig from 'atool-build/lib/mergeCustomConfig';
import getWebpackCommonConfig from 'atool-build/lib/getWebpackCommonConfig';
import webpack from 'atool-build/lib/webpack';
import { join, resolve } from 'path';
import chalk from 'chalk';
import chokidar from 'chokidar';
import NpmInstallPlugin from 'npm-install-webpack-plugin-cn';
import isEqual from 'lodash.isequal';
import { readFileSync, existsSync } from 'fs';

import Dashboard from 'webpack-dashboard';
import DashboardPlugin from 'webpack-dashboard/plugin';

let webpackConfig;

export default {
  name: 'dora-plugin-webpack',

  'middleware.before'() {
    const { applyPlugins, query } = this;
    let { cwd } = this;
    if (query.cwd) {
      cwd = query.cwd;
    }
    const customConfigPath = resolve(cwd, query.config || 'webpack.config.js');

    if (existsSync(customConfigPath)) {
      const customConfig = require(customConfigPath);

      // Support native webpack
      if (typeof customConfig === 'object') {
        webpackConfig = customConfig;
        return;
      }
    }
    webpackConfig = getWebpackCommonConfig({ ...this, cwd });
    webpackConfig.devtool = '#cheap-module-source-map';
    const dashboard = new Dashboard();
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new DashboardPlugin(dashboard.setData)
    ]);
    if (!query.disableNpmInstall) {
      webpackConfig.plugins.push(new NpmInstallPlugin({
        save: true,
      }));
    }
    webpackConfig = applyPlugins('webpack.updateConfig', webpackConfig);
    webpackConfig = mergeCustomConfig(webpackConfig, customConfigPath, 'development');
    webpackConfig = applyPlugins('webpack.updateConfig.finally', webpackConfig);
    if (query.publicPath) {
      webpackConfig.output.publicPath = query.publicPath;
    }
    if (!query.publicPath && webpackConfig.output.publicPath) {
      query.publicPath = webpackConfig.output.publicPath;
    }
  },

  'middleware'() {
    const { verbose, physcisFileSystem } = this.query;
    const compiler = webpack(webpackConfig);
    this.set('compiler', compiler);
    compiler.plugin('done', function doneHandler(stats) {
      if (verbose || stats.hasErrors()) {
        console.log(stats.toString({colors: true}));
      }
    });
    if (physcisFileSystem) {
      const outputFileSystem = compiler.outputFileSystem;
      setTimeout(() => {
        compiler.outputFileSystem = outputFileSystem;
      }, 0);
    }
    return require('koa-webpack-dev-middleware')(compiler, {
      publicPath: '/',
      quiet: true,
      ...this.query,
    });
  },

  'server.after'() {
    const { query } = this;
    let { cwd } = this;
    if (query.cwd) {
      cwd = query.cwd;
    }
    const pkgPath = join(cwd, 'package.json');

    function getEntry() {
      try {
        return JSON.parse(readFileSync(pkgPath, 'utf-8')).entry;
      } catch (e) {
        return null;
      }
    }

    const entry = getEntry();
    chokidar.watch(pkgPath).on('change', () => {
      if (!isEqual(getEntry(), entry)) {
        this.restart();
      }
    });

    const webpackConfigPath = resolve(cwd, query.config || 'webpack.config.js');
    chokidar.watch(webpackConfigPath).on('change', () => {
      this.restart();
    });
  },
};
