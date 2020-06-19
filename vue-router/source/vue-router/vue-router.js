import createRouteMacth from './create-route-match.js'
export default class VueRouter {
    constructor(optioins){
        const routes = optioins.routes || [];
        // 创建路由的匹配器和添加器，匹配器match用来匹配路由， 添加器addRoutes用来添加新路由
        const matcher = createRouteMacth(routes);
        matcher.addRoutes([{path: '/cc', component: {}}])
    }
    init(){
        console.log('init')
    }
}