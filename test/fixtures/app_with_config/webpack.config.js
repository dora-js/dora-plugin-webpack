module.exports = function(webpackConfig, env) {
  webpackConfig.output.publicPath = '/coo';

  return webpackConfig;
}