
function patchClass (el, val) {
    if (val == null) {
        // 当为null时就是没有class
        val = "";
    }
    // 设置最新的class值
    el.className = val;
}

function patchStyle (el, oldVal, newVal) {
    // 以最新的style为元素设置属性
    for (let key in newVal) {
        el.style[key] = newVal[key];
    }
    // 属性在新的style里不存在，在老的style中存在，以最新的为主， 就需要删除老的原来存在于复用的元素上的style属性
    for (let key in oldVal) {
        if (!(key in newVal)) {
            el.style[key] = "";
        }
    }
}
function patchAttr (el, key, val) {
    if (!val) {
        // val不存在值时就是删除属性
        el.removeAttribute(key);
    } else {
        // val存在值就是设置当前属性， 不管原有属性是否存在，直接设置替换即可
        el.setAttribute(key, val);
    }
}
export function patchProps (el, key, oldVal = null, newVal = null) {
    switch (key) {
        case "class":
            // 属性是class
            patchClass(el, newVal)
            break;
        case "style":
            // 属性是style
            patchStyle(el, oldVal, newVal);
            break;
        default:
            // 普通dom属性
            patchAttr(el, key, newVal);
            break;
    }
}