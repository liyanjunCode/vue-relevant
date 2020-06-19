function addRouteRecord(route, pathList, pathMap, parentRecord){
    // 这里可能父组件下有子组件， 上下关联的组件， 子组件需要将父组件的路径拼接上
    const path = parentRecord ? `${parentRecord.path}${route.path}` : route.path;
    // 路由映射记录
    const record = {
        path,
        component: route.component
    }
    // 如果数据为添加过才添加， 防止用户重复书写相同名称覆盖
    if(!pathMap[path]) {
        pathMap[path] = record;
        pathList.push(path);
    }
    // 如果有子路由， 进行递归处理
    if(route.children) {
        route.children.forEach(r => {
            addRouteRecord(r, pathList, pathMap, record)
        })
    }
}
function createRouteMap(routes, oldList, oldMap){
    const pathList = oldList || [];
    const pathMap = oldMap || {};
    // 转换为pathList = ['/a', '/b', '/c']; pathMap = ｛'/a': {path:'/a', component:a},'/a/c': {path:'/a/c', component:c}, '/b': {path: '/b', component:b}｝
    routes.forEach(route => {
        // 抽离出函数处理， 是因为书写的数据结构
        addRouteRecord(route, pathList, pathMap)
    });
    return {
        pathList,
        pathMap
    }
}
export default function createRouteMacth(routes) {
    // 生成易于程序使用的对应路由结构
    const {pathList, pathMap} = createRouteMap(routes)
    // 用于匹配路径是哪个组件
    function match() {
        
    }
    // 添加的路由要和原来的路由整合到一起
    // 用户添加新路由
    function addRoutes(routes) {
        createRouteMap(routes, pathList, pathMap)
    }
    return {
        match,
        addRoutes
    }
}