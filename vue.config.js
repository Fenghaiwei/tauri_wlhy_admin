const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: './',
  outputDir: process.env.VUE_APP_BUILDENV,
  assetsDir: 'static',
  devServer: {
    open: true,
    port: 8177,
    // proxy: {
    //   '/sijibao-operation': {
    //     target: 'http://yf.sijibao.co:9118/sijibao-operation',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/sijibao-operation': ''
    //     }
    //   }
    // },
    disableHostCheck: true
  },
  configureWebpack: config => {
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          // 单独打包mock/sysData
          sysData: {
            name: 'chunk-sysData',
            priority: 20, // 权重 数字越大越高
            test: /[\\/]mock[\\/]sysData[\\/]/,
            chunks: 'all'
          }
        }
      }
    };

    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8
          })
        ]
      };
    } else {
      // 为开发环境修改配置...
    }
  },
  chainWebpack: config => {
    // 这里可以修改webpack配置
  }
};
