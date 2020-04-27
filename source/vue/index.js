import initMixin from './init.js'
function Vue(options) {
    this._init(options) // init方法调用相关方法, 此init方法为initMixin挂载在Vue原型上
}

initMixin(Vue) // 给原型上新增_init方法
export default Vue