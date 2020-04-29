

export const originPorto = Array.prototype  //复制数组原型
export const copyOrigin = Object.create(originPorto)

// 数组的一下方法会对数组进行改变，所以需要处理
export const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

methods.forEach( item => {
    const originMethods = originPorto[item]
    console.log(item)
    Object.defineProperty(copyOrigin, item, {
        value: function(...args) {
            // 调用数组方法后触发
            originMethods.call(this, args)
            const ob = this.__ob__  // 新增
            let insert;
            // 判断方法
            switch(item) {
                case 'push':
                case 'unshift':
                    insert = args.slice(0)
                    break
                case 'splice':
                    insert = args.slice(2)
                    break
            }
            
            insert && ob.observeArray(insert) // 新增
            
            
        },
        enum: false,
        configurable: false,
    })
})