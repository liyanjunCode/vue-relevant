import { baseHandler } from "./baseHandler"
import { isObject } from "../share/index"

// 响应式reactive函数
export function reactive (target) {
  return createReactiveObject(target, baseHandler)
}
// 定义createReactiveObject 创建proxy代理， 是因为代理模式有多种， 可能是只读的也可能是
// 即可读，也可设置，通过高阶函数灵活传入baseHandler， 创建不同功能的响应式数据如 readOnlyRactive和Reactive
function createReactiveObject (target, baseHandler) {
  // 首先判断target是否是对象类型， 如果不是不许转换成响应式
  if (!isObject(target)) {
    return;
  }
  // 进行代理
  let proxy = new Proxy(target, baseHandler);
  return proxy;
}