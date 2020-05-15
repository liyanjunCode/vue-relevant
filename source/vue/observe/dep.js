let id=0
class Dep {
    constructor() {
        this.id = id++
        // 依赖收集存储
        this.subs = []
    }
    // 收集依赖
    depend() {
        if(Dep.target) {
            Dep.target.addSub(this)
        }
    }
    addDep(watcher) {
        this.subs.push(watcher)
    }
    // 通知依赖更新
    notify() {
        this.subs.forEach(watcher=> {
            watcher.update()
        })
    }
    // 删除收集的watcher
    removeSub(wach) {
        const index = this.subs.indexOf(wach)
        this.subs.splice(index, 1)
    }

}
// 栈用于存储当前正在获取值的watcher
const stack = []
// 入栈
export function pushStack(wacher) {
    Dep.target = wacher
    stack.push(wacher)
}
// 出栈
export function popStack(wacher) {
    stack.pop()
    // 不直接复制为null， 是为了查看stack里是否还有watcher， 有， 还需继续处理
    Dep.target = stack[stack.length - 1]
}

export default  Dep