import mergeCustomConfig from 'atool-build/lib/mergeCustomConfig';
import getWebpackCommonConfig from 'atool-build/lib/getWebpackCommonConfig';
import webpack, { ProgressPlugin } from 'atool-build/lib/webpack';
import { join, resolve } from 'path';
import chalk from 'chalk';
import chokidar from 'chokidar';
import NpmInstallPlugin from 'npm-install-webpack-plugin-cn';
import isEqual from 'lodash.isequal';
import { readFileSync, existsSync } from 'fs';

let webpackConfig;

export default {
  name: 'dora-plugin-webpack',

  'middleware.before'() {
    const { cwd, applyPlugins, query } = this;
    const customConfigPath = resolve(cwd, query.config || 'webpack.config.js');

    if (existsSync(customConfigPath)) {
      const customConfig = require(customConfigPath);

      // Support native webpack
      if (typeof customConfig === 'object') {
        webpackConfig = customConfig;
        return;
      }
    }

    webpackConfig = getWebpackCommonConfig(this);
    webpackConfig.devtool = '#cheap-module-source-map';
    webpackConfig.plugins = webpackConfig.plugins.concat([
      new ProgressPlugin((percentage, msg) => {
        const stream = process.stderr;
        if (stream.isTTY && percentage < 0.71 && this.get('__ready')) {
          stream.cursorTo(0);
          stream.write('📦  ' + chalk.magenta(msg));
          stream.clearLine(1);
        } else if (percentage === 1) {
          console.log(chalk.green('\nwebpack: bundle build is now finished.'));
        }
      }),
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

    const compiler = webpack(webpackConfig);
    this.set('compiler', compiler);
  },

  'middleware'() {
    const { verbose } = this.query;
    const compiler = this.get('compiler', compiler);
    compiler.plugin('done', function doneHandler(stats) {
      if (verbose || stats.hasErrors()) {
        console.log(stats.toString({colors: true}));
      }
    });
    return require('koa-webpack-dev-middleware')(compiler, {
      publicPath: '/',
      quiet: true,
      ...this.query,
    });
  },

  'server.after'() {
    const { cwd, query } = this;
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
