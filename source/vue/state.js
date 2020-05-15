import { createWatcher } from './init.js'
import watcher from './observe/watcher'

export function stateMixin(Vue) {
    Vue.prototype.$watch = function(key, handler, options) {
        const vm = this;
        if(typeof handler == 'object') {
            createWatcher(handler)
        }
        options = options || {}
        options.user = true
        if(!!options.immediate) {
            handler.call(vm)
        }
        const watch = new watcher(vm, key, handler, options)

        return function unwatch(){
            watch.teardown(watch)
        }
    }
}




 