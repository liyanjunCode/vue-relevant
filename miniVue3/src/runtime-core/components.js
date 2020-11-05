import { isObject } from "../share/index"
export function createComponentIstance (vnode) {
  const { setUp } = vnode.type;
  return {
    vnode,
    setUp,
    isMounted: false,   // 标识组件是否挂载
    setUpState: null,   // setup函数的返回结果对象
    render: null,       // 组件的渲染函数
  }
}

export function setUpComponent (instance) {
  // 设置props

  // 设置emits
  // instance

  // 执行setup函数
  const { setUp } = instance;
  if (setUp) {
    const setUpResult = setUp();
    if (isObject(setUpResult)) {
      instance.setUpState = setUpResult;
    } else {
      instance.render = setUpResult;
    }
  }

  // 完成setUp后的操作, 需要查看vnode是否有渲染函数， 和最后如果无渲染函数
  // 需要执行模板编译过程
  finishSetUpComponent(instance);

  // 这里应该还有vue2 和vue3版本的兼容
}

function finishSetUpComponent (instance) {
  // 如果在vnode里写了专门的render函数， 此函数优先级高于setup中的
  // 渲染函数优先级
  const { render } = instance.vnode;
  if (render) {
    instance.render = render;
  } else if (!instance.render) {
    // 如果还是不存在render 函数，就需要进行模板编译过程
    // compiler()
  }

}