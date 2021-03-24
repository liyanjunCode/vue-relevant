import { effect, track, trigger } from "./effect"
import { TriggerOpTypes } from "./oprations"
import { isFunction } from "../share"
class Computed {
    constructor(getter, setter) {
        // getter函数
        this.getter = getter;
        // setter函数
        this.setter = setter;
        // 只读不可设置值
        //用于标识计算属性是否需要重新计算
        this.dirty = true;
        // 计算属性的值
        this._value = "";
        // 创建计算属性副作用函数
        this.effect = effect(getter, {
            // lazy标识为true时，effect函数不会被默认执行，只有当真正用到计算属性时才会执行effect函数进行求职
            lazy: true,
            // 当scheduler触发时表示依赖的数据改编变，需要重新计算，dirty需要设置为true
            scheduler: () => {
                if (!this.dirty) {
                    this.dirty = true;
                    // 当计算属性值改变时，通知使用到计算属性值的地方，进行更新
                    trigger(this, TriggerOpTypes.SET, "value");
                }
            }
        })
    }
    get value () {
        // 获取值时， 先根据dirty判断是否需要重新计算值，如果需要就重新运行effect副作用函数，并将dirty设置为true 否则直接读取_value缓存的值
        if (this.dirty) {
            this._value = this.effect();
            this.dirty = false;
        }
        // 收集计算函数的依赖
        track(this, "value");
        // 返回value
        return this._value
    }

    set value (val) {
        this.setter(val);
    }
}


export const computed = (getterOrOptions) => {
    /*
    * 第一步标准化参数
    * getterOrOptions有两种格式
    * 1.用户传递的是函数，直接将getterOrOptions赋值给getter函数
    * 2.用户传递的是包含getter和setter函数的对象，分别取出getter和stter
    * 第二步进行computed函数创建 传递三个参数
    * 1.getter函数
    * 2.setter函数
    * 标识是否可以进行set设置的表示，根据getterOrOptions是否为函数和setter是否存在判断是否只读
    */
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => { console.error("不能对计算属性进行赋值") }
    } else {
        const { get, set } = getterOrOptions;
        getter = get || (() => { });
        setter = set || (() => { });
    }
    // , isFunction(getterOrOptions) || !getterOrOptions.set
    return new Computed(getter, setter)
}