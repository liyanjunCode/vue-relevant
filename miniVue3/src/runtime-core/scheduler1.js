// 标识正在更新
let isFlushing = false;
// 标识正在等待刷新
let isFlushPending = false;
// 异步更新队列
const queue = [];
// 异步更新后置队列
const postQueue = [];
// 异步更新后置队列现在正在执行的队列，因为执行过程中可能会加入新的任务，所以要区分
const activePostQueue = []
// 异步更新前置队列
const prevQueue = [];
const activePrveQueue = []

// 添加微任务的方法
const promiseResolve = Promise.resolve();
// 代表正在执行的promise
let currentFlushPromise;
export const nextTick = function (fn) {
    const p = currentFlushPromise || promiseResolve;
    return p.then(fn)
}
// 异步任务队列加入任务处理
export const queueJob = (job) => {
    // 只有当当前的任务不在queue队列中时才加入队列，做到任务去重，防止重复执行
    if (!queue.length || !queue.includes(job)) {
        queue.push(job);
        //执行微任务
        queueFlush();
    }
}
// 抽离的处理prev和post的公共逻辑
// activeQueue指正在执行的任务，pendingQueue等待执行的任务队列
const queueCb = (job, activeQueue, pendingQueue) => {
    if (!activeQueue || !activeQueue.includes(job)) {
        pendingQueue.push(job)
        // 执行微任务
        queueFlush()
    }
}
// 前置任务队列加入任务处理
export const queuePreFlushCb = (job) => {
    queueCb(job, activePrveQueue, prevQueue)
}
// 后置任务队列处理
export const queuePostFlushCb = (job) => {
    queueCb(job, activePostQueue, postQueue)
}
// 执行queue队列
const queueFlush = function () {
    // 只有没有执行微任务去刷新任务队列，才会向微任务添加任务
    // 如果是正在执行的微任务，就直接用当前微任务在flushJobs处理中，直接把后加入的执行掉
    if (!isFlushing && !isFlushPending) {
        isFlushPending = true;
        currentFlushPromise = promiseResolve.then(flushJobs)
    }
}
// 是刷新前置队列
const queuePreFlushCb = () => {
    activePostQueue = [...postQueue];
    postQueue.length = 0;
}
// 刷新后置队列
const queuePostFlushCb = () => {

}
const flushJobs = () => {
    isFlushing = true;
    isFlushPending = false;
}
const getId = () => {

}