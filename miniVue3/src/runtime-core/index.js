
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
  const patch = (n1, n2, container) => {
    // 这里要用shapFlags区分是处理元素节点还是处理组件
    let { shapFlag } = n2;
    if (shapFlag & shapFlags.ELEMENT) {
      // 处理元素节点
      processElement(n1, n2, container);
    } else if (shapFlag & shapFlags.STATEFUL_COMPONENT) {
      // 处理组件节点
      processComponent(n1, n2, container);
    }
  }
  const processElement = (n1, n2, container) => {
    // 根据n1是否为null 判断是挂载元素节点，还是更新元素节点
    if (n1 == null) {
      mountElement(n2, container);
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
  const mountElement = (n2, container) => {
    const { type, children, props } = n2;
    // 创建元素， 并将元素节点映射到虚拟dom中
    const el = n2.el = hostCreateElement(type);
    // 循环处理props
    for (let key in props) {
      hostPatchProps(el, key, props[key])
    }
    // 将元素插入父元素中
    hostInsert(el, container);
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
    for (let i = 0; i < mountChildren.length; i++) {
      mountElement(children[i], container);
    }
  }
  // 进行dom对比， 更新元素
  const updateElement = (n1, n2, container) => {
    // 进行dom对比操作
    console.log(n1, n2, container)
  }
  const mountComponent = (vnode, container) => {
    // 第一步生成组件实例
    const instance = vnode.instance = createComponentIstance(vnode);
    // 第二部，设置props emits等 并 执行setup函数
    setUpComponent(instance);
    // 组件的effect函数, 形成响应式依赖, 数据改变,组件重新渲染
    componentEffect(instance, container);
  }
  const componentEffect = (instance, container) => {
    effect(function () {
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


