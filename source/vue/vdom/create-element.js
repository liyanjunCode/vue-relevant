export function createElement(tag, data, ...children) {
    let key
    if(Object.hasOwnProperty(data, 'key')) {
        key = data.key
        delete data.key
    }
    return vdom(tag, data, key, children)
}

export function createTextNode(text) {
    return vdom(null, null, null, null, text)
}

function vdom(tag, data, key, children, text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}