/**
 * axios 请求封装
 *
 * @author sjq
 * @since 2025-10-27 22:20
 */

import axios from "axios";
// 处理url参数
// import qs from "qs";
// import {stringify} from 'query-string';
import {useAuthStore, useUserStore} from "@/stores/index.js";
import {API_CODES, TIMEOUT} from "@/constant/index.js";
import {ElMessage} from "element-plus";

const authStore = useAuthStore()
const userStore = useUserStore()

const baseURL = import.meta.env.VITE_BASE_URL;
const webUrl = import.meta.env.VITE_WEB_URL;

const request = axios.create({
    baseURL,
    timeout: TIMEOUT.DEFAULT,
    withCredentials: true
})

// axios.defaults.baseURL = constant.baseURL;


// 添加请求拦截器
request.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    return config;
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use((resp) => {
    const {data} = resp
    // 业务成功
    if (data && typeof data === 'object' && data.code === API_CODES.SUCCESS && data.hasOwnProperty("code")) {
        // return data.data || true
        return resp
    }

    const msg = data?.message || `请求失败[${data?.code || 'unknown'}]`

    // 跳转
    if (data?.code === API_CODES.CLIENT_REDIRECT_LOGIN) {
        userStore.loadCurrentUser({})
        userStore.loadCurrentAdmin({})
        userStore.clearUserData()
        window.location.href = webUrl + "/user"
    } else {
        // 请求失败
        console.log('[API Error]', msg)
        ElMessage.error(msg)
    }
    return Promise.reject(new Error(msg));
}, (error) => {
    // 对响应错误做点什么
    let msg = '网络异常，请稍后重试';
    if (error.response) {
        const {status} = error.response;
        const statusMap = {
            [API_CODES.UNAUTHORIZED]: '登录已过期，请重新登录',
            [API_CODES.FORBIDDEN]: '没有权限访问该资源',
            [API_CODES.NOT_FOUND]: '请求资源不存在',
            [API_CODES.SERVER_ERROR]: '服务器内部错误',
        };
        msg = statusMap[status] || `请求失败 [${status}]`;
    } else if (!error.request) {
        msg = '请求配置错误';
    }
    console.error('[Network Error]', error);
    ElMessage.error(msg);
    return Promise.reject(error);
});


/**
 * 当data为URLSearchParams对象时设置为application/x-www-form-urlencoded;charset=utf-8
 * 当data为普通对象时，会被设置为application/json;charset=utf-8
 */
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

        // 将参数转为 URLSearchParams（如果不是 json）
        const data = json ? params : new URLSearchParams(params);

        return new Promise((resolve, reject) => {
            request
                .post(url, data, config)
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
                headers: {"Authorization": authStore.adminToken, "Content-Type": "multipart/form-data"},
                timeout: 60000
            };
        } else {
            config = {
                headers: {"Authorization": authStore.userToken, "Content-Type": "multipart/form-data"},
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
