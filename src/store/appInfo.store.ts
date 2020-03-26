import { IMenu } from '@/clazz/IMenu'

/*
 * @Author: DevinShi
 * @Date: 2020-02-22 19:17:52
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-22 19:31:41
 * @Description: file content description
 */
export const SET_APP_INFO = 'SET_APP_INFO'
export const SET_ACTIVE_MENU = 'SET_ACTIVE_MENU'
export const RESET_APP_INFO = 'RESET_APP_INFO'
export const SET_STATIC_MENU = 'SET_STATIC_MENU'

export const appInfoStore = {
  namespaced: true,
  state: {
    appInfo: {},
    activeMenu: null,
    staticMenus: []
  },
  mutations: {
    [SET_APP_INFO] (state: any, value: any) {
      state.appInfo = value
    },
    [SET_ACTIVE_MENU] (state: any, value: any) {
      state.activeMenu = value
    },
    [RESET_APP_INFO] (state: any) {
      state.appInfo = {}
      state.activeMenu = null
    },
    [SET_STATIC_MENU] (state: any, menus: any) {
      state.staticMenus = menus ;
    }
  },
  actions: {},
  getters: {}
}
