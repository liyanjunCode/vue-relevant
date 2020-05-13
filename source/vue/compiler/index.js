
import { parseHTML, defaultTagRE } from './parse-html.js'
function genaraChild(children) {
    if(children.length) {
        return `${children.map(el => {return gen(el)}).join(',')}`
    } else {
        return false
    }   
}
function gen(el) {
    if(el.type === 1) {
        return generate(el)
    } else {
        const text = el.text
        const tokens = []
        let lastIndex = defaultTagRE.lastIndex = 0
        let matchItem,index
        while((matchItem=defaultTagRE.exec(text))) {
            index =matchItem.index
            if(index > lastIndex) {
                tokens.push(`"${text.slice(lastIndex, index)}"`)
            }
            tokens.push(`_s(${matchItem[1].trim()})`)
            lastIndex = index + matchItem[0].length
        }
        if(lastIndex < text.length) {
            tokens.push(`"${text.slice(lastIndex)}"`)
        }
        return `_v(${tokens.join('+')})`
    }
}
// hello {{name}} a {{age}}
// _c(tag, {id:a, class:u}, _c(tag, null, _v('hello'+ _s(hello))))
function gendata(attrs) {
    let i = attrs.length
    const attrObj = {}
    while(i--) {
        const item = attrs[i]
        if(item.name === 'style') {
            const styleVal = {}
            const itemvalue = item.value.split(';')
            let len = itemvalue.length - 1;
            while(len--) {
                const elArr = itemvalue[len].split(':')
                styleVal[elArr[0].trim()] = elArr[1]
            }
            item.value = styleVal
        }
        attrObj[item.name] = item.value  
    }
    return JSON.stringify(attrObj)
}
function generate(root) {
    const children = genaraChild(root.children)
    let code = `_c("${root.tagName}", ${root.attr.length ? gendata(root.attr) : undefined}, ${children ? children : ''})`
    return code
}

export function compileToFunction(template) {
    // 生成ast语法树
    const root = parseHTML(template) 
    const code = generate(root)
    const render = new Function(`with(this){return ${code}}`)
    //  生成render函数
    return render
}
