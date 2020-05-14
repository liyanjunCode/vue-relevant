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
            d: '啥看看什么'
        }
    },
    watch: {
        d: function(newVal, oldVal) {
            console.log(newVal, oldVal, '用户函数')
        },
        c: {
            handler : function(newVal, oldVal){
                console.log(newVal, oldVal, '用户对象')
            },
            immediate: true,
            deep: true
        }
    },
    methods: {

    }
})
setTimeout(()=>{
    vue.d= {
        a: '我是a',
        b: '我是b'
    }
    vue.b[0].push(9)
}, 1000)