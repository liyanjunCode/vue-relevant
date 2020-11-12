
function patchClass (el, val) {
  if (val == null) {
    val = "";
  }
  el.className = val;
}

function patchStyle (el, oldVal, newVal) {
  for (let key in newVal) {
    el.style[key] = newVal[key];
  }
  for (let key in oldVal) {
    if (!(key in newVal)) {
      el.style[key] = "";
    }
  }
}
function patchAttr (el, key, val) {
  if (!val) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, val);
  }
}
export function patchProps (el, key, oldVal = null, newVal = null) {
  switch (key) {
    case "class":
      patchClass(el, newVal)
      break;
    case "style":
      patchStyle(el, oldVal, newVal);
      break;
    default:
      patchAttr(el, key, newVal);
      break;
  }
}