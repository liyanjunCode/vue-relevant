export const nodeOps = {
  createElement (tag) {
    return document.createElement(tag);
  },
  insert (child, parent, ancher = null) {
    parent.insertBefore(child, ancher);
  },
  remove (child) {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child)
    }
  },
  setElementText (el, text) {
    el.textContent = text;
  }
}