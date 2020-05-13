import { pushStack, popStack } from './dep.js'

let id = 0
export default class Watcher {
    constructor(vm, exp, cb, opts){
        this.id = id++
        this.cb = cb
        this.exp = exp
        this.deps = []
        this.depId = new Set()
        // 标识用户写的watch
        this.user = opts.user
        this.value = this.get()
    }
    // 获取值
    get() {
        const oldVal = this.value
        // 获取值之前，将Dep.target设置为this用于收集依赖，收集完重置为null
        pushStack(this)
        this.value = this.exp()
        popStack(this)
        // 用户写的wathcer 执行回调函数
        if(this.user) {
            this.cb(this.value, oldVal)
        }
    }

    // 更新视图逻辑
    update() {
       this.get()
    }
    // 存储dep并把wacher存入dep
    addSub(dep) {
        if(!this.depId.has(dep.id)) {
            this.depId.add(dep.id)
            this.deps.push(dep)
            dep.addDep(this)
        }
    }
}