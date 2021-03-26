import { callWithErrorHandling } from "../share/index.js"
// 标识是否正在执行微任务函数
let isFlushing = false;
// 标识是否正在等待执行微任务函数
let isFlushPending = false;
// 异步更新队列
const queue = [];
// 当前队列任务序列
let flushIndex = 0;


// 异步更新前置队列
let pendingPreFlushCbs = [];
let activePreFlushCbs = null;
// 前置任务执行的序列
let preflushIndex = 0;

// 异步更新后置队列
let pendingPostFlushCbs = [];
// 异步更新后置队列现在正在执行的队列，因为执行过程中可能会加入新的任务，所以要区分
let activePostFlushCbs = null;
// 后置任务队列执行的序列
let postflushIndex = 0;


// 添加微任务的方法
let resolvedPromise = Promise.resolve();
// 代表正在执行的promise
let currentFlushPromise;

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
    queueCb(job, activePreFlushCbs, pendingPreFlushCbs)
}
// 后置任务队列处理
export const queuePostFlushCb = (job) => {
    queueCb(job, activePostFlushCbs, pendingPostFlushCbs)
}
// 执行queue队列
const queueFlush = function () {
    // 只有没有执行微任务去刷新任务队列，才会向微任务添加任务
    // 如果是正在执行的微任务，就直接用当前微任务在flushJobs处理中，直接把后加入的执行掉
    if (!isFlushing && !isFlushPending) {
        isFlushPending = true;
        currentFlushPromise = resolvedPromise.then(flushJobs)
    }
}
// 是刷新前置队列
const flushPreFlushCbs = () => {
    // 将需要执行的pendingPostFlushCbs去重被赋值给activePreFlushCbs，然后清空pendingPostFlushCbs
    if (pendingPreFlushCbs.length) {

        activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
        pendingPreFlushCbs.length = 0;


        for (preflushIndex; preflushIndex < activePreFlushCbs.length; preflushIndex++) {
            const task = activePreFlushCbs[preflushIndex];
            task();
        }
        activePreFlushCbs = null;
        preflushIndex = 0;
        // 直到清空前置任务队列， 再往下执行异步更新队列任务
        flushPreFlushCbs();
    }
}
// 刷新后置队列
const flushPostFlushCbs = () => {
    let deps = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    // 此处不知道，什么场景下能在执行后置任务队列时，会继续添加后置任务
    if (activePostFlushCbs) {
        return activePostFlushCbs.push(...deps);
    }
    activePostFlushCbs = deps;
    // 排序
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    // 执行
    for (postflushIndex = 0; postflushIndex < activePostFlushCbs.length; postflushIndex++) {
        const task = activePostFlushCbs[postflushIndex];
        task();
    }
    activePostFlushCbs = null;
    postflushIndex = 0;
}
const flushJobs = () => {
    isFlushing = true;
    isFlushPending = false;
    // 执行前置队列任务
    flushPreFlushCbs();

    /* 
        *执行异步队列任务
        * 因为异步队列任务大多是组件渲染函数，所以要先父组件后子组件执行
        * 父组件先创建effect的id小于子组件id 所以从小到大排列及为先父 后子执行顺序
        * 所以此处对queue进行sort排序
        * 
    */
    queue.sort((a, b) => getId(a) - getId(b));
    try {
        // 循环一次执行queue队列任务
        for (flushIndex; flushIndex < queue.length; flushIndex++) {
            callWithErrorHandling(queue[flushIndex]);
        }
    } finally {
        flushIndex = 0;
        queue.length = 0;

        // 执行后置队列任务
        flushPostFlushCbs()
        // 只要异步队列和后置任务队列还有任务，就一直去执行，到清空队列为止
        if (queue.length || pendingPostFlushCbs.length) {
            flushJobs();
        }
        currentFlushPromise = null;
    }


}
const getId = (job) => {
    return job.id == null ? Infinity : job.id;
}