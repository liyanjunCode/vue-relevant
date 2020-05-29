let callbacks = [];
let isFlushing = false
function flushed() {
    isFlushing = false
    let copys = callbacks.slice(0);
    callbacks.length = 0;
    for(let i=0; i<copys.length; i++){
        copys[i]()
    }
}
let timeFun;
if(typeof Promise !== 'undefined') {
    timeFun = () => {
        Promise.resolve().then(flushed)
    }
} else if(typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(flushCallbacks)
    const textNode = document.createTextNode(String(counter))
    observer.observe(textNode, {
      characterData: true
    })
    timerFunc = () => {
      counter = (counter + 1) % 2
      textNode.data = String(counter)
    }
}else if (typeof setImmediate !== 'undefined') { 
    timeFun = () => {
        setImmediate(flushed)
    }
} else {
    timeFun = () => {
        setTimeout(flushed, 0)
    }
}
export function nextTick(callback) {
    callbacks.push(() => {
        callback()
    })
    // 第一次， 将事件放进微任务或宏任务， 当微任务执行后，isFlushing和callbacks重置为初始状态， 重新收集， 下一轮再执行
    if(!isFlushing) {
        isFlushing = true
        timeFun()
    }
}