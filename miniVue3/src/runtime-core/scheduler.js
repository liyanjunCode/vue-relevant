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
let activePreFlushCbs;
let prevFlushIndex = 0; // 标识前置任务队列正在执行的任务序列

// 等待执行的异步后置队列
const pendingPostFlushCbs = [];
// 正在执行的一部后置队列
let activePostFlushCbs;
let postFlushIndex = 0; // 标识后置任务队列正在执行的任务序列
const resolvePromise = Promise.resolve();
let activePromise;

// 当前正在等待执行的promise

let currentFlushPromise;
// 提供给用户使用，instance是用户提供this，fn是用户的处理函数
export function nextick (instance, fn) {
  const p = activePromise || resolvePromise;
  // this存在需要给fn绑定环境this
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}

export const queueJob = (job) => {
  // queueJob不存在length 说明还未向队列中增加任何任务
  // 或队列中不存在此job并且job不能等于当前正在执行的
  if (queueJob.length || !queue.includes(job)) {
    queue.push(job)
  }
  queueFlush();
}
// 前置和后置队列公用的像队列加任务的
export const queueCb = (cb, activeQueue, pendingQueue, index) => {
  if (!Array.isArray(cb)) {
    // 如果不是数组，activeQueue无任务，需要将cb存入等待执行的任务队列
    //或activeQueue有任务，如果cb存在activeQueue正在执行队列中等待执行，
    //就不需要要将cb存入pendingQueue队列等待执行了，因为存入就重复执行了
    if (!activeQueue.length || !activeQueue.includes(cb)) {
      pendingQueue.push(cb);
    }
  } else {
    // 如果是数组的话拍平放入队列
    pendingQueue.push(...cb);
  }
  // 将任务添加到为任务队列准备执行
  queueFlush();
}
// 向pendingPreFlushCbs队列中添加任务
export const queuePreFlushCb = (cb) => {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, prevFlushIndex);
}
// 向pendingPostFlushCbs队列中添加任务
export const queuePostFlushCb = (cb) => {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
// 将任务队列添加到微任务
const queueFlush = () => {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    // vue中一部队列直接用resolvePromise加入微任务
    resolvePromise.then(flushJobs);
  }
}
// 执行前置队列的队列任务
const flushPreFlushCbs = () => {
  /* 
    将pendingPreFlushCbs存起来，
    因为在执行前置队列时， 可能执行的过程中还在添加前置任务
    所以需要activePreFlushCbs和pendingPreFlushCbs分别处理
    正在执行的队列和执行过程中新添加的队列
  */
  // pendingPreFlushCbs里有任务才执行， 因为这里要递归， 一直把所有前置任务完成才不执行
  if (pendingPreFlushCbs.length) {
    activePreFlushCbs = [...new set(pendingPreFlushCbs)];
    // 将pendingPreFlushCbs清空
    pendingPreFlushCbs.length = 0;
    // 执行前置任务队列
    for (let prevFlushIndex = 0; prevFlushIndex < activePreFlushCbs.length; prevFlushIndex++) {
      activePreFlushCbs[prevFlushIndex]();
    }
    // 执行完之后activePreFlushCbs清空，序列prevFlushIndex重置为0
    activePreFlushCbs = null;
    prevFlushIndex = 0;
    // 递归执行，知道清空队列为止
    flushPreFlushCbs();
  }
}

// 执行后置任务队列的方法
const flushPostFlushCbs = () => {
  // 备份任务队列并清空pendingPostFlushCbs队列
  let deps = [...new Set(pendingPostFlushCbs)];
  pendingPostFlushCbs.length = 0;
  // activePostFlushCbs有长度时，说明正在执行后置队列任务， 直接将需要增加的任务
  //放入activePostFlushCbs数组中等待执行即可
  if (activePostFlushCbs) {
    return activePostFlushCbs.push(...deps);
  }
  // 队列需要根据id排序
  activePostFlushCbs = deps;
  for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
    activePostFlushCbs[postFlushIndex]();
  }
  // 重置
  activePostFlushCbs = null;
  postFlushIndex = 0;
}
// 执行effect队列的函数
const flushJobs = () => {
  // 等待渲染结束
  isFlushPending = false;
  // 开始渲染
  isFlushing = true;
  // 执行异步队列前置队列
  flushPreFlushCbs();
  // 异步任务需要排序，因为组件是先创建父组件，再创建子组件，父组件的id小于子组件
  // 所以更新也需要先更新先父后子
  queue.sort((a, b) => getId(a) - getId(b));
  try {
    // 执行异步队列
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      job();
    }
  } finally {
    // 执行完异步队列 重置queue和flushIndex
    flushIndex = 0;
    queue.length = 0;
    // 执行异步队列后置队列
    flushPostFlushCbs();

    //表示执行渲染结束
    isFlushing = false;
    // 将当前promise置空
    currentFlushPromise = null;

    // 因为flushPostFlushCbs是最后执行， 大多是用户定义
    // 可能执行flushPostFlushCbs执行，用户在回掉函数中操作了界面
    //或有添加了一些后置队列任务， 所以需要继续递归执行，清空所有的任务
    if (queue.length || queuePostFlushCb.length) {
      flushJobs();
    }
  }

}
// 获取回掉函数的id进行排序
function getId (fn) {
  return fn.id == undefined ? Infinity : fn.id;
}