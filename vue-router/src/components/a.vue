<template>
  <div class="aaa">
      a
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-property-decorator";
export default  Vue.extend({
    name: 'aaa',
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
