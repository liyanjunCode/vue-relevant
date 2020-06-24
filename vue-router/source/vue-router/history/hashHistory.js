import History from './history.js'
// 确保有hash路径，为第一次进入如hash输入做的处理
function ensure(){
    if(window.location.hash){
        return
    }
    window.location.hash = '/';
}
export class HashHistory extends History {
    constructor(router){
        super(router);
        ensure();
    }
    // 获取当前的hash路径
    getCurrentLocation(){
        return window.location.hash.slice(1);
    }
    // 监听hash路由改变
    setupListner(){
        window.addEventListener('hashchange', () => {
            // hash改变重新调用transitionTo跳转
            this.transitionTo(this.getCurrentLocation());
        })
    }
}