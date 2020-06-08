function addRouteRecord(path, route){
    const match = [];
    console.log(route)
    return {
        path,
        match
    }
}
function createRouteMap(routes, oldList, oldMap){
    const pathList = oldList || [];
    const pathMap = oldMap || {};
    // 转换为pathList = ['/a', '/b', '/c']; pathMap = ｛'/a': {path:'/a', component:a},'/a/c': {path:'/a/c', component:c}, '/b': {path: '/b', component:b}｝
    routes.forEach(route => {
        const path = route.path
        const record = addRouteRecord(path,route)
    });
    return {
        pathList,
        pathMap
    }
}
export default function createRouteMacth(routes) {
    const {pathList, pathMap} = createRouteMap(routes)
    function match() {

    }
    // 添加的路由要和原来的路由整合到一起
    function addRoutes(routes) {
        createRouteMap(routes, pathList, pathMap)
    }
    return {
        match,
        addRoutes
    }
}