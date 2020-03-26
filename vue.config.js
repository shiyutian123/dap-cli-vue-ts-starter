'use strict'

const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')

const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const chalk = require('chalk')

const generate = require('@ant-design/colors/lib/generate').default

// const VueRouterInvokeWebpackPlugin = require('@liwb/vue-router-invoke-webpack-plugin');

const ThemeColorReplacer = require('webpack-theme-color-replacer')

// function getAntdSerials(color) {
//   const lightens = new Array(9).fill().map((t, i) => {
//     return ThemeColorReplacer.varyColor.lighten(color, i / 10);
//   });
//   // 此处为了简化，采用了darken。实际按color.less需求可以引入tinycolor, colorPalette变换得到颜色值
//   const darkens = new Array(6).fill().map((t, i) => {
//     return ThemeColorReplacer.varyColor.darken(color, i / 10);
//   });
//   const result = lightens.concat(darkens);
//   console.log(result)
//   return result;
// }

function getAntdSerials (color) {
  // 淡化（即less的tint）
  const lightens = new Array(9).fill(0).map((t, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / 10)
  })
  // colorPalette变换得到颜色值
  const colorPalettes = generate(color)
  return lightens.concat(colorPalettes)
}

const resolve = dir => {
  return path.join(__dirname, './', dir)
}

const isProd = () => {
  return process.env.NODE_ENV === 'production'
}

const genPlugins = () => {
  const plugins = [
    new ProgressBarPlugin({
      format:
        '  build [:bar] ' +
        chalk.green.bold(':percent') +
        ' (:elapsed seconds)',
      clear: false
    }),

    new ThemeColorReplacer({
      fileName: 'css/theme-colors-[contenthash:8].css',
      matchColors: getAntdSerials('#1890ff'), // 主色系列
      // 改变样式选择器，解决样式覆盖问题
      changeSelector (selector) {
        switch (selector) {
          case '.ant-calendar-today .ant-calendar-date':
            return ':not(.ant-calendar-selected-date)' + selector
          case '.ant-btn:focus,.ant-btn:hover':
            return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)'
          case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
            return null
          case '.ant-btn.active,.ant-btn:active':
            return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)'
          case '.ant-menu-horizontal>.ant-menu-item-active,.ant-menu-horizontal>.ant-menu-item-open,.ant-menu-horizontal>.ant-menu-item-selected,.ant-menu-horizontal>.ant-menu-item:hover,.ant-menu-horizontal>.ant-menu-submenu-active,.ant-menu-horizontal>.ant-menu-submenu-open,.ant-menu-horizontal>.ant-menu-submenu-selected,.ant-menu-horizontal>.ant-menu-submenu:hover':
          case '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal > .ant-menu-submenu-selected,.ant-menu-horizontal > .ant-menu-submenu:hover':
            return '.ant-menu-horizontal > .ant-menu-item-active,.ant-menu-horizontal > .ant-menu-item-open,.ant-menu-horizontal > .ant-menu-item-selected,.ant-menu-horizontal > .ant-menu-item:hover,.ant-menu-horizontal > .ant-menu-submenu-active,.ant-menu-horizontal > .ant-menu-submenu-open,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu-selected,.ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu:hover'
          default:
            return selector
        }
      },
      injectCss: false, // optional. Inject css text in js file, not need to download `theme-colors-xxx.css` any more.
      isJsUgly: process.env.NODE_ENV !== 'development' // optional. Set to `true` if your js is uglified. Default is set by process.env.NODE_ENV.
    })
  ]

  if (isProd()) {
    plugins
      .push
      // //生产环境自动删除console
      // new UglifyJsPlugin({
      //   uglifyOptions: {
      //     comments: false,
      //     warnings: false,
      //     drop_debugger: true,
      //     drop_console: true
      //   },
      //   sourceMap: true,
      //   parallel: true
      // })
      ()
    plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css', 'html'].join('|') + ')$'),
        // deleteOriginalAssets: true,
        threshold: 10240,
        minRatio: 0.8,
        cache: false
      })
    )
    plugins.push(
      new FileManagerPlugin({
        // 初始化 filemanager-webpack-plugin 插件实例
        onEnd: {
          delete: [
            // 首先需要删除项目根目录下的dist.zip
            './view.zip'
          ],
          archive: [
            // 然后我们选择dist文件夹将之打包成dist.zip并放在根目录
            { source: './dist', destination: './view.zip' }
          ]
        }
      })
    )
  }

  return plugins
}

module.exports = {
  publicPath: './',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    disableHostCheck: false,
    https: false,
    hotOnly: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // 代理接口
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/mock' // 代理的路径
        }
      }
    }
  },
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: isProd() ? false : false,
    // 开启 CSS source maps?
    sourceMap: !!isProd(),
    // css预设器配置项
    loaderOptions: {
      less: {
        modifyVars: {
          // 'primary-color': '#1DA57A',
          // 'link-color': '#1DA57A',
          // 'border-radius-base': '1px'
          'font-size-base': '13px'
        },
        javascriptEnabled: true
        // importLoaders: 1
      }
    }
  },
  configureWebpack: () => ({
    name: 'vue-cli3-template',
    resolve: {
      alias: {
        // vue动态值
        vue$: 'vue/dist/vue.esm.js',

        // vue快速路径
        '@': resolve('src'),
        '@assets': resolve('src/assets'),
        '@less': resolve('src/assets/less'),
        '@js': resolve('src/assets/js'),
        '@css': resolve('src/assets/css'),
        '@components': resolve('src/components'),
        '@mixins': resolve('src/mixins'),
        '@store': resolve('src/store'),
        '@pages': resolve('src/pages'),

        // 文件别名
        services: resolve('src/services'),
        variable: resolve('src/assets/less/variable.less'),
        utils: resolve('node_modules/@liwb/cloud-utils/dist/cloud-utils.esm'),
        mixins: resolve('node_modules/magicless/magicless.less')
      }
    },
    plugins: genPlugins()
  }),
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: config => {
    // webpack-html-plugin
    config.plugin('html').tap(args => {
      args[0].minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
      return args
    })

    //
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.use('vue-svg-loader').loader('vue-svg-loader')

    // optimization
    config.when(process.env.NODE_ENV === 'production', config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // 只打包初始时依赖的第三方
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // 可自定义拓展你的规则
            minChunks: 3, // 最小公用次数
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        "src/assets/less/app.less"
      ]
    },
    lintStyleOnBuild: true,
    stylelint: {}
  }
}
