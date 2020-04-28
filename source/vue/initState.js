
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
}
function initProps() {
    console.log('initProps')
}
function initMethods() {
    console.log('initMethods')
}
function initData(vm, opts) {
    // 处理data， 因为data可以使function, 也可以是Object，需要区别对待处理获取到定义的数据对象
    const data = typeof opts.data == 'function' ? opts.data() : opts.data
    // 获取到数据后需要给每个数据进行get和set转换，目的是达到响应式数据
    Object.keys(data).forEach((key, i) => {
        defineReactive(data, key, data[key])
    })
    
    console.log('initData')
}
function initComputed() {
    console.log('initComputed')
}
function initWatched() {
    console.log('initWatched')
}




 