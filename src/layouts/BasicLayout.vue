<!--
 * @Author: DevinShi
 * @Date: 2020-02-04 08:36:50
 * @LastEditors: your name
 * @LastEditTime: 2020-03-13 16:10:54
 * @Description: file content description
 -->
<template>
  <!-- 基础侧边栏布局路由，支持mutilTab -->
  <a-layout
    v-if="isShow"
    class="custom-layout"
    :width="theme.siderWidth + 'px'"
  >
    <a-layout-sider
      class="sider"
      :class="{
        'ant-fixed-sidemenu': true,
        light: theme.navTheme === 'light',
        dark: theme.navTheme === 'dark'
      }"
      :trigger="null"
      collapsible
      v-model="collapsed"
    >
      <div
        class="logo"
        :class="{
          light: theme.navTheme === 'light',
          dark: theme.navTheme === 'dark'
        }"
      >
        <img
          :src="collapsed ? appInfo.fullLogo : appInfo.smallLogo"
          alt="logo"
        />
      </div>
      <div
        class="menu-switch"
        :class="{
          light: theme.navTheme === 'light',
          dark: theme.navTheme === 'dark'
        }"
        @click="() => (collapsed = !collapsed)"
      >
        <a-icon
          :type="collapsed ? 'right' : 'left'"
          class="trigger"
          theme="outlined"
        />
      </div>
      <div class="menu">
        <sider-menu
          :menuList="menuList"
          :theme="theme.navTheme"
          :defaultOpenKeys="defaultOpenKeys"
          :defaultSelectedKeys="defaultSelectedKeys"
          @menu-click="onMenuClick"
        ></sider-menu>
      </div>
    </a-layout-sider>
    <a-layout
      :style="{ 'padding-left': collapsed ? '80px' : theme.siderWidth + 'px' }"
      class="content"
    >
      <a-layout-header
        :style="{
          width: `calc(100% - ${collapsed ? 80 : theme.siderWidth}px)`
        }"
        :class="{
          'ant-fixed-header': true,
          light: theme.navTheme === 'light',
          dark: theme.navTheme === 'dark'
        }"
        class="content-header"
      >
        <h2>{{ appInfo.name }}</h2>
        <!-- <user-center></user-center> -->
      </a-layout-header>
      <a-layout-content
        :class="{ 'content-fixed-center': true }"
        class="content-center"
      >
        <div class="center-header" :class="{'muti-center-header': theme.mutliTab}">
          <a-icon type="appstore" theme="filled" />
          <a-breadcrumb v-if="!theme.mutliTab" class="center-breadcrumb">
            <a-breadcrumb-item
              v-for="(item, index) in breadcrumbNavs"
              :key="index"
              >{{ item }}</a-breadcrumb-item
            >
          </a-breadcrumb>
          <a-tabs v-if="theme.mutliTab" hideAdd v-model="mutiTabActiveKey" type="editable-card"
              @edit="tabEdit"
              @tabClick="tabClick">
            <a-tab-pane
              v-for="tabItem in showTabs"
              :tab="tabItem.title"
              :key="tabItem.key"
              :closable="tabItem.closable">
            </a-tab-pane>
          </a-tabs>
        </div>
        <div class="center-content">
          {{$route.meta.keepAlive && theme.mutliTab}}
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive && theme.mutliTab"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive || !theme.mutliTab "></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer class="center-footer" style="text-align: center">
        DAP @2020 Created by Definesys DAP Team
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import SiderMenu from '../components/menu/SiderMenu.vue'
import { State, Mutation, namespace } from 'vuex-class'
import { ITheme } from '../clazz/ITheme'
import { IMenu } from '../clazz/IMenu'
import apis from '../api'
import { SET_ACTIVE_MENU } from '@/store/appInfo.store.ts'
import { PUSH_ROUTER_VIEW, POP_ROUTER_VIEW } from '@/store/mutiTab.store.ts'

import UserCenter from '@/components/UserCenter/UserCenter.vue'

const config = require(`../../public/config/${process.env.VUE_APP_CONFIG_JSON}`)

const appInfoModule = namespace('appInfoModule')
const authModule = namespace('authModule')
const mutiTabModule = namespace('mutiTabModule')

@Component({
  components: {
    'sider-menu': SiderMenu
    // "user-center": UserCenter
  }
})
export default class BasicLayout extends Vue {
  isShow = false;
  name = 'BasicLayout';
  collapsed = false;
  menuList: Array<IMenu> = [];
  defaultOpenKeys: Array<string> = [];
  defaultSelectedKeys: Array<string> = [];
  appInfo = {
    name: 'DAP引擎脚手架',
    fullLogo: '',
    smallLogo: ''
  };

  breadcrumbNavs: Array<string> = [];

  mutiTabActiveKey = '';

  // @State(state => state.themeModule.theme) theme: ITheme;
  @State('theme', { namespace: 'themeModule' }) theme: ITheme;
  @State('activeMenu', { namespace: 'appInfoModule' }) activeMenu: IMenu;
  @State('staticMenus', { namespace: 'appInfoModule' }) staticMenus: Array<IMenu>;
  @State('showTabs', { namespace: 'mutiTabModule' }) showTabs: Array<any>;

  @authModule.Getter('tokenValue') tokenValue: any;
  @appInfoModule.Mutation(SET_ACTIVE_MENU) setActiveMenu: any;

  @mutiTabModule.Mutation(PUSH_ROUTER_VIEW) pushTabRouterView: any;
  @mutiTabModule.Mutation(POP_ROUTER_VIEW) popTabRouterView: any;

  @Watch('tokenValue')
  onTokenValue (newVal: any, oldVal: any) {
    if (newVal) {
      this.queryAppInfo()
    }
  }

  created () {
    if (this.tokenValue) {
      this.queryAppInfo()
    }
  }

  queryAppInfo () {
    const QUERY_APP_INFO = {
      url: apis.QUERY_APP_INFO,
      method: 'get',
      params: {
        appCode: config.appInfo.appCode
      }
    };
    (this as any)
      .$request(QUERY_APP_INFO)
      .aysncThen(
        (resp: any) => {
          this.isShow = true
          if (resp.code === 'ok') {
            this.appInfo = {
              name: resp.data.appTitle,
              fullLogo: resp.data.appIcon,
              smallLogo: resp.data.browserIcon
            }
            // this.menuList = this.dealDefaultList(resp.data.defaultMenus)
            this.menuList = this.staticMenus;
            this.dealMenusList([], this.menuList);
            if (!this.activeMenu) {
              const menu = this.getFirstMenu(this.menuList)
              this.defaultSelectedKeys.push(menu.key)
              this.navigateToMenu(menu)
            } else {
              this.defaultSelectedKeys.push(this.activeMenu.key)
              this.initBreadcrumbNavs(this.activeMenu, this.menuList, [])
            }
            this.initBrowserIcon(resp.data.browserIcon)
            document.title = resp.data.appTitle
          }
        },
        businessError => {
          this.isShow = false
          this.$router.push('/BlankLayout/unauthorized')
        }
      )
      .aysncErrorCatch((error: any) => {
        console.error(error.message)
      })
  }

  dealDefaultList (arr: Array<string>): Array<IMenu> {
    const defaultMenus: Array<IMenu> = []
    arr.forEach((item: any) => {
      if (item === 'todo') {
        defaultMenus.push({
          key: 'todo',
          title: '我的待办',
          icon: 'home',
          meta: {
            functionType: 'DefaultMenu',
            path: 'myTodoList'
          },
          children: []
        } as IMenu)
      } else if (item === 'authorization') {
        defaultMenus.push({
          key: 'authorization',
          title: '流程授权',
          icon: 'database',
          meta: {
            functionType: 'DefaultMenu',
            path: 'processAuthorization'
          },
          children: []
        } as IMenu)
      } else if (item === 'tracking') {
        defaultMenus.push({
          key: 'tracking',
          title: '审批跟踪',
          icon: 'profile',
          meta: {
            functionType: 'DefaultMenu',
            path: 'approvalTracking'
          },
          children: []
        } as IMenu)
      } else if (item === 'case') {
        defaultMenus.push({
          key: 'case',
          title: '流程实例',
          icon: 'deployment-unit',
          meta: {
            functionType: 'DefaultMenu',
            path: 'processCase'
          },
          children: []
        } as IMenu)
      }
    })
    return defaultMenus
  }

  dealMenusList (data: any, arr: Array<IMenu>) {
    if (data instanceof Array) {
      data.forEach((item: any) => {
        const menu: IMenu = {
          key: item.code,
          title: item.name,
          icon: item.icon,
          meta: {
            ...item
          },
          children: []
        }
        if (item.childs && item.childs.length > 0) {
          this.defaultOpenKeys.push(menu.key)
          this.dealMenusList(item.childs, menu.children)
        }
        arr.push(menu)
      })
    }
  }

  getFirstMenu (menuList: Array<IMenu>): IMenu {
    return (!menuList[0].children || menuList[0].children.length === 0)
      ? menuList[0]
      : this.getFirstMenu(menuList[0].children)
  }

  initBrowserIcon (icon: string) {
    const link = document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = icon
    const head = document.getElementsByTagName('head')[0]
    const arr = Array.from(head.getElementsByTagName('link')).filter(
      item => item.rel === 'icon'
    )
    if (arr.length > 0) {
      arr.forEach(item => {
        head.removeChild(item)
      })
    }
    head.appendChild(link)
  }

  initBreadcrumbNavs (menu: IMenu, arr: Array<IMenu>, stack: Array<string>) {
    arr.forEach(item => {
      if (item.key === menu.key) {
        this.breadcrumbNavs.push(...stack, item.title)
      } else if (item.children.length > 0) {
        const stackCopy = JSON.parse(JSON.stringify(stack))
        stackCopy.push(item.title)
        this.initBreadcrumbNavs(menu, item.children, stackCopy)
      }
    })
  }

  onMenuClick (menu: IMenu) {
    this.navigateToMenu(menu)
  }

  navigateToMenu (menu: IMenu) {
    this.setActiveMenu(menu)
    this.breadcrumbNavs = []
    this.initBreadcrumbNavs(menu, this.menuList, [])
    if (menu.meta.layout) {
      this.navigateToPage({
        name: menu.meta.path,
        title: menu.title,
        params: { 
          code: menu.key,
          layout: menu.meta.layout
        }
      })
    } else {
      this.navigateToPage({
        name: menu.meta.path,
        title: menu.title,
        params: { code: menu.key }
      })
    }
  }

  /**
   * 跳转指定页面
   */
  navigateToPage (routerConfig) {
    routerConfig.query = {
      ...routerConfig.query,
      tabKey: routerConfig.params.code
    }
    const tabConfig = {
      title: routerConfig.title,
      key: routerConfig.params.code,
      routerConfig: routerConfig
    }
    let inTabs = false
    this.showTabs.forEach((tab, index) => {
      if (tabConfig.key === tab.key) {
        inTabs = true
      }
    })
    if (!inTabs) {
      this.pushTabRouterView(tabConfig)
    }
    this.mutiTabActiveKey = routerConfig.params.code;
    (this as any).$router.push(routerConfig)
    // 跳转
  }

  tabEdit (event) {
    console.warn(event)
  }

  tabClick (event) {
    console.warn(event)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.custom-layout {
  min-height: 100vh;
  .sider {
    position: relative;
    z-index: 106;
    min-height: 100vh;

    .logo {
      height: 48px;
      line-height: 48px;
      margin: 6px 16px;
      text-align: center;

      &.light {
        background: #ffffff;
      }

      &.dark {
        background: #364453;
      }

      img {
        max-height: 48px;
        max-width: 56px;
      }
    }

    .menu-switch {
      width: 15px;
      height: 80px;
      line-height: 80px;
      padding-right: 2px;
      border-top-right-radius: 17px;
      border-bottom-right-radius: 17px;
      border: 1px solid #e8e8e8;
      border-left: 0;
      font-size: 0.7rem;
      text-align: right;
      position: absolute;
      top: calc(50% - 45px);
      right: 3px;
      -webkit-transform: translateX(120%);
      transform: translateX(120%);
      cursor: pointer;
      opacity: 0.3;

      &.light {
        background: #fff;
        color: rgba(0, 0, 0, 0.4);
      }

      &.dark {
        background: #364453;
        color: #fff;
      }
    }

    .menu-switch:hover {
      opacity: 0.8;
    }

    &.light {
      background: #fff;
      box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
    }

    &.dark {
      background: #001529;
      box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
    }
  }

  .ant-fixed-sidemenu {
    position: fixed;
    height: 100%;
  }

  .content {
    min-height: 100vh;

    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px 0 24px;
      background-color: #1890ff;
      h2 {
        font-size: 1.4rem;
        color: #ffffff;
        font-weight: 700;
        margin: 0;
      }
    }

    .content-center {
      position: relative;
      margin: 0;
      background: #f7f7f7;
      .center-header {
        display: flex;
        align-items: center;
        height: 45px;
        line-height: 45px;
        padding-left: 20px;
        background: #fff;
        border-bottom: 1px solid #e2e2e2;
      }

      .center-breadcrumb {
        height: 45px;
        line-height: 45px;
        margin-left: 10px;
      }

      .center-content {
        margin: 20px;
        height: calc(100vh - 216px);
      }
    }

    .center-footer {
      background: #f7f7f7;
    }

    .content-fixed-center {
      padding-top: 64px;
    }

    .ant-header {
      position: relative;
      z-index: 905;
    }

    .ant-fixed-header {
      position: fixed;
      z-index: 905;
    }
  }
}
</style>

<style lang="less">
.muti-center-header {
  .ant-tabs {
    margin-bottom: -5px;
    width: calc(100vw - 620px);

    .ant-tabs-top-bar {
      margin: 0 0 0px 8px;
    }
  }
}

.custom-layout {
  .ant-menu-vertical {
    border-right: none;
  }

  .ant-header.dark {
    background: #fff !important;

    > h2 {
      color: #333 !important;
    }

    .user-display-block {
      color: #333 !important;
    }
  }

  .ant-fixed-header.dark {
    background: #fff !important;

    > h2 {
      color: #333 !important;
    }

    .user-display-block {
      color: #333 !important;
    }
  }
}
</style>
