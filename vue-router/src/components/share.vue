<template>
   <div class="share-wrapper" @click="record">
        <Facebook :url="shareData.url" :title="shareData.title"></Facebook>        
        <Twitter :url="shareData.url" :title="shareData.title"></Twitter> 
        <WhatsApp :url="shareData.url" :title="shareData.title"></WhatsApp>
        <Email :url="shareData.url" :title="shareData.title"></Email>
   </div>
</template>
<script>
import { Facebook } from 'vue-socialmedia-share';
import { Twitter } from 'vue-socialmedia-share';
import { WhatsApp } from 'vue-socialmedia-share';
import { Email } from 'vue-socialmedia-share';
export default {
    name: 'share',
    props: {
        shareConfig: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {

        }
    },
    computed: {
        shareData: function() {
            return {
                url: location.href.split('?')[0] + '?', 
                title: ''
            }
        }
    },
    methods: {
        record() {
            console.log(1111)
        }
    },
    components: {
        Facebook,
        Twitter,
        WhatsApp,
        Email
    },
    created(){
        console.log(location.href.split('?')[0])
    }
}
</script>
<style scoped>
.share-wrapper {
    display: flex;
    justify-content: flex-end;
}

.share-wrapper span {
    display: inline-block;
    width: 50px;
    height: 50px;
    margin-right: 10px;
    background: url(../assets/facebook-share.png) no-repeat;
    background-size: 100% 100%; 
}
.share-wrapper span:nth-child(2) {
    background-image: url(../assets/twitter-share.png)
}
.share-wrapper span:nth-child(3) {
    background-image: url(../assets/Whatsapp-share.png)
}
.share-wrapper span:nth-child(4) {
    background-image: url(../assets/sms-share.png)
}
.share-wrapper >>> .fa-icon {
    display: none;
}
</style>
