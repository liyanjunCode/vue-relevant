
export function patch(oldVdom, vdom) {
    const isRealEl = oldVdom.nodeType
    if(isRealEl) {
        const parent = oldVdom.parentNode
        const el = createEle(vdom)
        parent.insertBefore(el, oldVdom.nextSibling)
        parent.removeChild(oldVdom)
    } else {
        console.log(oldVdom.el, vdom)
    }
}
function createEle(vdom) {
    const { tag, children, text } = vdom
    if(typeof tag == 'string') {
        vdom.el = document.createElement(tag)
        updateProptes(vdom)
        children.forEach((child) => {
            vdom.el.appendChild(createEle(child))
        })
    } else {
        vdom.el =  document.createTextNode(text)
    }
    return vdom.el
}
function updateProptes(vdom) {
    const { el, data} = vdom
    for( let name in data) {
        if(name === 'style') {
            for( let styleName in data.style) {
                el.style[styleName] = data.style[styleName]
            }   
        } else if(name === 'class') {
            el.className = data[name]
        } else {
            el.setAttribute(name, data[name])
        }
    }
}