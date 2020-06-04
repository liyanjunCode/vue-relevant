import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
Vue.config.productionTip = false
Vue.use(VueRouter)
import HelloWorld from './components/HelloWorld.vue'
import About from './components/about.vue'
import a from './components/a.vue'
const routes = [
    {
        path: '/',
        component:HelloWorld
    },
    {
        path: '/about',
        component:About,
        children: [
            {
                path: '/a',
                component: a
            }
        ]
    },
]
const router = new VueRouter({
    routes
})
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')
