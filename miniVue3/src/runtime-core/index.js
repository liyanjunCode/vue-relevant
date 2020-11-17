
import { createComponentIstance, setUpComponent } from "./components"
import { effect } from "../reactivity/effect"
// runtime-core元素与各平台操作无关
import { shapFlags } from "../share/index";

import { createAppApi } from "./createAppApi"
export { h } from "./h";
// 创建渲染器提供给runtime-core中使用， options是关于平台dom的操作
export function createRenderer (options) {
  return baseCreateRenderer(options);
}
// 基础的渲染器
function baseCreateRenderer (options) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    patchProps: hostPatchProps
  } = options;
  // 渲染函数
  const render = (vnode, container) => {
    // 用patch挂载组件或元素, 因为是第一次挂载所以旧的虚拟dom是null
    patch(null, vnode, container);
  }
  const patch = (n1, n2, container, ancher = null) => {
    // 这里要用shapFlags区分是处理元素节点还是处理组件
    let { shapFlag } = n2;
    if (shapFlag & shapFlags.ELEMENT) {
      // 处理元素节点
      processElement(n1, n2, container, ancher);
    } else if (shapFlag & shapFlags.STATEFUL_COMPONENT) {
      // 处理组件节点
      processComponent(n1, n2, container);
    }
  }
  const processElement = (n1, n2, container, ancher) => {
    // 根据n1是否为null 判断是挂载元素节点，还是更新元素节点
    if (n1 == null) {
      mountElement(n2, container, ancher);
    } else {
      updateElement(n1, n2, container);
    }
  }
  const processComponent = (n1, n2, container) => {
    // 根据n1是否为null 判断是挂载组件，还是更新组件
    if (n1 == null) {
      mountComponent(n2, container)
    } else {
      updateComponent(n1, n2, container);
    }
  }
  // 创建挂载元素
  const mountElement = (n2, container, ancher) => {
    const { type, children, props } = n2;
    // 创建元素， 并将元素节点映射到虚拟dom中
    const el = n2.el = hostCreateElement(type);
    // 循环处理props
    for (let key in props) {
      hostPatchProps(el, key, null, props[key])
    }
    // 将元素插入父元素中
    hostInsert(el, container, ancher);
    // 处理子元素
    if (!Array.isArray(children)) {
      // 如果children不是数组， 那就是文本， 直接设置
      hostSetElementText(el, children)
    } else {
      // children是数组， 需要循环处理
      mountChildren(children, el)
    }

  }
  // 挂载子元素
  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      mountElement(children[i], container);
    }
  }
  // 进行dom对比， 更新元素
  const updateElement = (n1, n2, container) => {
    // 1. n1，n2 是不是同一个节点
    // 删除n1节点重置为null
    const el = n2.el = n1.el;
    if (n1 && !isSameVnode(n1, n2)) {
      hostRemove(el);
      n1 = null;
    }
    if (n1 == null) {
      patch(null, n2, container)
    } else {
      // 元素一样， 先更新属性
      patchProps(n1, n2, el);
      // 然后对比子元素
      patchChildren(n1, n2, el);
    }
  }
  // 对比子元素
  const patchChildren = (n1, n2, container) => {
    const c1 = n1.children;
    const c2 = n2.children;
    const prveShapFlag = n1.shapFlag;
    const nextShapFlag = n2.shapFlag;
    // 子元素的类型分为数组和字符串类型， 所以， 这有四种情况
    // 1.c2 为字符串， c1为字符串
    // 2.c2为字符串， c1 为数组
    // 3. c2 为数组， c1为字符串
    // 4. c2为数组， c1为数组

    if (nextShapFlag & shapFlags.TEXT_CHILD) {
      // 如果c2是字符串， 不管c1是字符串还是数组， 直接用 textContent设置新值即可
      // 所以不用区分情况， 只是需要判别c1和c2都为字符串时 相等就不用更改
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else if (nextShapFlag & shapFlags.ARRAY_CHILD) {

      if (prveShapFlag & shapFlags.ARRAY_CHILD) {
        // c2 是数组 c1是数组， 最复杂的dom对比
        patchKeyChildren(c1, c2, container)
      }
      if (prveShapFlag & shapFlags.TEXT_CHILD) {
        // c1 是字符串， 先将字符串删除， 再循环挂在新元素
        hostSetElementText(container, "");
        for (let i = 0; i < c2.length; i++) {
          // 将每个新子元素挂载
          patch(null, c2[i], container);
        }
      }
    }
  }
  // dom diff流程
  const patchKeyChildren = (c1, c2, container) => {
    let i = 0;
    // l2用来判断参照物ancher， 当nextIndex大于l2时ancher为null
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;

    /* 
      1.从前往后进行对比 , 循环条件 i始终比e1和e2小
      可能情况 
      prev [a, b, c] next [a, b, c, d] 相当于向后添加元素
      只要前面的元素相同就将i后移
      i e1 e2的结果
      1.1 i = 3; e1=2; e2 = 3
    */
    while (i <= e1 && i <= e2) {
      // 同一个节点， 将i指针向后移动， 当节点不同时跳出循环
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVnode(n1, n2)) {
        // 节点相同但属性不一定相同， 需要更新,并且进行递归
        patch(n1, n2, container);
      } else {
        break;
      }
      i++;
    }
    /* 
        2.从后往前对比 , 循环条件 i始终比e1和e2小
        1.2 prev[a, b, c] next[d, a, b, c] 相当于向前添加 
        只要后面的元素相同就将e1和e2的指针前移
        i e1 e2的结果 i=0; e1=-1;e2 = 0
    */
    while (i <= e1 && i <= e2) {
      // 同一个节点， 将e1, e2指针向前移动， 当节点不同时跳出循环
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVnode(n1, n2)) {
        // 节点相同但属性不一定相同， 需要更新,并且进行递归
        patch(n1, n2, container);
      } else {
        break;
      }
      e1--;
      e2--
    }
    // 
    if (i > e1) {
      // 说明有新增, 直接挂载新元素即可
      while (i <= e2) {
        // 超出e2元素长度ancher改为null
        let nextPos = e2 + 1;
        const ancher = nextPos < l2 ? c2[nextPos].el : null;
        patch(null, c2[i], container, ancher);
        i++;
      }
    } else if (i > e2) {
      // 需要删除旧节点
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    } else {
      // 中间元素不明情况
      let s1 = i;
      let s2 = i;
      // 建立新节点key和index的映射表， 用于查找元素
      const keytoNewIndexMap = new Map();
      for (i = s2; i <= e2; i++) {
        const key = c2[i].key;
        keytoNewIndexMap.set(key, i);
      }
      let j;
      // 已经被比较的dom个数
      let patched = 0;
      // 将要被比对的元素个数
      let toBePatched = e2 - s2 + 1;
      let moved = false;  // 用来判断是否有移动操作
      let maxNewIndexSoFar = 0; // 
      const newIndexToOldIndex = new Array(toBePatched).fill(0);
      // 循环旧的虚拟dom查找当前的旧节点的key值的对应新节点index
      // 如果旧节点不存在key值，就通过newIndexToOldIndex对ing的oldIndex
      // 是否为0判断, 如果为0 说明还未找到, 再通过判断tag是否相等,找一个标签相等的
      // 判定为同一项
      let newIndex;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        // 这里需要处理旧元素剩的多余节点，patched大于等于toBePatched元素时， 说明旧子节点已经有剩余不需要的了
        //不需要就卸载掉
        if (patched >= toBePatched) {
          hostRemove(prevChild.el);
        }
        if (prevChild.key != null) {
          // 旧的节点有key值， 直接去建立的映射表里找元素现在新的序列位置
          newIndex = keytoNewIndexMap.get(prevChild.key);
        } else {
          // 如果旧节点没有key值，看newIndexToOldIndex对应位置的值是否为0，为0
          // 就是未找到对象元素， 然后再判断tag是否相等
          for (j = s2; j < toBePatched; j++) {
            if (newIndexToOldIndex[j] == 0 && isSameVnode(prevChild, c2[j + s2])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex == undefined) {
          // 在新元素中找不到对应的index，说明元素已经不存在了， 要卸载
          hostRemove(prevChild.el)
        } else {
          // 0是一个特殊标识，所以需要i+1
          newIndexToOldIndex[newIndex - s2] = i + 1;

          // 找到就把当前序列存起来
          if (maxNewIndexSoFar >= newIndex) {
            // 如果当maxNewIndexSoFar大于newIndex就说明有元素移位了
            // 因为maxNewIndexSoFar一直是存储找到旧节点在新节点中的newIndex，
            // 旧节点一直是递增的， 如果未移动位置， 新节点也应该是递增的
            moved = true;
          } else {
            maxNewIndexSoFar = newIndex;
          }

          // newIndex有值说明当前元素需要更新操作，如果需要移动位置，最后再做处理
          patch(prevChild, c2[newIndex], container);
          // 记录对比过的元素
          patched++
        }
      }
      // 下面就要用最长递增子序列来判断最少的元素位移
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndex) : [];
      j = increasingNewIndexSequence.length;
      // 倒叙循环要对比的元素
      // 获取到最后一个对比元素之后那个元素序列作为dom操作的参照物

      for (i = toBePatched - 1; i >= 0; i--) {
        // 等于0是新增元素，只要找到参照物插入即可
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const ancher = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;
        if (newIndexToOldIndex[i] == 0) {
          patch(null, c2[s2 + i], container, ancher)
        } else if (moved) {
          // 如果不是新增， 不用移动， 直接结束了
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            //j为最长递增子序列的数组长度， 当j<0时，当前i肯定需要移动 有需要的移动元素， i不在最长递增子序列中需要移动
            hostInsert(nextChild.el, container, ancher)
          } else {
            // 其他情况不需要移动节点， 只需将j--即可j--指向最长递增子序列前一项
            j--;
          }
        }
      }

    }
  }
  // 对比元素属性
  const patchProps = (n1, n2, el) => {
    // 新对象的属性
    const prevProps = n1.props || {};
    // 旧对象的属性
    const nextProps = n2.props || {};

    // prevProps和nextProps不相等， 进行属性更新
    if (prevProps !== nextProps) {
      // 如果在新属性中存在， 需要设置属性
      for (let key in nextProps) {
        if (prevProps[key] !== nextProps[key]) {
          hostPatchProps(el, key, prevProps[key], nextProps[key]);
        }
      }
      // 旧属性在新属性中不存在删除掉
      for (let key in prevProps) {
        if (!(key in nextProps)) {
          hostPatchProps(el, key, prevProps[key], null);
        }
      }
    }

  }
  const isSameVnode = (n1, n2) => {
    return n1.type === n2.type && n1.key === n2.key;
  }
  const mountComponent = (vnode, container) => {
    // 第一步生成组件实例
    const instance = vnode.instance = createComponentIstance(vnode);
    // 第二部，设置props emits等 并 执行setup函数
    setUpComponent(instance);
    // 组件的effect函数, 形成响应式依赖, 数据改变,组件重新渲染
    setUpComponentEffect(instance, container);
  }
  const setUpComponentEffect = (instance, container) => {
    effect(function componentEffect () {
      if (!instance.isMounted) {
        // 如果组件没有挂载, subTree 用于下次组件更新比对
        const subTree = instance.subTree = instance.render();
        // 标识组件已挂载
        patch(null, subTree, container)
        instance.isMounted = true;
      } else {
        const prev = instance.subTree;
        const next = instance.render();
        instance.subTree = next;
        patch(prev, next, container)
      }
    })
  }
  return {
    createApp: createAppApi(render)
  }
}
function getSequence (arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        // 存储在 result 更新前的最后一个索引的值
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      // 二分搜索，查找比 arrI 小的节点，更新 result 的值
      while (u < v) {
        c = ((u + v) / 2) | 0
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  // 回溯数组 p，找到最终的索引
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}


