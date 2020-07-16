const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()
const path = require('path');
function resolve(dir){
  return path.join(__dirname,dir)
}

module.exports = {
  productionSourceMap: false,
  publicPath: '/',
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        // target: 'http://proxy.tc.2239.com/web/v1',   //代理接口
        target: 'http://cfyf.beta.2239.com/web/v1',   //代理接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''    //代理的路径
        }
      }
    }
  },
  configureWebpack: smp.wrap(function() {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: []
      }
    } else {
      return {
        plugins: []
      }
    }
  }()),
  chainWebpack: (config) => {
    // config.plugin("html").tap(arg => {
    //   return arg
    // })
    config.resolve.alias
        .set('@',resolve('./src'))
        .set('components',resolve('./src/components'))
        .set('views',resolve('./src/views'))
        .set('assets',resolve('./src/assets'))
  }
}
