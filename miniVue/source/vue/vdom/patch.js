
export function __patch__(oldVdom, vdom) {
    // oldVdom   真实节点 第一次渲染
    // 对象， 虚拟dom    1 3 7
    const isRealEl = oldVdom.nodeType
    // 如果oldVdom是节点元素， 就创建直接替换， 因为是第一次渲染
    if(isRealEl) {
        const parent = oldVdom.parentNode
        const el = createEle(vdom)
        parent.insertBefore(el, oldVdom.nextSibling)
        parent.removeChild(oldVdom)
    } else { // 更新时，进行新老dom对比，进行打补丁
        patch(oldVdom, vdom)
    }
}
// 创建元素
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
// 更新属性
function updateProptes(vdom, odlProps={}) {
    const { el, data} = vdom
    // 1.需要处理老节点有属性， 新节点无属性， 节点删除属性
    const oldStyle = odlProps.style || {};
    const newStyle = data.style || {};
    for(let p in odlProps) {
        if(!data.hasOwnProperty(p)) {
            el.removeAttribute(p)
        }
    }
    // 2.特殊处理style, 老的vnode没有从元素上删除掉

    for (let p in oldStyle) {
        if(!newStyle.hasOwnProperty(p)) {
            el.style[p] = ''
        }
    }

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
function patch(oldVdom, vdom){
    // 节点一样
    // const oldEl = oldVdom.el
    // oldEl.parentNode.replaceChild(createEle(vdom), oldEl)
    if(oldVdom.tag !== vdom.tag) {     
        const oldEl = oldVdom.el
        oldEl.parentNode.replaceChild(createEle(vdom), oldEl)
        return
    }
    console.log(typeof vdom.text !== 'undefined', typeof vdom.text, vdom)
    if( typeof vdom.text !== 'undefined') {
        return console.log(typeof vdom.text, vdom.text, 111)
    }
    // 节点一样, 不需要创建元素， 从老的vnode中获取到原有元素， 存储在行vnode中
    let docEl = vdom.el = oldVdom.el
    // 1 更新当前节点属性
    updateProptes(vdom, oldVdom.data)
    const newChildren = vdom.children;
    const oldChilren = oldVdom.children;
    if(newChildren.length > 0 && oldChilren.length > 0) {
        // 新老dom都存在子元素， 最复杂， 需要进行dom对比
        updateChilren(docEl, newChildren, oldChilren)
    } else if(newChildren.length > 0) {
        // 新元素有子元素， 老的没有子元素， 只需将新的子元素append到当前元素即可
        for(let i=0; i< newChildren.length;i++) {
            docEl.appendChild(createEle(newChildren[i]))
        } 
    } else {
        // 旧元素有子元素， 新元素没子元素， 将dom的子元素清除
        docEl.innerHTML = ''
    }

    // 此处是用于调试用的着
    // const oldEl = oldVdom.el
    // oldEl.parentNode.replaceChild(createEle(vdom), oldEl)
}
function updateChilren(parent, newChildren, oldChilren) {
    // 创建子元素和序列的双向指针
    let oldStartIdx = 0;
    let oldEndIdx = oldChilren.length - 1;
    let newStartIdx = 0;
    let newEndIdx = newChildren.length - 1;
    let oldStartChild = oldChilren[0];
    let newStartChild = newChildren[0];
    let oldEndChild = oldChilren[oldEndIdx]
    let newEndChild = newChildren[newEndIdx]
    let oldKeyToindex = creatKeyToIndexMap(oldChilren);
    // 进行循环对比, 新老虚拟dom有一方的开始序列大于结束序列， 说明有一方已经遍历完了
    while(newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) { // 新虚拟dom的开始序列大于结束序列时， 新的dom已经遍历完，结束循环对比
        if(!oldStartChild){
            // 这里处理在最后一种大乱斗对比时，将后面元素移动但前面时，原有位置设置为了undefined的情况
            oldStartChild = oldChilren[++oldStartIdx];
        }else if(!oldEndChild){
             // 同上，这里处理在最后一种大乱斗对比时，将后面元素移动但前面时，原有位置设置为了undefined的情况
            oldEndChild = oldChilren[--oldEndIdx];
         } else if(isSameVnode(oldStartChild,newStartChild)){ 
            // 需要递归处理子元素
            patch(oldStartChild, newStartChild);
            // 处理向后添加元素的情景
            newStartChild = newChildren[++newStartIdx];
            oldStartChild = oldChilren[++oldStartIdx];   
        }else if(isSameVnode(oldEndChild,newEndChild)){
            // 需要递归处理子元素
            patch(oldEndChild, newEndChild);
            // 处理向前插入元素的情况
            oldEndChild = oldChilren[--oldEndIdx];
            newEndChild = newChildren[--newEndIdx];
        } else if(isSameVnode(oldStartChild,newEndChild)) {
             // 处理元素不变只是位置改变，把前面的移到后面了
            // 需要递归处理子元素
            patch(oldEndChild, newEndChild);
            // 旧虚拟dom的头和新虚拟dom的尾相等，需要把旧虚拟dom的头插到最后一个节点的下一个节点前
            parent.insertBefore(oldStartChild.el, oldEndChild.el.nextSibling)
            oldStartChild = oldChilren[++oldStartIdx];
            newEndChild = newChildren[--newEndIdx];
        } else if(isSameVnode(oldEndChild,newStartChild)) {
            // 处理元素不变只是位置改变，把前面的移到前面了
            // 需要递归处理子元素
            patch(oldEndChild, newEndChild);
            // 旧虚拟dom的尾和新虚拟dom的头相等，需要把旧虚拟dom的尾插到第一个节点的前一个节点后
            parent.insertBefore(oldEndChild.el, oldStartChild.el)
            oldEndChild = oldChilren[--oldEndIdx];
            newStartChild = newChildren[++newStartIdx];
        } else {
            // 大乱斗
            let newKey = newStartChild.key
            let moveItemIndex = oldKeyToindex[newKey]
            // key和index的映射无值， 说明是新增的元素
            if(moveItemIndex == null) { 
                //此节点没有key值，直接当做新元素插入到原有dom的第一个前面
                parent.insertBefore(createEle(newStartChild), oldStartChild.el)
            } else { 
                // 需区分情况， 这里可能key值一样， 但是元素的标签改变了,标签变了直接用新元素替换
                let moveItem = oldChilren[moveItemIndex]
                if(moveItem.tag !== newStartChild.tag) {
                    // 标签不一样， 直接重新构建元素
                    parent.insertBefore(createEle(newStartChild), oldStartChild.el)
                } else {
                    patch(moveItem, newStartChild);
                    // 移动了的元素设置为undefined， 对比时直接跳过
                    oldChilren[moveItemIndex] = undefined;
                    parent.insertBefore(moveItem.el, oldStartChild.el)
                } 
            }
            // 新节点开始指针向后移动
            newStartChild = newChildren[++newStartIdx]
        }
    }
    // 对于对比结束后， 新的虚拟dom对比完还有节点的处理， 向父元素添加新子节点
    if(newStartIdx <= newEndIdx) {
        for(let i=newStartIdx; i<=newEndIdx; i++) {
            const nextEl = newChildren[newEndIdx+1] == null ? null : newChildren[newEndIdx+1].el 
            parent.insertBefore(createEle(newChildren[i]), nextEl)
        }   
    }
    // 对比结束， 老节点还存在， 需要将老节点删除
    if(oldStartIdx <= oldEndIdx) {
        for(let i=oldStartIdx; i<=oldEndIdx; i++) {
            let oldItem = oldChilren[i];
            // 移动时有的元素可能被设置为undefined了， 所以防止报错
            oldItem && parent.removeChild(oldItem.el)
        }   
    }
}
// 判断虚拟节点是否相同
function isSameVnode(a, b) {
    // key如果没设置前后dom可能都没设置， 如果旧dom设置了， 新dom没设置， 就按按不同的节点走
    return a.key == b.key && a.tag == b.tag
}
// 创建一个老的虚拟dom的key和index的映射，当时乱序时，用当前的新虚拟dom的key值去找旧的虚拟dom在原来的位置
function creatKeyToIndexMap(children) {
    let map = {};
    for(let i=0; i< children.length; i++) {
        const key = children[i] && children[i].key;
        key && (map[key] = i)
    }
    return map
}