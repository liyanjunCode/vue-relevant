const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
// ast的根节点
let root = null
// 记录当前处理的标签
let currentParent
// 栈用于关联标签间的父子级关系
let stack = []
// 创建元素类型， 1位元素节点 3为文本节点
const ELEMENT_TYPE = 1
const TEXT_TYPE = 3
export function parseHTML(template) {
    let html = template
    // 定义ast抽象语法树的根
    while(html) {
        // 获取尖角号的位置
        let endIndex = html.indexOf('<')
        // 如果等于0 说明是标签开始或结束的地方
        if(endIndex == 0) {
            // 匹配开始标签的标签名和属性
            const startMatch = parseStartTag()
            // 匹配到结果， 转为ast
            if(startMatch) {
                start(startMatch)
                continue
            }
            // 匹配到结束，截取字符串并建立ast的父子级关系
            let endMatch;
            if(endMatch = html.match(endTag)) {
                advance(endMatch[0].length)
                end(endMatch[1])
                continue
            }
        }
        // 如果<号不是在第一位， 则标签钱有空格或文本
        let text
        if(endIndex > 0) {
            text = html.substring(0, endIndex);
        }
        
        if(text) {
            advance(text.length)
            chars(text)
        }
    }
    function parseStartTag() {
        // 匹配开始标签
        const start = html.match(startTagOpen)
        // 匹配有结果
        if (start) {
            // 处理当前标签名和属性
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            // 循环处理属性
            let end, attr;
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3]
                })
                advance(attr[0].length)
            }
            
            // 开始标签结束将标签名和属性数组 传递出去
            if(end) {
                advance(end[0].length)
                return match     
            }
        }
    }
    // 负责截取html字符串
    function advance(index){
        html = html.substring(index)
    }
    return root 
}
function start(start) {
    // 创建ast元素节点
    const el = createAstElemnt(start.tagName, start.attrs, ELEMENT_TYPE)
    // 如果没有ast的根root 就把当前元素设置为根元素
    if(!root) {
        root = el
    }
    // 存储当前元素为父元素，并推入栈中
    currentParent = el
    stack.push(el)
}
function end(end) {
    // 拿出当前解析的标签
    const element = stack.pop()
    if(element.tagName == end) {
        // 拿出当前栈中的父级标签
        currentParent = stack[stack.length - 1]
        if(currentParent) {
            // 建立ast中的父子级关系
            currentParent.children.push(element)
            element.parent = currentParent
        } 
    }
}
function chars(text) {
    // 去除掉空格s
    text = text.replace(/\s/g, '') 
    // 如果去除空格还存在就说明有文本， 存入到当前的ast中的标签子元素中
    if(text) {
        currentParent.children.push({
            text,
            type: TEXT_TYPE
        })
    }
     
}
function createAstElemnt(tag, attr, type) {
    return {
        tagName: tag,
        type,
        attr,
        parent: null,
        children: []
    }
}