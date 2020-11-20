import { track, trigger } from "./effect"
import { isIntegerKey, hasOwn } from "../share/index"
export const baseHandler = {
  get (target, key, recevier) {
    // 获取key的值
    const res = Reflect.get(target, key);
    // 收集依赖

    track(target, key);
    return res;
  },
  set (target, key, val, recevier) {
    // /先获取旧的值
    const oldVal = Reflect.get(target, key);
    // 需要判断是新增属性值， 还是更改属性值
    // 需判断数组情况和对象情况如果是arr[10]这种形式更改的数组
    // 需要判断长度和key的大小， 其余的按对象属性走
    const hadKey = Array.isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    // 设置新值
    const res = Reflect.set(target, key, val);
    if (!hadKey) {
      // 新增属性 通知依赖更新
      trigger(target, "ADD", key, val, oldVal);
    } else {
      // 修改属性 通知依赖更新
      trigger(target, "SET", key, val, oldVal);
    }
    return res;
  }
}