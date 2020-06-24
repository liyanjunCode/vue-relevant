
<script >
export default{
    name: 'router-link',
    props:{
        tag: {
            type: String,
            default: 'a'
        }
    },
    render(h) {
        return h(this.tag, this.$slots.default)
    }
}
</script>