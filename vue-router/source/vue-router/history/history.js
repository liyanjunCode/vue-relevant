import {createRoutes} from '../create-route-match.js'
export default class History {
    constructor(router){
        // 记录vue-router实例,方便调用它上面的方法
        this.router = router;
        // 初始进来没有匹配记录
        this.current = createRoutes(null, {
            path: '/'
        })
    }
    // 用于路径改变后切换组件
    // location为当前的地址，complete，是为了hash路由第一次进行hash监听事件绑定
    transitionTo(location, complete){
        // 第一步要根据location路径匹配相应地路由记录, current应该是{path:'/',[component1, component2]}的形式
        const current = this.router.match(location);
        // 当前匹配到的和上次匹配到的一样， 不用处理
        if(current.path === this.current.path && current.matched.length == this.current.matched.length) {
            return;
        }
        // 存储当前匹配到的组件和地址,  this.current是需要用vue的util中的defineReact转为响应式数据的
        this.current = current;
        // 当路由改变后， 将响应书数据_route的值current进行重新赋值
        this.cb && this.cb(current)
        // 这个是监听的hashchange事件
        complete && complete();
    }
    listen(cb){
        this.cb = cb;
    }
}