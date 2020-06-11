
// 相当于vue2中的dep，存储依赖
let map = new WeakMap()
// 相当于vue2中的存储当前watcher的栈， 取值前存入， 取出值后从数组中删除
let effectStack = [];
// 相当于vue2中的wacher
function effect(fn, options= {}) {

}
// 计算属性
function computed(fn) {
    const options = {computed: true, lazy: true};
    effect(fn, options)
}
function createWatcher(fn, options) {
    const efn = function efn(){
        fn()
    }
}
// 收集依赖函数
function tract(target, key){
    let targetMap = map.get(target);
    if(targetMap == void 0) {
        targetMap = new Map();
        map.set(target, targetMap)
    }
    if(key) {
        let dep = targetMap.get(key);
        if(dep == void 0) {
            dep = new Set();
            targetMap.set(key, dep)
        }
        const effect = effectStack[effectStack.length - 1];
        // dep中存储
        dep.add(effect);
        // 这里双向存储
    }
    console.log(targetMap)
}
//触发依赖
function trigger(target, key, info){
    const targetMap = map.get(target);
    // 如果不存在依赖， 直接结束
    if(!targetMap) { return; }
    // 获取到key值的所存储依赖
    const dep = targetMap.get(key)
    dep.foreEach(effect => {
        // 执行会有取值过程， 需要将依赖推入栈中， 取完之后再删除
        try{
            effectStack.push(effect);
            effect();
        } finally {
            effectStack.pop();
        }
    });
}
const baseHandle = {
    get(target, key, receiver){
        // 收集依赖
        tract(target, key)
        return Reflect.get(target, key)
    },
    set(target, key, value) {
        const info = {oldval: Reflect.get(target, key), newVal: value}
        Reflect.set(target, key, value)
        // 触发依赖
        trigger(target, key, info);
    }
}
function reactive(target) {
    const react = new Proxy(target, baseHandle)
    return react
}