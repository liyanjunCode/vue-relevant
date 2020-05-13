
import { copyOrigin, methods } from './array.js'
import Dep from './dep.js'
// 进行转换get和set前的的处理， 区分Object和Array数据观测分类处理
export class Observer {
    constructor(value) {
        Object.defineProperty(value, "__ob__", {
            enum: false,
            configurable: false,
            value: this
        })
        if (Array.isArray(value)) {
            //处理数组的情况
            '__proto__' in Object ? protoAgument(value, copyOrigin) : copyAgument(value, methods, copyOrigin)
            // 处理数组的递归监测
            this.observeArray(value)
        } else {
            // 处理对象的情况
            this.walk(value)
        }
    }

    walk(val) {
        // 对val中的值进行循环转换get set
        Object.keys(val).forEach(item => {
            defineReactive(val, item, val[item])
        })
    }
    observeArray(value) {
        for(let i=0; i< value.length; i++) {
            observe(value[i])
        }
    }
}
// 对数据进行get和set的具体转换
export function defineReactive(data, key, value) {
    const dep = new Dep()
    // 递归
    observe(value)
    Object.defineProperty(data, key, {
        get() {
            // 处理依赖收集逻辑
            dep.depend()
            return value
        },
        set(newVal) {
            // 处理数据更新及新增数据的get， set转换
            if(newVal === value) return
            value = newVal
            dep.notify()
        }
    })
}
function observe(value) {
    // 如果是对象或数组，就进入Observer方法递归进行get和set的转换
    if(typeof value !== "object" || typeof value === null) { return }

    if(value.__ob__) {
        return value.__ob__
    } else {
        new Observer(value)
    }   
}
// 挂载到原型
function protoAgument (val, proto) {
    val.__proto__ = proto
}
// 暴力挂载到value
function copyAgument (val, keys, source) {
    for(let i=0; i < keys.length; i++){
        val[keys[i]] = source[keys[i]]
    } 
}