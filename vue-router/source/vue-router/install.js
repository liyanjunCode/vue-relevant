// eslint-disable-next-line no-unused-vars
// let Vue;
import Link from './components/link.vue'
import View from './components/view.vue'
export function install(Vue) {
    Vue.mixin({
        beforeCreate() {
            // 将router放在每个组件上
            const router = this.$options.router;
            if(router) { 
                // 标记他是根组件
                this.routerRoute = this;
                // 如果有router参数， 说明是根组件， 根组件存储_router
                this._router = router
                // router使我们写的vueRouter类，调用它的init方法进行初始化
                this._router.init(Vue)
            } else {
                // 无router参数说明是子组件, 把根组件赋值给当前组件的routerRoute， 子组件中都能获取到根组件
                this.routerRoute = this.$parent && this.$parent.routerRoute;
            }
            console.log(this, this.$options.name)
        },
    })
    //注册全局组件router-view和router-link
    Vue.component('router-view', View)
    Vue.component('router-link', Link)
}