import Vue from 'vue'
const vue = new Vue({
    el: 'app',
    data() {
        return {
            a: 111,
            b: [[4, 5, 6], 2, 3],
            c: {
                a: 1,
                b: 2
            }
        }
    },
    methods: {

    }
})
vue.b.push('s')