// 1.通过webpack-bundle-analyzer插件定位项目问题
// 2.本地使用相关包（vue/vuex/axios/vue-router）,打包时通过webpack externals将这些包分离出去，减少体积
const isProduction = process.env.NODE_ENV === 'production'
const cdn = {
  js: [
    'https://cdn.bootcss.com/vue/2.5.17/vue.runtime.min.js',
    'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
    'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
    'https://cdn.bootcss.com/axios/0.18.0/axios.min.js'
  ]
}
module.exports = {
  publicPath: './',
  assetsDir: 'static',
  devServer: {
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    // npm run analyzer 找出占用程序控件的插件，可以进行优化
    if (process.env.use_analyzer) { // 分析
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
    if (isProduction) {
      // 生产环境注入cdn
      config.plugin('html')
        .tap(args => {
          args[0].cdn = cdn
          return args
        })
    }

    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')
  },
  configureWebpack: config => {
    if (isProduction) {
      // 用cdn方式引入
      config.externals = {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'axios': 'axios'
      }
    }
  }
}
