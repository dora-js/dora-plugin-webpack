# dora-plugin-atool-build

atool-build plugin for dora.

----

## Usage

```bash
$ npm i dora dora-plugin-atool-build -SD
$ ./node_modules/.bin/dora --plugins atool-build
```

with options:

```bash
$ ./node_modules/.bin/dora --plugins atool-build?publicPath=/${npm_pkg_name}
```

### Options

- `publicPath` -- default '/', http://webpack.github.io/docs/configuration.html#output-publicpath


## Plugins

- `atool-build.updateWebpackConfig` -- update webpack config after atool-build

 
