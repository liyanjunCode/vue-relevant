import { createVnode } from "./createVnode"
// 提供给用户使用的创建元素内容api
export function h (type, props, children) {
  return createVnode(type, props, children);
}