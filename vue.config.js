const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: './',
  outputDir: 'test', //打包输出目录
  assetsDir: './static', //放置生成的静态资源
  filenameHashing: true, // 生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
  lintOnSave: false, //设置是否在开发环境下每次保存代码时都启用 eslint验证
  productionSourceMap: false,// 打包时不生成.map文件
  transpileDependencies: true,
  devServer: {
    host: 'localhost',
    // disableHostCheck: true,
    open: true,
    proxy: {
      '/api': {
        target: 'localhost:9090', 
        // target: 'http://192.168.3.250:12345',      //对应后台的接口
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true,
        secure: false,
      }
    }
  }
})