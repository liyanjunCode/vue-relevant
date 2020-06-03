
import { nextTick } from '../util/next-tick.js'
// 是否正在执行回调
let isFlush = false 
// 执行掉回调函数，初始到原始状态

let has = {}
// 存储watcher函数
let queue = [];
function flushQueue() {
    isFlush = true;
    for(let i=0; i< queue.length; i++) {
        const id = queue[i].id
        queue[i].run()
        has[id] = null
    }
    queue = [];
    isFlush = false
}
export function queueWatcher(watcher) {
    const id = watcher.id
    if(has[id] == null) {
        has[id] = true
        queue.push(watcher)
    }
    if(!isFlush) {
        isFlush = true
        nextTick(flushQueue)
    }
}

