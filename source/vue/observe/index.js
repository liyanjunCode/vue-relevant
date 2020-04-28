
// 进行转换get和set前的的处理， 区分Object和Array数据观测分类处理
export class observer {
    constructor(value) {
        if (value instanceof Array) {
            //处理数组的情况
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
}
// 对数据进行get和set的具体转换
export function defineReactive(data, key, value) {
    // 如果是对象或数组，就进入observer方法递归进行get和set的转换
    if(typeof value === "object") { new observer(value) }

    Object.defineProperty(data, key, {
        get() {
            // 处理依赖收集逻辑
            return value
        },
        set(newVal) {
            // 处理数据更新及新增数据的get， set转换
            if(newVal === value) return
        }
    })
}