import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/index";

const config = require(`../../public/config/index.json`);

Vue.use(VueRouter)

const Welcome = Vue.extend({
  template: `<div><p>{{firstName}} {{lastName}} aka {{alias}}</p>
  <div class="about">
  <h1>This is an about page</h1>
  <a-button-group>
    <a-button>Cancel</a-button>

    <a-button type="primary">OK</a-button>
  </a-button-group>
</div></div>`,
  data: function () {
    return {
      firstName: 'Walter',
      lastName: 'White',
      alias: 'Heisenberg'
    }
  }
})

const routes = [
  {
    component: () =>
      import('@/pages/Layout.vue'),
    name: 'layout',
    path: '/:layout([a-zA-Z_]+Layout)',
    children: [
      {
        meta: {
          layout: 'BlankLayout'
        },
        path: 'login',
        name: 'login',
        component: () =>
          import('@/pages/account/Login.vue')
      },
      {
        meta: {
          layout: 'BasicLayout'
        },
        path: 'systemFunTip',
        name: 'systemFunTip',
        component:  () =>  import('@/pages/system-fun-tip/SystemFunTip.vue')
      },
      {
        meta: {
          layout: 'BasicLayout'
        },
        path: 'welcome',
        name: 'welcome',
        component: Welcome
      }
    ]
  },
  {
    path: '/',
    redirect: '/BlankLayout/login'
  },
  {
    path: '/login',
    redirect: '/BlankLayout/login'
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

/**
 * 单点登录路由
 * @param to
 * @param from
 * @param next
 */
function authSso(to, from, next) {
  if (!config.needSSO) {
    const token = (store as any)._wrappedGetters["authModule/tokenValue"](
      store
    );
    if (token || to.path === "/BlankLayout/login") {
      if (to.meta.layout) {
        const pathArray = to.path.split("/");
        if (pathArray.length >= 2 && pathArray[1] !== to.meta.layout) {
          pathArray[1] = to.meta.layout;
          const nextPath = pathArray.join("/");
          next(nextPath);
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next({ path: "/BlankLayout/login" });
    }
  } else {
    next();
  }
}

function mutiTab(to, from, next) {
  // if (store)
  const mutiTab = store.state.themeModule.theme.mutliTab ;
  if (mutiTab) {
    if (from.query.tabKey && !to.query.tabKey) {
      to.query.tabKey = from.query.tabKey;
    }
    if (to.query.tabKey) {
      to.meta.keepAlive = true;
      to.meta.tabKey = to.query.tabKey;
    }
  }
}
/**
 * 路由权限
 */
router.beforeEach((to, from, next) => {
  // 如果没有全局数据
  mutiTab(to, from, next);
  authSso(to, from, next);
});

export default router
