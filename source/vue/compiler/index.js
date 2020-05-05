
import { parseHTML } from './parse-html.js'

export function compileToFunction(template) {
    // 生成ast语法树
    const root = parseHTML(template) 
    //  生成render函数
    return function render() {

    }
}
