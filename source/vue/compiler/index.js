
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function compileToFunction(template) {
    parseHTML(template)
    return function render() {

    }
}
function parseHTML(template) {
    let html = template
    // 定义ast抽象语法树的根
    let root = null
    while(html) {
        // 获取尖角号的位置
        let endIndex = html.indexOf('<')
        // 如果等于0 说明是标签开始或结束的地方
        if(endIndex == 0) {
            const matchAll = parseStart()
            root = {
                tag: matchAll[1]
            }
        }
        break;
    }
    function parseStart() {
        const match = html.match(startTagOpen)
        advance(match[0].length)
        return match
    }
    function advance(index){
        html = html.substring(index)
    }
}