/*
 * @Author: DevinShi
 * @Date: 2020-02-04 01:44:35
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-25 17:43:35
 * @Description: file content description
 */
import '@babel/polyfill'

import Vue from 'vue'
import './vender/ant'
import './vender/dap'
import App from './App.vue'
import store from '@/store'
import router from '@/router'
import { RequestPlugin } from 'dap-ui'
import ModulePlugin from './plugins/module.plugin'
const config = require(`../public/config/${process.env.VUE_APP_CONFIG_JSON}`)
// import DapUiExtends from "./dap-extends/index";

import '../assets/less/app.less'
import moduleRegister from './modules';

// Vue.use(DapUiExtends);

Vue.config.productionTip = false

/**
 * 添加网络请求
 */
Vue.use(RequestPlugin, {
  // baseURL: process.env.VUE_APP_BASEURL,
  baseURL: config.baseDomain,
  businessErrorCatch: function (
    failRes: any,
    response: any,
    needShowMessage: any
  ) {
    // 通用业务错误处理
  },
  errorCatch: function (err, needShowMessage) {
    console.log(err)
    // return false 的情况下，不会执行系统默认逻辑
    if (err.response.status === 401) {
      // Vue.prototype.$message.error()
      router.replace({ path: '/BlankLayout/login' })
      return true
    } else {
      return true
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    Vue.use(ModulePlugin, {
      store: store,
      router: router
    })
    moduleRegister();
    if (config.themeColor === 'dark') {
      store.commit('themeModule/setThemeMode', 'dark')
      store.commit('themeModule/setThemeColor', '#1890ff')
    } else {
      store.commit('themeModule/setThemeMode', 'light')
      store.commit('themeModule/setThemeColor', config.themeColor)
    }
    store.commit('themeModule/setMutliTab', config.mutliTab)
  }
}).$mount('#app')
