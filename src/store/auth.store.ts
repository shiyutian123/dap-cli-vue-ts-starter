/*
 * @Author: DevinShi
 * @Date: 2020-02-22 19:18:57
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-25 15:24:05
 * @Description: file content description
 */
/*
 * @Author: DevinShi
 * @Date: 2020-02-05 06:38:46
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-22 18:36:19
 * @Description: file content description
 */

/**
 * 项目默认配置项
 * primaryColor - 默认主题色
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式 ,暂不支持
 * layout - 整体布局方式 ['horizontal', 'vertical'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * autoHideHeader - 向下滚动时，隐藏 Header : boolean , 暂不支持
 * contentWidth - 内容区布局： 流式 |  固定
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export const SET_TOKEN = 'SET_TOKEN'
export const SET_USER = 'SET_USER'
export const RESET_AUTH_STORE = 'RESET_AUTH_STORE'

export const authStore = {
  namespaced: true,
  state: {
    token: {},
    user: null,
    permission: {}
  },
  mutations: {
    [SET_TOKEN] (state: any, token: any) {
      state.token.token = token.token || state.token.token
      state.token.expire = token.expire || state.token.expire
      state.token.currentTime = new Date().getTime()
      state.token = { ...state.token }
    },
    [SET_USER] (state: any, userInfo: any) {
      state.user = userInfo
    },
    [RESET_AUTH_STORE] (state) {
      state.token = {}
      state.user = null
      state.permission = {}
    }
  },
  actions: {},
  getters: {
    tokenValue: (state, getters) => {
      return new Date().getTime() - state.token.currentTime > state.token.expire
        ? ''
        : state.token.token
    }
  }
}
