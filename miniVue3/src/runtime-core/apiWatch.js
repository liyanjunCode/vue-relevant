import { isFunction, callWithErrorHandling, isObject } from "../share";
import { queueJob, queuePostFlushCb, queuePreFlushCb } from "./scheduler"
export function watch (source, cb, options) {
    doWatch(source, cb, options);
}
export function watchEffect (effect, options) {
    // watchEffect，不需要回掉函数， 所以第二个参数传空
    doWatch(effect, null, options);
}
// immediate立即执行, deep深度监听, flush 执行的模式， 是同步还是异步， 还是在渲染异步队列之后
function doWatch (source, cb, { immediate, deep, flush }) {
    // 1. 首先规格化参数
    let getter;
    if (isRef(source)) {
        // 如果是ref 需要source.value包装成函数
        getter = () => source.value;
    } else if (isReactive(source)) {
        // 如果是reactive 直接包装成函数
        getter = () => source;
    } else if (Array.isArray(source)) {
        // 如果是按数组形式监听多个值，需要循环处理
        getter = () => {
            // 因为是数组所以可能包含多种类型， 需要循环处理
            return source.map((s) => {
                if (isRef(s)) {
                    return s.value;
                } else if (isReactive(s)) {
                    return s;
                } else if (isFunction(s)) {
                    return callWithErrorHandling(source)
                }
            })
        }
    } else if (isFunction(source)) {
        // 当是函数的情况，回调函数cb存在，就是watch， 不存在就是watchEffect
        if (cb) {
            // 如果是函数需要将函数再次包装
            getter = () => callWithErrorHandling(source);
        } else {

        }

    } else {
        // 如果都不是直接将getter赋值为空函数
        getter = () => { };
    }

    // 2. watch如果传了参数deep 需要对source进行深度递归监测
    if (cb && deep) {
        const baseGetter = getter;
        traverse(baseGetter());
    }
}
// 深度监听其实就是遍历访问响应式数据的值，触发get函数， 收集依赖
function traverse (value, seen = new Set()) {
    // seen 用于标记已经处理过深度监听的数据
    if (!isObject(value) || seen.has(value)) {
        // 如果是普通值 或已经处理过，直接返回， 不需要再处理
        return value
    }
    // 加入seen，表明处理过了
    seen.add(value);
    if (isRef(value)) {
        // 如果是ref
        traverse(value.value, seen)
    } else if (isReactive(value)) {
        traverse(value.value, seen)
    }
}