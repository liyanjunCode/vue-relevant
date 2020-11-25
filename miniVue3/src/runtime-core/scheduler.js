// 异步刷新机制

//异步任务队列
const queue = [];
let flushIndex = 0; //标识当前正在执行的异步任务序列
// 标识异步任务队列正在刷新
let isFlushing = false;
// 标识异步任务队列等待刷新
let isFlushPending = false;

/* 
  前置队列后后置队列区分正在执行的队列和等待执行的队列
  的原因是，前置或后置队列在执行过程中可能添加了新的前置或后置队列
*/
// 等待执行的异步前置队列任务
const pendingPreFlushCbs = [];
// 正在执行的异步前置队列
const activePreFlushCbs = [];
let prevFlushIndex = 0; // 标识前置任务队列正在执行的任务序列
// 等待执行的异步后置队列
const pendingPostFlushCbs = [];
// 正在执行的一部后置队列
const activePostFlushCbs = [];
let postFlushIndex = 0; // 标识后置任务队列正在执行的任务序列
const p = Promise.resolve();
let activePromise;
const nextick = (fn) => {
  return activePromise ? p.then(fn) : p;
}

export const queueJob = (effect) => {
  if (!queue.includes(effect)) {
    queue.push(effect)
  }
  queueFlush();
}
// 前置和后置队列公用的像队列加任务的
export const queueCb = () => {

}
// 将任务队列添加到微任务
const queueFlush = () => {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    nextick.then(flushJobs)
  }
}
// 执行effect队列的函数
const flushJobs = () => {
  isFlushing = true;

  try {

  } finally {

  }
}
let scheduler;