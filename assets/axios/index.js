import axios from 'axios'//引入axios
import { getToken } from "./token";

//======================================================创建axios实例=======================================
const ConfigBaseURL='http://backstage.api.lanjingshuzi.com'
export const Axios = axios.create({
    timeout:30000,
    baseURL: ConfigBaseURL,
})

export const Https = axios.create({
    timeout:30000
})
//============================================request拦截器，对请求参数做处理====================================

Axios.interceptors.request.use(config => {
    const Token = getToken()
    if (Token) {
        config.headers.Authorization = `Bearer ${Token}`
    }
    return config;
},(err)=>{
        return Promise.reject(err);
    });

/* =======================================================响应拦截器============================================ */

Axios.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response.data.message === 'Unauthenticated.') {
            window.location.href = '/login'
        }
        return Promise.reject(error)
    })