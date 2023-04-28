import axios from '../utils/request'
import path from './path'

const api = {

    // 诚品详情地址

    getDataList(){
        return axios.get(path.baseUrl + path.getdlockata)
    },
    getChengPin(){
        
        return axios.get(path.baseUrl + path.chengpin)
    },
    getBanner1(){
        return axios.get(path.baseUrl + path.banner1)
    },
    getIndexList(params){
        return axios.post(path.baseUrl + path.indexList,params)
    }
 

}

export default api;