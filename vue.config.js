const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const smp = new SpeedMeasurePlugin()


module.exports = {
  productionSourceMap: false,
  publicPath: '/',
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://activity.proxy.beta.2239.com',   //代理接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'    //代理的路径
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
  }
}
