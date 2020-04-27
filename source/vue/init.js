import { initState } from './initState.js'
export function initMixin(Vue) {
    Vue.prototype.init = function(options) {
        const vm = this;
        vm.$options = options
        initState(vm)
    }
}
