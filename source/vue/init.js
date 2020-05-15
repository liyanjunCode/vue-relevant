
import { compileToFunction } from './compiler/index.js'
import { mountComponent } from './lifeCycle'
import { observer, defineReactive} from './observe/index'
import Watcher from './observe/watcher.js'
import Dep from './observe/dep.js'
export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        const vm = this;
        vm.$options = options
        initState(vm)
        if(vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el){
        const vm = this
        const options = vm.$options
        let template = options.template
        el = document.querySelector(el)
        // 编译的三个条件1.render函数 2. el 3. tmeplate模板
        // render函数不存在说明要编译模板， 如果存在render函数不需处理
        if(!options.render) {
            // 如果不能存在template说明是在dom结构中写的， 那就需要获取el的结构
            if(!template && el) {
                template = el.outerHTML
            } else {
                // 如果模板template存在，可能存在两种方式1.options里写的字符串 2. script标签写的模板(为id选择器)
                // 只需对id选择器情况处理即可
                if(~template.indexOf('#')) {
                    el = document.querySelector(template)
                    template = el.innerHTML
                }
            }
            // 将template转换为render函数
            const render = compileToFunction(template)
            options.render = render
        }
        mountComponent(vm, el)
    }
}
export function initState(vm) {
    const opts = vm.$options;
    // 初始化props
    if (opts.props) {
        initProps()
    }
    // 初始化props
    if (opts.methods) {
        initMethods()
    }
    // 初始化data
    if (opts.data) {
        initData(vm, opts)
    }
    // 初始化computed
    if (opts.computed) {
        initComputed(vm, opts.computed)
    }
    // 初始化watched
    if (opts.watch) {
        initWatched(vm, opts.watch)
    }
}
function initProps() {
    console.log('initProps')
}
function initMethods() {
    console.log('initMethods')
}
function initData(vm, opts) {
    let data = opts.data
    // 处理data， 因为data可以使function, 也可以是Object，需要区别对待处理获取到定义的数据对象
    data = vm._data = typeof data == 'function' ? data.call(vm) : data
    // 获取到数据后需要给每个数据进行get和set转换，目的是达到响应式数据
    Object.keys(data).forEach((key, i) => {
        proxy(vm, '_data', key)
        defineReactive(data, key, data[key])
    })
}
function initComputed(vm, computed) {
    // 创建对象存储computed到vm实例
   const watchers = vm.computedWatchers = Object.create(null);
    // 取出每个computed
    for(let key in computed) {
        let userGet = computed[key]
        // 可能是函数， 也可能用户写了getter
        userGet = typeof userGet == 'function' ? userGet : userGet.get
        // 创建存储计算属性watcher， lazy标识是计算属性
        watchers[key] = new Watcher(vm, userGet,()=>{}, {lazy: true})
        //
        Object.defineProperty(vm, key, {
            configurable: true,
            enumerable: true,
            get: createComputedGetter(vm, key)
        })
    }
    
}
function createComputedGetter(vm, key){
    return function() {
        const wacher = vm.computedWatchers[key]
        if(wacher.dirty) {
            // 计算属性watcher求值
            wacher.evalue()
        }
        // Dep.target为渲染watcher
        if(Dep.target) {
            // 这个watcher是computed的watcher， 现在这个wacher里有计算属性需要的变量的dep, 只要循环执行
            // 所有dep执行depend方法， 就会把当前渲染watcher收集到计算属性所用变量的dep中，就可以达到， 变量
            // 值改变， 先通知计算属性watcher求值， 再通知渲染函数， 重新渲染界面
            wacher.depend()
        }
        console.log(wacher)
        return wacher.value
    }
}
function initWatched(vm, watch) {
    // 写法， 数组， 函数， 对象
    // 取出写的watcher的key
    
    for(let key in watch) {
        const handler = watch[key];
        if(Array.isArray(handler)) {
            for(let i=0; i<handler.length; i++) {
                createWatcher(vm,key, handler[i])
            }
        } else {
            createWatcher(vm,key, handler)
        }
    }
}
export function createWatcher(vm, key, handler, options={}){
    // 如果是对象,需取出回调函数
    if(typeof handler !== 'function') {
        options= handler
        handler = handler.handler
       
    }
    // 如果是字符串，就是methods中的方法， 需要将方法通过vm取出
    if(typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(key, handler, options)
}
// 将所有数据代理给vm， 方便访问， 比如在vue中调用数据是this.a直接访问
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            vm[source][key] = newVal
        }
    })
}
