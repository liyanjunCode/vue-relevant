
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
        // lastIndex用于匹配标记， 已经匹配到了字符串哪个位置
        let lastIndex = defaultTagRE.lastIndex = 0
        let matchItem,index
        // 匹配花括号值，直到匹配不到花括号
        while((matchItem=defaultTagRE.exec(text))) {
            // 匹配到的花括号在字符串中的开始位置
            index =matchItem.index
            // 如果index大于上次匹配结束的位置，说明lastIndex到index有纯文本
            if(index > lastIndex) {
                tokens.push(`"${text.slice(lastIndex, index)}"`)
            }
            // 花括号中的值
            tokens.push(`_s(${matchItem[1].trim()})`)
            // 记录匹配结束位置
            lastIndex = index + matchItem[0].length
        }
        // 匹配不到花括号， 但字符串还没有剩余， 说明还有纯文本
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
    // _c(tag, {id:a, class:u}, _c(tag, null, _v('hello'+ _s(hello))))

    const children = genaraChild(root.children)
    let code = `_c("${root.tagName}", ${root.attr.length ? gendata(root.attr) : undefined}, ${children ? children : ''})`
    return code
}
// 
{/* <div>
    <div>11</div>
</div> */}
export function compileToFunction(template) {
    // 生成ast语法树
    const root = parseHTML(template) 
        // {
    //    tag: div,
    //    attr: [a:1],
    //    chilren: [
    //        {
    //            tag: span, 
    //            children: [{tag:a}
    //         ]}
    //     ]
    // }
    const code = generate(root)
    // _c(tag, {id:a, class:u}, _c(tag, null, _v('hello'+ _s(k))))
    const render = new Function(`with(this){return ${code}}`) 
    //  生成render函数
    return render
}
