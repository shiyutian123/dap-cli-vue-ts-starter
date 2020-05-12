import Vue from 'vue' ;
import Guide from './dap/Guide.vue';

const moduleRegister = function () {
    const routerModule = [
        {
            path: 'app-plugin-guide',
            name: 'app-plugin-guide',
            component: Guide,
            menuMeta: {
                key: 'app-plugin-guide',
                title: '导航功能',
                icon: 'profile',
                meta: {
                    functionType: 'CustomFunction',
                    path: 'app-plugin-guide'
                },
            }
        }
    ];

    const storeModule = [];

    const pluginModule = [];

    // 添加 vue-router 路由
    Vue.prototype.$modulePlugin.registerRouter(routerModule)

    // 添加 vuex 配置
    Vue.prototype.$modulePlugin.registerVuexModule(storeModule)

    // 添加额外插件
    Vue.prototype.$modulePlugin.registerPlugin(pluginModule);
}

export default moduleRegister;
