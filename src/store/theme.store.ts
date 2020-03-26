/*
 * @Author: DevinShi
 * @Date: 2020-02-05 06:38:46
 * @LastEditors: DevinShi
 * @LastEditTime: 2020-02-22 20:49:13
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

import { ITheme } from '../clazz/ITheme'

import client from 'webpack-theme-color-replacer/client'
import generate from '@ant-design/colors/lib/generate'

const ThemeEngine = {
  getAntdSerials (color) {
    // 淡化（即less的tint）
    const lightens = new Array(9).fill(0).map((t, i) => {
      return client.varyColor.lighten(color, i / 10)
    })
    // colorPalette变换得到颜色值
    const colorPalettes = generate(color)
    return lightens.concat(colorPalettes)
  },

  changePrimaryColor (newColor) {
    console.log(this.getAntdSerials(newColor))
    const options = {
      newColors: this.getAntdSerials(newColor), // new colors array, one-to-one corresponde with `matchColors`
      changeUrl (cssUrl) {
        return `./${cssUrl}` // while router is not `hash` mode, it needs absolute path
      }
    }
    return client.changer.changeColor(options, Promise)
  }
}

export const themeStore = {
  namespaced: true,
  state: {
    theme: {
      navTheme: 'dark',
      // navTheme: "light",
      primaryColor: '#52C41A',
      contentWidth: 'fixed',
      layout: 'horizontal',
      siderWidth: 200,
      headerFixed: true,
      siderFixed: true,
      mutliTab: false,
      production: process.env.NODE_ENV === 'production'
    } as ITheme
  },
  mutations: {
    setThemeColor (state, color) {
      state.theme.primaryColor = color
      ThemeEngine.changePrimaryColor(color)
    },
    setThemeMode (state, mode) {
      state.theme.navTheme = mode === 'dark' ? 'dark' : 'light'
    },
    setMutliTab (state, mutliTab) {
      state.theme.mutliTab = mutliTab
    }
  },
  actions: {},
  getters: {}
}
