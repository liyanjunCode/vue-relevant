
const getType = createCurry(isType);
// 不能用Object.prototype.toString.call去判断类型， 因为在vue中代理把数组和{}同意当成对象处理， 不细分
// 如果用Object.prototype.toString.call去判断会导致数组不能被代理
// export const isObject = getType("Object");
export const isObject = (val) => { return typeof val === "object" };
export const isString = getType("String");
export const isFunction = getType("Function");
export const isIntegerKey = (key) => { return isString(key) && ("" + parseInt(key, 10) === key) };
// 判断数据是否有当前属性
const hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (target, key) => { return hasOwnProperty.call(target, key) }
export const shapFlags = {
  ELEMENT: 1,
  FUNCTIONAL_COMPONENT: 1 << 1,
  STATEFUL_COMPONENT: 1 << 2,
  ARRAY_CHILD: 1 << 3,
  TEXT_CHILD: 1 << 4
}

// 柯里化函数
function createCurry (fn, arr = []) {
  const len = fn.length;
  return function (...args) {
    args = [...arr, ...args];
    if (len > args.length) {
      return createCurry(fn, args);
    }
    return fn(...args);
  }
}
// 判断类型
function isType (type, val) {
  return Object.prototype.toString.call(val) === `[object ${type}]`
};