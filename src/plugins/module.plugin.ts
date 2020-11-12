import Layout from '@/pages/Layout.vue';

function routerToMenu(routers) {
    const menus: Array<any> = [];
    routers.forEach(routerMenu => {
        let menu: any = {}
        if (routerMenu.menuMeta) {
            menu = {
                ...routerMenu.menuMeta
            }

            if (routerMenu.children) {
                menu.children = routerMenu(routerMenu.children) || [];
            } else {
                menu.children = [];
            }
            menus.push(menu);
        }
    });
    return menus;
}

const ModulePlugin = {
    install: (Vue, option) => {
        const modulePlugin = {
            registerRouter(routers) {
                
                const layoutRouter = routers.filter(route => route.layout !== undefined)
                const businessRouter = routers.filter(route => route.layout === undefined || route.layout === 'BasicLayout')

                const router = [
                    {
                        component: Layout,
                        name: 'modulePluginLayout',
                        path: '/modulePlugin',
                        children: [
                            ...businessRouter
                        ]
                    }
                ];
                option.router.options.routes[0].children.push(...layoutRouter)
                option.router.options.routes.push(...router)


                const staticMenu = routerToMenu(routers);
                option.store.commit('appInfoModule/SET_STATIC_MENU', staticMenu)

                option.router.addRoutes(option.router.options.routes);
            },

            registerVuexModule(storeModules) {
                // 注册当前路由

                storeModules.forEach(storeModule => {
                    option.store.registerModule(storeModule.name, storeModule);
                });
            },

            registerPlugin(plugins) {
                plugins.forEach(plugin => {
                    Vue.use(plugin);
                })
            },
        }
        Vue.prototype.$modulePlugin = modulePlugin;
    }
}

export default ModulePlugin;
