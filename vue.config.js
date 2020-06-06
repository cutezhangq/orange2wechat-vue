const vConsolePlugin = require('vconsole-webpack-plugin')
const path = require('path');
//Webpack包文件分析器
const publicPath = process.env.NODE_ENV === "production" ? "/static/" : "/"; //font scss资源路径 不同环境切换控制
function resolve (dir) {
    return path.join(__dirname, dir)
}
const webpack = require('webpack');
module.exports = {
  // 基本路径
  publicPath: './',// './'    process.env.NODE_ENV === "production" ? "/wechat/" : "/wechat/"
  // 输出文件目录
  outputDir: 'wechat',//outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  assetsDir: 'static',
  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  runtimeCompiler: false,
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  configureWebpack: config => {
    //生产环境去掉vconsole调试器
  // let envType = process.env.NODE_ENV != 'production'
  // let pluginsDev = [
  //     new vConsolePlugin({
  //         filter: [],
  //         enable: envType
  //     })
  // ]

  // config.plugins = [...config.plugins, ...pluginsDev]
 },
  chainWebpack: (config)=>{
    config.resolve.alias
        .set('@$', resolve('src'))
        .set('assets',resolve('src/assets'))
        .set('components',resolve('src/components'))
        .set('common',resolve('src/common'))
        // .set('static',resolve('src/static'))
},
  // vue-loader 配置项
  // https://vue-loader.vuejs.org/en/options.html
  // vueLoader: {},
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
   extract: true,
   sourceMap: false,
   loaderOptions: {
     stylus: {
       'resolve url': true,
       'import': [
         './src/theme'
       ]
     },
     less: {
      javascriptEnabled: true
    }
   },
   modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // 是否启用dll
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,
  // PWA 插件相关配置
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
   open: false,
   //host: '0.0.0.0',
   host: 'localhost',
   port: 8080,
   https: false,
   hotOnly: false,
   //autoOpenBrowser: true,
   clientLogLevel: 'info',
   before: app => {}
  },
  // 第三方插件配置
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  // globals:{
  //   'Swiper':true
  // }

 }
//  function resolve(dir) {
//   return path.join(__dirname, dir)
// }