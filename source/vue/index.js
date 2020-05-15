import { initMixin } from './init.js'
import { initRender } from './render.js'
import { stateMixin } from './state.js'
import { initLifeCycle } from './lifeCycle.js'
function Vue(options) {
    this._init(options) // init方法调用相关方法, 此init方法为initMixin挂载在Vue原型上
}

initMixin(Vue) // 给原型上新增_init方法
stateMixin(Vue) // 挂在$watch $delete $set
initLifeCycle(Vue)
initRender(Vue)
export default Vue