/*
 * @Author: DevinShi
 * @Date: 2020-02-05 06:55:53
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-23 17:36:44
 * @Description: file content description
 */
import Vue from 'vue'
import Vuex, { Payload, Store } from 'vuex'
import VuexPersistence from 'vuex-persist'

import { themeStore } from './theme.store'
import { appInfoStore } from './appInfo.store'
import { authStore } from './auth.store'
import { mutiTabStore } from './mutiTab.store'

Vue.use(Vuex)

const vuexCookie = new VuexPersistence({
  restoreState: (key, storage) => {
    const data = Vue.prototype.$cookies.get(key)
    return data
  },
  saveState: (key, state, storage) => {
    Vue.prototype.$cookies.set(key, state, {
      // expires: 3
    })
  },
  modules: [], // only save user module
  filter: mutation => {
    return true
  }
})
const vuexLocal = new VuexPersistence({
  restoreState: (key, storage) => {
    const data = Vue.prototype.$ls.get(key)
    return data
  },
  saveState: (key, state, storage) => {
    Vue.prototype.$ls.set(key, state)
  },
  modules: ['themeModule', 'appInfoModule', 'authModule'], // only save user module
  filter: mutation => {
    return true
  }
})

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    appInfoModule: appInfoStore,
    themeModule: themeStore,
    authModule: authStore,
    mutiTabModule: mutiTabStore
  },
  plugins: [vuexCookie.plugin, vuexLocal.plugin]
})
