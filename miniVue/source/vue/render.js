
import { createElement, createTextNode } from './vdom/create-element.js'
export function initRender(Vue) {
    // 生成元素虚拟dom
    Vue.prototype._c = function() {
        return createElement(...arguments)
    }
    // 生成文本虚拟dom
    Vue.prototype._v = function(text) {
        return createTextNode(text)
    }
    // 只是执行stringfy
    Vue.prototype._s = function(val) {
        return val == null ? '' : typeof val === 'object' ? JSON.stringify(val) : val
    }
    Vue.prototype._render = function() {
        const vm = this;
        const render = vm.$options.render
        const vdom = render.call(vm)
        return vdom
    }
}