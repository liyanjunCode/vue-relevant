<template>
  <div class="hello">
      hello
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-property-decorator";
export default  Vue.extend({
    name: 'HelloWorld',
    data() {
        return {
           
        }
    },
    components: {

    },
    watch: {

    },
    methods: {
        alertName(): void {
            alert('myName')
        }
    },
    created () {
       
    },
    mounted() {
        // 布尔值
        // let s:boolean  = false;
        // console.warn(s)
        // // 数字
        // let dec:number = 1;
        // let den:number = NaN;
        // console.warn(dec, den)
        // // 字符串
        // let myName: string = 'Tom';
        // let myAge: number = 25;

        // let sentence: string = `Hello, my name is ${myName}.I'll be ${myAge + 1} years old next month.`;
        // console.warn(sentence)
        // let ooo = this.alertName()
        // console.warn(ooo, 111)

        // let testAny: any = '1111';
        // console.warn(testAny);
        // testAny = 222;
        // console.warn(testAny);
        // testAny = false;
        // console.warn(testAny);
        // testAny = undefined;
        // console.warn(testAny);
        // 类型推断
        // let ss = 'sjdfjsl';
        // ss =2;
        // console.log(ss)
        let arr : Array<number> = [1, 2, 3, 4, 5, 6]
        arr.push(1)
        console.warn(arr)
    }
})
</script>
<style>
*{
    margin: 0;
    padding: 0;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
