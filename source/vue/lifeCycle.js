import Wacther from './observe/watcher.js'
import { patch } from './vdom/patch.js'
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
            patch(vm.$el, vnode)
        } else {
            patch(prevVnode, vnode)
        }
        
    }
}