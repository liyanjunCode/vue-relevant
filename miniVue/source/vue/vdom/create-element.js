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

function vdom(tag, data = {}, key, children = [], text) {
    return {
        tag,
        data,
        key,
        children,
        text
    }
}
export function h(type, config, ...children) {
    const props = {};
    let key = null;
    if (config) {
        if (config.key) {
            key = config.key;
        }
        for (let propName in config) {
            if (hasOwnProperty.call(config, propName)) {
                props[propName] = config[propName];
            }
        }
    }
    return vdom(type, props, key, children.map((child, index) => {
        return typeof child == 'number' || typeof child == 'string' ? vdom(undefined, undefined, undefined, undefined, child) : child;
    }));
}