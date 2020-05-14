import Wacther from './observe/watcher.js'
import { __patch__ } from './vdom/patch.js'
// 挂在组件视图
export function mountComponent(vm, el) {
    vm.$el = el
    let updateComponent = () => {
        vm._patch(vm._render())
    }
    // 渲染watcher
    new Wacther(vm, updateComponent, () =>{}, true)
}
export function initLifeCycle(Vue) {
    Vue.prototype._patch = function(vnode) {
        const vm = this
        const prevVnode = vm._vnode
        vm._vnode = vnode
        // 原来无虚拟dom 第一个参数需传真实的dom
        if(!prevVnode) {
            __patch__(vm.$el, vnode)
        } else {
            __patch__(prevVnode, vnode)
        }
        
    }
}