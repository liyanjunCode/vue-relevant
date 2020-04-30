
import { observer, defineReactive} from './observe/index'
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
        initComputed()
    }
    // 初始化watched
    if (opts.watch) {
        initWatched()
    }

    // 查看是否有el参数， 如果有进行模板编译过程
    if(opts.el) {
        vm.$mount(vm)
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
function initComputed() {
    console.log('initComputed')
}
function initWatched() {
    console.log('initWatched')
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




 