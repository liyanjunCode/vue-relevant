import Vue from 'vue'
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
            last: '艳军'
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
    }
})
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
// }, 2000)
setTimeout(()=>{
    vue.first= 'li'
}, 2000)
