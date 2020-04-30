import { initState } from './initState.js'
import { compileToFunction } from './compiler/index.js'
export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options
        initState(vm)
    }
    Vue.prototype.$mount = function(vm){
        const options = vm.$options
        let template = options.template
        const el = options.el
        // 编译的三个条件1.render函数 2. el 3. tmeplate模板
        // render函数不存在说明要编译模板， 如果存在render函数不需处理
        if(!options.render) {
            // 如果不能存在template说明是在dom结构中写的， 那就需要获取el的结构
            if(!template && el) {
                template = document.querySelector(el).outerHTML
            } else {
                // 如果模板template存在，可能存在两种方式1.options里写的字符串 2. script标签写的模板(为id选择器)
                // 只需对id选择器情况处理即可
                if(~template.indexOf('#')) {
                    template = document.querySelector(template).innerHTML
                }
            }
        }
        // 将template转换为render函数
        const render = compileToFunction(template)
       
    }
}
