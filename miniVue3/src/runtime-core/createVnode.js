import { shapFlags, isObject, isString } from "../share/index"

export function createVnode (type, props = {}, children = null) {
  // 素类型是字符串shapFlag设置成1， 组件类型是对象shapFlag设置成2
  let shapFlag = isString(type) ? shapFlags.ELEMENT : isObject(type) ? shapFlags.STATEFUL_COMPONENT : 0;
  const vnode = {
    type,       // 类型 元素类型是字符串， 组件类型是对象
    props,     //属性
    children,  //子元素
    component: null, //组件实例
    key: props.key,   //key
    shapFlag
  }
  /* 
    因为shapFlags中的字段数据都是二进制1向前位移的值，
    所以在二进制相同的位上不会存在都是1的情况
    然后在这里用异或 操作两个二进制， 相当于数据相加
    相加后的值即能代表父元素的类型也能知道子元素的类型
    相当于 现在 元素节点是1， 子节点是数组为16
    当 1 | 16 等于17 
    当下次判断时
    17 & 1 是1 代表当前元素是元素节点， 当16 & 17 输出是16代表当前类型是数组
    &相当于二进制当前位数相乘的结果
  */
  // 如果子元素是数组
  if (Array.isArray(children)) {
    vnode.shapFlag = shapFlag | shapFlags.ARRAY_CHILD;
  } else {
    // 如果子元素是字符串或null
    vnode.shapFlag = shapFlag | shapFlags.TEXT_CHILD;
  }
  // 返回虚拟节点
  return vnode;
}