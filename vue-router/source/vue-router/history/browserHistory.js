import History from './history.js'

export class BrowserHistory extends History{
    constructor(router){
        super(router);
        console.log('初始化history路由')
    }
    
}