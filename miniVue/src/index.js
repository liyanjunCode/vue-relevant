import Vue from 'vue'
import { h } from '../source/vue/vdom/create-element.js'
const vue = new Vue({
    el: '#app',
    data() {
        return {
            a: 111,
            b: [[4, 5, 6], 2, 3],
            c: {
                a: 1,
                b: 2
            },
            d: '啥看看什么',
            first: '李',
            last: '艳军',
            status: false
        }
    },
    computed: {
        firstName() {
            return this.first + this.last
        }
    },
    watch: {
        // d: function(newVal, oldVal) {
        //     console.log(newVal, oldVal, '用户函数c')
        // }
        // d: {
        //     handler: function(newVal, oldVal) {
        //         console.log(newVal, oldVal, '用户函数d')
        //     },
        //     immediate: true
        // }
        // d: [
        //     {handler: 'aa',immediate: true,
        //     deep: true}
        // ]
    },
    methods: {
        aa() {
            console.log('aa')
        }
    },
    render: function(){
        // a b c d
        return h('div', {a:'11', style:{color: 'red', 'font-size': '20px'}}, h('div', {key:'a'}, 'a'),h('div', {key:'b'}, 'b'), h('div', {key:'c'}, 'c'), h('div', {key:'d'}, 'd'))
    }
})
// 向后插入元素 a b c d e f
// const vnode = h('div', {a:222, b: 222, style:{color: 'blue'}}, h('div', {key:'a'}, 'a'),h('div', {key:'b'}, 'b'), h('div', {key:'c'}, 'c'), h('div', {key:'d'}, 'd'), h('div', {key:'e'}, 'e'), h('div', {key:'f'}, 'f'))
// 向前插入元素 f e a b c d
// const vnode = h('div', {a:222, b: 222, style:{color: 'blue'}}, h('div', {key:'f'}, 'f'), h('div', {key:'e'}, 'e'), h('div', {key:'a'}, 'a'),h('div', {key:'b'}, 'b'), h('div', {key:'c'}, 'c'), h('div', {key:'d'}, 'd'))
// 移动元素 b c d a
// const vnode = h('div', {a:222, b: 222, style:{color: 'blue'}},h('div', {key:'b'}, 'b'), h('div', {key:'c'}, 'c'), h('div', {key:'d'}, 'd'), h('div', {key:'a'}, 'a'))
// 移动元素 d a b c 
// const vnode = h('div', {a:222, b: 222, style:{color: 'blue'}}, h('div', {key:'d'}, 'd'), h('div', {key:'a'}, 'a'),h('div', {key:'b'}, 'b'), h('div', {key:'c'}, 'c'))
// 移动元素 e d b c f
const vnode = h('div', {a:222, b: 222, style:{color: 'blue'}}, h('div', {key:'e'}, 'e'), h('div', {key:'d'}, 'd'),h('div', {key:'b'}, 'bb'), h('div', {key:'c'}, 'c'), h('div', {key:'f'}, 'f'))
setTimeout(() => {
    vue._patch(vnode)
}, 1000)
// const unwatch = vue.$watch('d', function(newvalue, oldVal){
//     console.log(newvalue, oldVal, '1111')
// })
// setTimeout(()=>{
//     vue.d= {
//         a: '我是a',
//         b: '我是b'
//     }
// }, 1000)

// setTimeout(()=>{
//     vue.d= {
//         a: '我是c',
//         b: '我是d'
//     }
//     vue.d= {
//         a: '我是c1',
//         b: '我是d1'
//     }
//     vue.d= {
//         a: '我是c2',
//         b: '我是d2'
//     }
//     console.log(vue.d.a, 111)
// }, 2000)
// setTimeout(()=>{
//     vue.d= {
//         a: '我是c3',
//         b: '我是d3'
//     }
// }, 3000)
// setTimeout(()=>{
//     vue.first= 'li'
// }, 2000)
