
const origin = Array.prototype  //复制数组原型
const copyOrigin = Object.create(origin)

// 数组的一下方法会对数组进行改变，所以需要处理
const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

methods.forEach( item => {
    Object.defineProperty(methods, item, {
        vaule: function() {

        },
        enum: false,
        configurable: false,
        
    })
})