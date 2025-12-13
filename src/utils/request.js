/**
 * axios 请求封装
 *
 * @author sjq
 * @since 2025-10-27 22:20
 * @update 2025-12-11 优化代码结构和性能
 */

import axios from "axios";
// 处理url参数
import qs from "qs";
import {useAuthStore, useUserStore} from "@/stores/index.js";
import {API_CODES, TIMEOUT} from "@/constant/index.js";
import {ElMessage} from "element-plus";

// 初始化状态管理
const authStore = useAuthStore();
const userStore = useUserStore();

// 环境配置
const baseURL = import.meta.env.VITE_BASE_URL;
const webUrl = import.meta.env.VITE_WEB_URL;

// 创建axios实例
const request = axios.create({
    baseURL,
    timeout: TIMEOUT.DEFAULT,
    withCredentials: true
});

// axios.defaults.baseURL = constant.baseURL;

/**
 * 获取认证头信息
 * @param {boolean} isAdmin - 是否为管理员请求
 * @returns {Object} 认证头配置
 */
const getAuthHeaders = (isAdmin) => {
    return {
        Authorization: isAdmin ? authStore.adminToken : authStore.userToken
    };
};

/**
 * 创建请求配置
 * @param {Object} options - 配置选项
 * @param {boolean} options.isAdmin - 是否为管理员请求
 * @param {string} [options.contentType] - 内容类型
 * @param {number} [options.timeout] - 超时时间
 * @param {Function} [options.onProgress] - 进度回调函数
 * @returns {Object} 请求配置
 */
const createReqConfig = ({isAdmin, contentType, timeout, onProgress}) => {
    const config = {
        headers: {
            ...getAuthHeaders(isAdmin),
            ...(contentType && {"Content-Type": contentType})
        },
        ...(timeout && {timeout})
    };

    // 添加上传进度回调
    if (onProgress) {
        config.onUploadProgress = (progressEvent) => {
            if (progressEvent.total > 0) {
                progressEvent.percent = (progressEvent.loaded / progressEvent.total) * 100;
            }
            onProgress(progressEvent);
        };
    }

    return config;
};

// 请求拦截器
request.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    return config;
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use((resp) => {
    const {data} = resp
    // 业务成功
    if (data && typeof data === 'object' && data.code === API_CODES.SUCCESS && data.hasOwnProperty("code")) {
        // return data.data || true
        return resp
    }

    const msg = data?.msg || `请求失败[${data?.code || 'unknown'}]`

    // 跳转
    if (data?.code === API_CODES.CLIENT_REDIRECT_LOGIN) {
        userStore.loadCurrentUser({})
        userStore.loadCurrentAdmin({})
        userStore.clearUserData()
        window.location.href = `${webUrl}/user`
    } else {
        // 请求失败
        console.error('[API Error]', msg)
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
    /**
     * POST请求
     * @param {string} url - 请求地址
     * @param {Object} params - 请求参数
     * @param {boolean} isAdmin - 是否为管理员请求
     * @param {boolean} json - 是否为JSON请求
     * @returns {Promise<Object>} 响应数据
     */
    async post(url, params = {}, isAdmin = false, json = true) {
        const config = createReqConfig({isAdmin});
        const data = json ? params : qs.stringify(params);
        const res = await request.post(url, data, config);
        return res.data;
    },

    /**
     * GET请求
     * @param {string} url - 请求地址
     * @param {Object} params - 请求参数
     * @param {boolean} isAdmin - 是否为管理员请求
     * @returns {Promise<Object>} 响应数据
     */
    async get(url, params = {}, isAdmin = false) {
        const config = createReqConfig({isAdmin});
        const res = await request.get(url, {
            params,
            headers: config.headers
        });
        return res.data;
    },

    /**
     * 文件上传请求
     * @param {string} url - 请求地址
     * @param {FormData} param - 表单数据
     * @param {boolean} isAdmin - 是否为管理员请求
     * @param {Object} [option] - 配置选项
     * @returns {Promise<Object>} 响应数据
     */
    async upload(url, param, isAdmin = false, option = {}) {
        const config = createReqConfig({
            isAdmin,
            contentType: "multipart/form-data",
            timeout: 60000,
            onProgress: option.onProgress
        });
        const res = await request.post(url, param, config);
        return res.data;
    },

    /**
     * 七牛云文件上传请求
     * @param {string} url - 请求地址
     * @param {FormData} param - 表单数据
     * @returns {Promise<Object>} 响应数据
     */
    async uploadQiniu(url, param) {
        const config = {
            headers: {"Content-Type": "multipart/form-data"},
            timeout: 60000
        };
        const res = await request.post(url, param, config);
        return res.data;
    }
};