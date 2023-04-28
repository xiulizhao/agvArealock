//axios配置网络请求的路径
const base = {
    //公共路径(前缀)
    baseUrl: "http://iwenwiki.com",

    //不同的子路径（后缀）
    getdlockata: '/api/blueberrypai/getChengpinDetails.php',
    chengpin: '/api/blueberrypai/getChengpinDetails.php',
    banner1:'/api/blueberrypai/getIndexBanner.php',
    indexList:'/api/newworld/indexlist.php'
}

export default base;
