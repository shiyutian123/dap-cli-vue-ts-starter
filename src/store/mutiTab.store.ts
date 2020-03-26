/*
 * @Author: DevinShi
 * @Date: 2020-02-22 19:17:52
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-22 19:31:41
 * @Description: file content description
 */
export const PUSH_ROUTER_VIEW = 'PUSH_ROUTER_VIEW'
// export const IS_ROUTER_IN_TABS = "IS_ROUTER_IN_TABS";
export const POP_ROUTER_VIEW = 'POP_ROUTER_VIEW'

export const mutiTabStore = {
  namespaced: true,
  state: {
    showTabs: []
  },
  mutations: {
    [PUSH_ROUTER_VIEW] (state: any, routeViewConfig: any) {
    //   state.appInfo = value;
      state.showTabs.push(routeViewConfig)
    },
    [POP_ROUTER_VIEW] (state: any, routeViewConfig: any) {
      state.showTabs.forEach((tab, index) => {
        if (tab.key === routeViewConfig.key) {
          state.showTabs.splice(index, 1)
        }
      })
    }
  },
  actions: {},
  getters: {}
}
