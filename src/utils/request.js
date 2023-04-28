import axios from 'axios'
import querystring from "querystring";

//axios的一些配置信息,相当于对axios做一些封装,这个js文件相当于一个封装好自己的配置的axios
//参考文档https://www.kancloud.cn/yunye/axios/234845/

const instance = axios.create({
    // 网络请求的公共配置
    timeout: 5000
})

//打印获取数据失败的错误信息
const errorHandle = (status,info) => {
    switch(status){
        case 400:
            console.log("语义有误");
            break;
        case 401:
            console.log("服务器认证失败");
            break;
        case 403:
            console.log("服务器拒绝访问");
            break;
        case 404:
            console.log("地址错误");
            break;
        case 500:
            console.log("服务器遇到意外");
            break;
        case 502:
            console.log("服务器无响应");
            break;
        default:
            console.log(info);
            break;
             }
     }

//拦截器最常用的

//1、发送数据之前（发送请求之前）
instance.interceptors.request.use(
    config =>{  //成功则进入此方法
        //config:包含着网络请求的所有信息
        if(config.method === 'post'){
            console.log("执行post请求")
            config.data = querystring.stringify(config.data)
        }
        return config;
    },
    error => { //失败则进入此方法
        return Promise.reject(error);
    }
)

//2、获取数据之前
instance.interceptors.response.use(
    response =>{ //成功则进入此方法
        //无论请求后端成功与否，都会返回响应信息，只不过返回的方法用的不一样
        return response.status === 200 ? Promise.resolve(response) : Promise.reject(response);
    },
    error => { //失败则进入此方法
        const { response } = error;
        //错误的处理才是我们需要关注的
        errorHandle(response.status, response.info)
    }
)

export default instance;
