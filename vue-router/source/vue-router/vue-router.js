import createRouteMacth from './create-route-match.js'
import { HashHistory } from './history/hashHistory.js'
import { BrowserHistory } from './history/browserHistory.js'
export default class VueRouter {
    constructor(optioins){
        const routes = optioins.routes || [];
        // 创建路由的匹配器和添加器，匹配器match用来匹配路由， 添加器addRoutes用来添加新路由
        this.matcher = createRouteMacth(routes);

        const mode = optioins.mode || 'hash';
        switch(mode) {
        case 'hash':
            this.history = new HashHistory(this);
            break;
        case 'history':
            this.history = new BrowserHistory(this);
            break;
        }

    }
    match(location){
        return this.matcher.match(location)
    }
    init(app){
        const history = this.history;
        const setupListner = function(){
            history.setupListner();
        }
        history.transitionTo(history.getCurrentLocation(), setupListner);
        this.history.listen((current)=> {
            this._routes = current;
        })
    }
}