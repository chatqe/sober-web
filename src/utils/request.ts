/**
 * axios 请求封装
 *
 * @author sjq
 * @since 2025-10-27 22:20
 * @update 2025-12-11 优化代码结构和性能
 */

import axios from "axios";
import type {AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig} from "axios";
// 处理url参数
import qs from "qs";
import {useAuthStore, useUserStore} from "@/stores/index.js";
import {API_CODES, TIMEOUT} from "@/constant/index.js";
import type {ApiCode} from "@/constant/index.js";
import {ElMessage} from "element-plus";

// 响应数据类型定义
export interface ApiResponse<T = any> {
  code: ApiCode;
  msg: string;
  data: T;
  [key: string]: any;
}

// 请求配置选项
export interface RequestOptions {
  isAdmin?: boolean;
  contentType?: string;
  timeout?: number;
  onProgress?: (progressEvent: any) => void;
}

// 文件上传选项
export interface UploadOptions {
  onProgress?: (progressEvent: any) => void;
}

// 初始化状态管理
const authStore = useAuthStore();
const userStore = useUserStore();

// 环境配置
const baseURL = import.meta.env.VITE_BASE_URL;
const webUrl = import.meta.env.VITE_WEB_URL;

// 创建axios实例
const request: AxiosInstance = axios.create({
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
const getAuthHeaders = (isAdmin: boolean): Record<string, string> => {
    return {
        Authorization: isAdmin ? authStore.adminToken : authStore.userToken
    };
};

/**
 * 创建请求配置
 * @param {RequestOptions} options - 配置选项
 * @returns {AxiosRequestConfig} 请求配置
 */
const createReqConfig = ({isAdmin = false, contentType, timeout, onProgress}: RequestOptions): AxiosRequestConfig => {
    const config: AxiosRequestConfig = {
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
                (progressEvent as any).percent = (progressEvent.loaded / progressEvent.total) * 100;
            }
            onProgress(progressEvent);
        };
    }

    return config;
};

// 请求拦截器
request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么
    return config;
}, (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use((resp: AxiosResponse<ApiResponse>) => {
    const {data} = resp;
    // 业务成功
    if (data && typeof data === 'object' && data.code === API_CODES.SUCCESS && data.hasOwnProperty("code")) {
        return resp;
    }

    const msg = data?.msg || `请求失败[${data?.code || 'unknown'}]`;

    // 跳转
    if (data?.code === API_CODES.CLIENT_REDIRECT_LOGIN) {
        userStore.loadCurrentUser({});
        userStore.loadCurrentAdmin({} as any);
        userStore.clearUserData();
        window.location.href = `${webUrl}/verify`;
    } else {
        // 请求失败
        console.error('[API Error]', msg);
        ElMessage.error(msg);
    }
    return Promise.reject(new Error(msg));
}, (error: AxiosError) => {
    // 对响应错误做点什么
    let msg = '网络异常，请稍后重试';
    if (error.response) {
        const {status} = error.response;
        const statusMap: Record<number, string> = {
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
     * @returns {Promise<ApiResponse<T>>} 响应数据
     */
    async post<T = any>(
        url: string, 
        params: Record<string, any> = {}, 
        isAdmin: boolean = false, 
        json: boolean = true
    ): Promise<ApiResponse<T>> {
        const config = createReqConfig({isAdmin});
        const data = json ? params : qs.stringify(params);
        const res = await request.post<ApiResponse<T>>(url, data, config);
        return res.data;
    },

    /**
     * GET请求
     * @param {string} url - 请求地址
     * @param {Object} params - 请求参数
     * @param {boolean} isAdmin - 是否为管理员请求
     * @returns {Promise<ApiResponse<T>>} 响应数据
     */
    async get<T = any>(
        url: string, 
        params: Record<string, any> = {}, 
        isAdmin: boolean = false
    ): Promise<ApiResponse<T>> {
        const config = createReqConfig({isAdmin});
        const res = await request.get<ApiResponse<T>>(url, {
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
     * @param {UploadOptions} [option] - 配置选项
     * @returns {Promise<ApiResponse<T>>} 响应数据
     */
    async upload<T = any>(
        url: string, 
        param: FormData, 
        isAdmin: boolean = false, 
        option: UploadOptions = {}
    ): Promise<ApiResponse<T>> {
        const config = createReqConfig({
            isAdmin,
            contentType: "multipart/form-data",
            timeout: 60000,
            onProgress: option.onProgress
        });
        const res = await request.post<ApiResponse<T>>(url, param, config);
        return res.data;
    },

    /**
     * 七牛云文件上传请求
     * @param {string} url - 请求地址
     * @param {FormData} param - 表单数据
     * @returns {Promise<ApiResponse<T>>} 响应数据
     */
    async uploadQiniu<T = any>(
        url: string, 
        param: FormData
    ): Promise<ApiResponse<T>> {
        const config: AxiosRequestConfig = {
            headers: {"Content-Type": "multipart/form-data"},
            timeout: 60000
        };
        const res = await request.post<ApiResponse<T>>(url, param, config);
        return res.data;
    }
};