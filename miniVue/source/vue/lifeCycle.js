import Wacther from './observe/watcher.js'
import { __patch__ } from './vdom/patch.js'
// 挂在组件视图
export function mountComponent(vm, el) {
    vm.$el = el
    let updateComponent = () => {
        // vm._render() 获取虚拟dom
        // _patch 生成实际dom 渲染界面
        vm._patch(vm._render())
        //  解析html  ast结构 生成字符串_c(tag: 'div', attr:{a:1}, _v(hellow + _s(aa)))
            // with 和 new Funtion ｛
            //    
            // ｝生成render函数
            // 
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
            // 生成真实dom进行挂载
            __patch__(vm.$el, vnode)
        } else {
            // 虚拟dom对比
            __patch__(prevVnode, vnode)
        }
        
    }
}