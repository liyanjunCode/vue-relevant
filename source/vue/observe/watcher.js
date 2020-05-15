import { pushStack, popStack } from './dep.js'

let id = 0
export default class Watcher {
    constructor(vm, expOrFn, callback, opts){
        this.id = id++
        this.vm = vm
        this.callback = callback
        // lazy标识是否是计算属性， dirty标识是否需要对计算属性求值
        this.lazy = opts.lazy
        this.dirty = this.lazy
        
        this.getter = typeof expOrFn == 'string'?()=>{
            return vm[expOrFn]
        }: expOrFn
        this.deps = []
        this.depId = new Set()
        // 标识用户写的watch
        this.user = opts.user
        // 如果是计算属性， 就不用先不用求值
        this.value = this.lazy ? undefined : this.get()
       
    }
    // 获取值
    get() {
        const vm = this.vm;
        const oldVal = this.value
        // 获取值之前，将Dep.target设置为this用于收集依赖，收集完重置为null
        pushStack(this)
        this.value = this.getter.call(vm)
        popStack(this)
        // 用户写的wathcer 执行回调函数
        if(this.user) {
            this.callback(this.value, oldVal)
        }
    }
    evalue() {
        this.value = this.get()
        this.dirty = false
    }
    // 更新视图逻辑
    update() {
        // 区分计算属性和其他的
        if(this.lazy) {
            this.dirty = true
        } else {
            this.get()
        }
       
    }
    // 存储dep并把wacher存入dep
    addSub(dep) {
        if(!this.depId.has(dep.id)) {
            this.depId.add(dep.id)
            this.deps.push(dep)
            dep.addDep(this)
        }
    }
    depend() {
        for(let i=0; i< this.deps.length; i++) {
            this.deps[i].depend()
        }
    }
    // 为用户取消观测提供的方法， 要通知dep将watch依赖中删除
    teardown() {
        let len = this.deps.length
        while(len--){
            this.deps[len].removeSub(this)
        }
    }
}