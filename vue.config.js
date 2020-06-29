'use strict'
const path = require('path')

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 目标服务器 host
        changeOrigin: true,
        ws: true, // websockets
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      })
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve('src'),
      }
    }
  },
};