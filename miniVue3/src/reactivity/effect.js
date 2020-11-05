import { isIntegerKey } from "../share/index"
// 副作用函数， 相当于vue2中的watcher
export function effect (fn) {
  // 因为副作用函数执行时， 我们需要将当前执行的副作用函数储存，获取值时使用
  // 并且需要增加一些属性， 所以用高阶函数创建effect
  let effect = createReactiveEffect(fn);
  if (!effect.options.lazy) {
    // 如果不是懒函数（即computed）， 用于第一次收集依赖
    effect();
  }
}
// 用于给每个副作用函数增加标记， 标记唯一
let uid = 0;
// 用于存储正在执行的effect， 再收集依赖的步骤需要用到
let activeEffect;
// 定义effectStack栈结构， 用于解决下面标注的effect嵌套执行的逻辑
// 避免因state.b的effect执行完毕后， 导致activeEffect被清空，state.c不能正确
// 收集最外层的effect
// effect(function () {
//   state.a;
//   effect(function () {
//     state.b;
//   })
//   state.c
// })
let effectStack = [];
// 真正创建副作用函数， 并做一些属性定义
function createReactiveEffect (fn, options = {}) {
  const effect = function () {
    // 副作用函数执行完需要将activeEffect，重置为空， 防止不在effect函数中的取值收集依赖
    // !effectStack.includes(effect)判断用于处理死循序如下写法
    // effect(function () {
    //   state.a++;
    // })
    // 当effect中是state.a++时， 因为a每次增加， 所以会通知依赖更新频繁触发，
    // 导致死循环， 所以增加判断，当前effect 执行时， 因为effect在effectStack栈中
    // 而且我们已经在执行副作用函数了， 所以不需要在触发了
    if (!effectStack.includes(effect)) {
      try {
        // 先将effect存入栈中解决effect嵌套问题
        effectStack.push(effect);
        activeEffect = effect;
        fn()
      } finally {
        // 执行完后将activeEffect设置成栈中前一个effect
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
      }
    }
  }
  // 唯一标记
  effect.uid = uid++;
  // 用于存储被哪个值依赖
  effect.deps = [];
  // effect的一些其他属性， 如lazy、shelduler
  effect.options = options;
  return effect
}
// 定义一个map对象， 存储对象的依赖
// WeakMap的数据结构
// {
//   {
//     a:1,
//     b:1
//   }: {
//     a: [],
//     b:[]
//   }
// }
const targetMap = new WeakMap();
// 用于收集依赖
export function track (target, key) {
  // 获取对象存储的deps对象
  let depsMap = targetMap.get(target);
  // 如果deps对象不存在说明是第一次此对象收集依赖需新建对应的数据结构
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  // 获取对象中key存储的依赖dep数据
  let deps = depsMap.get(key);
  // deps不存在说明是第一次收集， 需要新建set数据结构收集依赖
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 当前执行的activeEffect就是我们当前值需要收集的依赖函数
  // 先判断是否已经收集过当前的副作用函数， 不要重复收集
  if (!deps.has(activeEffect)) {
    // 加入到依赖中
    deps.add(activeEffect);
    // 副作用函数也需要收集deps, 形成一个双向记录的过程
    activeEffect.deps.push(deps);
  }
}
// 用于触发依赖
export function trigger (target, type, key, val, oldVal) {
  // 获取对象target的依赖数据map
  let depsMap = targetMap.get(target);
  // 没有收集过依赖不许执行
  if (!depsMap) { return }
  // 获取effect数组
  let deps = depsMap.get(key);
  const run = (effects) => {
    if (effects) {
      effects.forEach(effect => {
        // 执行副作用函数
        effect();
      });
    }
  }
  if (key != void 0) {
    //处理特殊情况对数组
    /* 情况1：
      effect(function () {
        effectDom.innerHTML = state.length
      })
      setTimeout(() => {
        state.length = 2;
      }, 1000)
      当effect中获取length时 改变length会触发依赖更新，这是正常情况 
    */
    /*情况2：
      effect(function () {
        effectDom.innerHTML = state[2]
      })
      setTimeout(() => {
        state.length = 2;
      }, 1000) 
      当用下标获取值时， 修改length不会触发更新， 因为对length未收集依赖， 
      收集的是effect中下标的依赖键值为下标， 但因为此时 length长度变小， 导致数组变化
      所以需要更新界面
    */
    //  如果修改的是length 并且target是数组
    if (key === "length" && Array.isArray(target)) {
      // 循环target的所有key的依赖
      depsMap.forEach((dep, key) => {
        // 因为在用 state.length = 2修改值时 只有当设置的length的
        // 值（val）小于 数组依赖项的下标时，才更新界面
        // 或本身就有length收集的依赖时
        if (key === "length" || key <= val) {
          // 触发更新
          run(dep);
        }
      })
    } else {
      // 根据我们传入的type处理余下特殊情况
      switch (type) {
        case "ADD":
          // 如果是数组新增并且是用的下标， 直接获取length的依赖执行
          if (Array.isArray(target)) {
            if (isIntegerKey(key)) {
              run(depsMap.get("length"));
            }
          } else {
            depsMap.forEach((dep, key) => {
              run(dep);
            })
          }
          break;
        case "SET":
          run(deps);
          break;
      }
    }

  }

}