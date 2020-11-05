// runtime-dom文件中全是与浏览器操作强相关的内容
import { createRenderer } from "../runtime-core/index";
import { nodeOps } from "./nodeOps"
import { patchProps } from "./patchProps"

export function createApp (rootComponent) {
  return ensureRenderer(rootComponent);
}
let nodeOptions = { ...nodeOps, patchProps };
// 生成一个渲染器
function ensureRenderer (rootComponent) {
  // createRenderer关于渲染的具体操作在runtime-core核心代码中
  let app = createRenderer(nodeOptions).createApp(rootComponent);
  const mount = app.mount;
  // 重写mount 方法
  app.mount = function (root) {
    // 这是与浏览器平台相关的dom操作， 所以不适合在runtime-core
    // 中操作， 所以在这里重新写
    // root 请传选择器
    const container = document.querySelector(root);
    // 清空跟组件的原有内容
    container.innerHTML = "";
    // 利用runtime-core中的mount进行挂在操作， 传入跟组件和最外层容器
    mount(container);
  }
  // 返回app
  return app;
}