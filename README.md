# dora-plugin-atool-build

atool-build plugin for dora.

----

## Usage

```bash
$ dora --plugins atool-build
```

with options:

```bash
$ dora --plugins atool-build?publicPath=/${npm_pkg_name}
```

### Options

- `publicPath` -- default '/', http://webpack.github.io/docs/configuration.html#output-publicpath
- `config` -- default 'webpack.config.js'


## Plugins

- `atool-build.updateWebpackConfig` -- update webpack config after this plugin

## 注意
 
为了和其他 plugin 通讯，并且没有找到更好的方法这里，这里临时先暴露了 `global.g_dora_plugin_atool_build_compiler`。
