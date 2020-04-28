import { initState } from './initState.js'
export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options
        initState(vm)
    }
}
