const glob = require('glob');
const pkg = require('./package.json');
// 环境
process.env.VUE_APP_ENV = process.env.NODE_ENV;
// 版本号
process.env.VUE_APP_VERSION = pkg.version;
// 编译时间
process.env.VUE_APP_TIME = new Date().valueOf();

// vue-cli对打包配置hash，import()等抽离都只认process.env.NODE_ENV = 'production'
if (['test'].indexOf(process.env.NODE_ENV) > -1) {
  process.env.NODE_ENV = 'production';
}

const pages = (() => {
  const pages = {};
  glob.sync('./src/pages/*/index.js').forEach(filepath => {
    const fileList = filepath.split('/');
    const fileName = fileList[fileList.length - 2];
    pages[fileName] = {
      entry: filepath,
      template: filepath.replace(/.js$/, '.html'),
      filename: `${fileName}.html`,
      chunks: ['chunk-vendors', 'chunk-common', fileName],
      minify: {}
    };
  });
  return pages;
})();

module.exports = {
  publicPath: '/',
  pages,
  productionSourceMap: false,
  filenameHashing: false,
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import \'~@/css/variables.scss\';'
      }
    }
  },
  chainWebpack (config) {
    Object.keys(pages).forEach(page => {
      // 移除 prefetch 插件
      config.plugins.delete(`prefetch-${page}`);
      // 移除 preload 插件
      config.plugins.delete(`preload-${page}`);
    });

    // 图片,视频,音频 不转base64
    ['images', 'media'].forEach(k => {
      config.module
        .rule(k)
        .use('url-loader')
        .loader('url-loader')
        .tap(options => Object.assign(options, { limit: 0 }));
    });
  },
  configureWebpack (config) {
    // 取消控制台打包大小警告
    config.performance = {
      hints: false
    };
  }
};
