
// 相当于vue2中的dep，存储依赖
let map = new WeakMap()
// 相当于vue2中的存储当前watcher的栈， 取值前存入， 取出值后从数组中删除
let effectStack = [];
// 相当于vue2中的wacher
function effect(fn, options= {}) {
   const effect = createWatcher(fn, options)
    //   如果不是计算属性，要执行一次 
   if(!effect.lazy) {
        effect()
   }
   return effect
}
// 计算属性
function computed(fn) {
    const runner = effect(fn, {computed: true, lazy: true})
    return {
        runner,
        get value(){
            return runner()
        }
    }
}
function createWatcher(fn, options) {
    const efn = function efn(...args){
        return run(efn,fn,args)
    }
    // 是否是懒执行
    efn.lazy = options.lazy;
    // 是否是计算属性
    efn.computed = options.computed;
    // 用于双向绑定dep, 用set保证唯一,不重复收集
    efn.deps = new Set()
    return efn
}
function run(effect,fn,args){
    if(!~effectStack.indexOf(effect)) {
        try {
            effectStack.push(effect);
            return fn(...args);
        }finally{
            effectStack.pop(effect)
        }
    }
}
// 收集依赖函数
function tract(target, key){
    // 收集依赖
    const effect =effectStack[effectStack.length-1]
    if(effect) {
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
            effect.deps.add(dep)
        }
    }
    
}
//触发依赖
function trigger(target, key, info){
    const targetMap = map.get(target);
    // 如果不存在依赖， 直接结束
    if(!targetMap) { return; }
    // 获取到key值的所存储依赖
    const effects = new Set();
    const computed = new Set();
    if(key) {
        const dep = targetMap.get(key)
        dep.forEach(effect => {
            // 执行会有取值过程， 需要将依赖推入栈中， 取完之后再删除
            if(!effect.computed) {
                effects.add(effect)
            } else {
                computed.add(effect)
            }
        });
        effects.forEach(effect=>effect())
        computed.forEach(computeRunner=>computeRunner())
    }
    
}
const baseHandle = {
    get(target, key, receiver){
        // 收集依赖
        const res = Reflect.get(target, key);
        tract(target, key)
        return typeof res == 'object' ? reactive(res) : res;
    },
    set(target, key, value) {
        const info = {oldval: Reflect.get(target, key), newVal: value}
        Reflect.set(target, key, value)
        // 触发依赖
        trigger(target, key, info);
    }
}
function reactive(target) {
    const observe = new Proxy(target, baseHandle)
    return observe
}