<template>
  <div class="about">
      about
      <asd></asd>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-property-decorator";
import asd from './a.vue'
export default  Vue.extend({
    name: 'about',
    data() {
        return {
           
        }
    },
    components: {
        asd
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
