// Axios 请求封装
import axios from "axios";
//处理url参数
// import qs from "qs";
import { stringify } from 'query-string';
import {useAuthStore,useUserStore} from "@/stores";

const authStore = useAuthStore()
const userStore = useUserStore()

const baseURL = import.meta.env.VITE_BASE_URL;
const webUrl = import.meta.env.VITE_WEB_URL;

const request = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true
})

// axios.defaults.baseURL = constant.baseURL;


// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(function (response) {
    if (response.data !== null && response.data.hasOwnProperty("code") && response.data.code !== 200) {
        if (response.data.code === 300) {

            userStore.loadCurrentUser({})
            userStore.loadCurrentAdmin({})
            userStore.clearUserData()
            window.location.href = webUrl + "/user";
        }
        return Promise.reject(new Error(response.data.message));
    } else {
        return response;
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

// 当data为URLSearchParams对象时设置为application/x-www-form-urlencoded;charset=utf-8
// 当data为普通对象时，会被设置为application/json;charset=utf-8


export default {
    post(url, params = {}, isAdmin = false, json = true) {
        let config;
        if (isAdmin) {
            config = {
                headers: {"Authorization": authStore.adminToken}
            };
        } else {
            config = {
                headers: {"Authorization": authStore.userToken}
            };
        }

        return new Promise((resolve, reject) => {
            request
                .post(url, json ? params : stringify(params), config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    get(url, params = {}, isAdmin = false) {
        let headers;
        if (isAdmin) {
            headers = {"Authorization": authStore.adminToken};
        } else {
            headers = {"Authorization": authStore.userToken};
        }

        return new Promise((resolve, reject) => {
            request.get(url, {
                params: params,
                headers: headers
            }).then(res => {
                resolve(res.data);
            }).catch(err => {
                reject(err)
            })
        });
    },

    upload(url, param, isAdmin = false, option) {
        let config;
        if (isAdmin) {
            config = {
                headers: {"Authorization": localStorage.getItem("adminToken"), "Content-Type": "multipart/form-data"},
                timeout: 60000
            };
        } else {
            config = {
                headers: {"Authorization": localStorage.getItem("userToken"), "Content-Type": "multipart/form-data"},
                timeout: 60000
            };
        }
        if (typeof option !== "undefined") {
            config.onUploadProgress = progressEvent => {
                if (progressEvent.total > 0) {
                    progressEvent.percent = progressEvent.loaded / progressEvent.total * 100;
                }
                option.onProgress(progressEvent);
            };
        }

        return new Promise((resolve, reject) => {
            request
                .post(url, param, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },

    uploadQiniu(url, param) {
        let config = {
            headers: {"Content-Type": "multipart/form-data"},
            timeout: 60000
        };

        return new Promise((resolve, reject) => {
            request
                .post(url, param, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}
