# dora-plugin-atool-build

[![NPM version](https://img.shields.io/npm/v/dora-plugin-atool-build.svg?style=flat)](https://npmjs.org/package/dora-plugin-atool-build)
[![Build Status](https://img.shields.io/travis/dora-js/dora-plugin-atool-build.svg?style=flat)](https://travis-ci.org/dora-js/dora-plugin-atool-build)
[![Coverage Status](https://img.shields.io/coveralls/dora-js/dora-plugin-atool-build.svg?style=flat)](https://coveralls.io/r/dora-js/dora-plugin-atool-build)
[![NPM downloads](http://img.shields.io/npm/dm/dora-plugin-atool-build.svg?style=flat)](https://npmjs.org/package/dora-plugin-atool-build)

atool-build plugin for dora.

----

## Usage

```bash
$ dora --plugins atool-build
```

with options:

```bash
$ dora --plugins atool-build?publicPath=/${npm_pkg_name}&verbose
```

with options in Object:

```bash
$ dora --plugins atool-build?{"watchOptions":{"poll":true}}
```

### Options

- `publicPath` -- default '/', http://webpack.github.io/docs/configuration.html#output-publicpath
- `config` -- default 'webpack.config.js'
- `verbose` -- more logs

And other webpack options, like `watchOptions`, `headers`, `stats`, ...


## Plugins

- `atool-build.updateWebpackConfig` -- update webpack config for development

