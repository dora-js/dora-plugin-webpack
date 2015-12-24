import mergeCustomConfig from 'atool-build/lib/mergeCustomConfig';
import getWebpackCommonConfig from 'atool-build/lib/getWebpackCommonConfig';
import webpack, { ProgressPlugin } from 'atool-build/lib/webpack';
import { join } from 'path';
import chalk from 'chalk';
import assign from 'object-assign';

let webpackConfig;

export default {

  'middleware.before': (args) => {
    const { cwd, applyPlugins, query } = args;

    const customConfigPath = join(cwd, query.config || 'webpack.config.js');
    webpackConfig = mergeCustomConfig(getWebpackCommonConfig(args), customConfigPath, 'development');
    webpackConfig.devtool = '#source-map';

    webpackConfig.plugins.push(
      new ProgressPlugin((percentage, msg) => {
        const stream = process.stderr;
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0);
          stream.write('📦  ' + chalk.magenta(msg));
          stream.clearLine(1);
        } else if (percentage === 1) {
          console.log(chalk.green('\nwebpack: bundle build is now finished.'));
        }
      })
    );

    webpackConfig = applyPlugins('atool-build.updateWebpackConfig', webpackConfig);
  },

  middleware: (args) => {
    const { verbose } = args.query;
    // export compiler with global temporarily
    const compiler = global.g_dora_plugin_atool_build_compiler = webpack(webpackConfig);
    compiler.plugin('done', function doneHandler(stats) {
      if (verbose || stats.hasErrors()) {
        console.log(stats.toString({colors: true}));
      }
    });
    return require('koa-webpack-dev-middleware')(compiler, assign({
      publicPath: '/',
      quiet: true,
    }, args.query));
  },
};
