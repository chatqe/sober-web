import axios from "axios";
import {useAuthStore} from "@/stores/index.js";
import router from "@/router/index";

// import Cookies from "js-cookie";
// import {handleRefreshToken} from "../api/index";
// import {v4 as uuidv4} from 'uuid';

// 常量定义
const HTTP_STATUS = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};

const BUSINESS_CODES = {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    TOKEN_EXPIRED: 20004,
};

const authStore = useAuthStore();

// 统一请求路径前缀
// export const commonUrl = process.env.NODE_ENV === "development"
//     ? BASE.API_DEV.common
//     : BASE.API_PROD.common;

// export const baseUrl = (import.meta.env.NODE_ENV === "development"
//     ? BASE.API_DEV.manager
//     : BASE.API_PROD.manager) + BASE.PREFIX;

// 文件上传接口
// export const uploadFile = commonUrl + "/common/common/upload/file";

// 创建 axios 实例
const service = axios.create({
    timeout: 60000,
    baseURL: import.meta.env.VITE_API_URL

});

// 请求配置管理
const getCommonConfig = (config = {}) => {
    const {needsToken = true, responseType, headers = {}} = config;

    const commonConfig = {
        headers: {...headers}
    };

    // 添加 UUID
    // let uuid = getStore("uuid");
    // if (!uuid) {
    //     uuid = uuidv4();
    //     setStore('uuid', uuid);
    // }
    // commonConfig.headers.uuid = uuid;

    // 添加 token
    if (needsToken) {
        // const accessToken = getStore("accessToken");
        const accessToken = authStore.accessToken;
        if (accessToken) {
            commonConfig.headers.accessToken = accessToken;
        }
    }

    // 设置响应类型
    if (responseType) {
        commonConfig.responseType = responseType;
    }

    return commonConfig;
};

// 参数序列化
const transformRequestData = (data) => {
    if (!data || typeof data !== 'object') return data;

    const formData = new URLSearchParams();
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    return formData;
};

// 防抖的 token 刷新函数
const createTokenRefreshDebounce = () => {
    let refreshPromise = null;

    return function () {
        if (!refreshPromise) {
            refreshPromise = new Promise((resolve) => {
                // const oldRefreshToken = getStore("refreshToken");
                const oldRefreshToken = authStore.refreshToken;
                handleRefreshToken(oldRefreshToken)
                    .then(res => {
                        if (res && res.success) {
                            const {accessToken, refreshToken} = res.result;
                            authStore.setTokens(accessToken, refreshToken)
                            resolve("success");
                        } else {
                            // 刷新失败，清除用户信息并跳转登录
                            Cookies.set("userInfoManager", "");
                            authStore.setTokens("", "")
                            router.push("/login");
                            resolve("fail");
                        }
                    })
                    .catch(error => {
                        console.error("Token refresh failed:", error);
                        Cookies.set("userInfoManager", "");
                        router.push("/login");
                        resolve("fail");
                    })
                    .finally(() => {
                        refreshPromise = null; // 重置，允许下次刷新
                    });
            });
        }

        return refreshPromise;
    };
};

const refreshTokenDebounce = createTokenRefreshDebounce();

// 请求拦截器
service.interceptors.request.use(
    config => {
        // GET 请求添加时间戳防止缓存
        if (config.method === "get" || config.method === "GET") {
            config.params = {
                _t: Date.now(),
                ...config.params
            };
        }
        return config;
    },
    error => {
        Message.error("请求配置错误");
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        const data = response.data;

        // 处理业务错误码
        handleBusinessError(data);

        return data;
    },
    async error => {
        if (!error.response) {
            Message.error("网络错误，请检查网络连接");
            return Promise.reject(error);
        }

        const {status, data} = error.response;

        switch (status) {
            case HTTP_STATUS.UNAUTHORIZED:
            case HTTP_STATUS.FORBIDDEN:
                await handleTokenError(error);
                break;

            case HTTP_STATUS.NOT_FOUND:
                Message.error("请求的资源不存在");
                break;

            case HTTP_STATUS.INTERNAL_SERVER_ERROR:
                Message.error(data?.message || "服务器内部错误");
                break;

            case HTTP_STATUS.BAD_REQUEST:
                Message.error(data?.message || "请求参数错误");
                break;

            default:
                Message.error(data?.message || "网络错误");
        }

        return Promise.reject(error);
    }
);

// 处理业务错误码
function handleBusinessError(data) {
    if (!data) return;

    const {code, message} = data;

    if (code === BUSINESS_CODES.SUCCESS) return;

    // 错误消息显示
    if (message) {
        Message.error(message);
    }

    switch (code) {
        case HTTP_STATUS.BAD_REQUEST:
            if (!message) Message.error("系统异常");
            break;

        case BUSINESS_CODES.UNAUTHORIZED:
        case BUSINESS_CODES.TOKEN_EXPIRED:
            handleUnauthorized(data.message);
            break;

        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
            if (!message) Message.error("系统异常");
            break;

        default:
            // 其他错误码处理
            break;
    }
}

// 处理未授权情况
function handleUnauthorized(errorMessage) {
    Cookies.set("userInfoManager", "");
    authStore.clearTokens();

    if (router.currentRoute.value.name !== "login") {
        Message.error(errorMessage || "登录已过期，请重新登录");
        router.push("/login");
    }
}

// 处理 token 错误
async function handleTokenError(error) {
    try {
        const result = await refreshTokenDebounce();
        if (result === "success") {
            // 使用新的 token 重试原请求
            // const newToken = getStore("accessToken");
            const newToken = authStore.accessToken;
            error.config.headers.accessToken = newToken;
            return service(error.config);
        }
    } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        handleUnauthorized();
    }
}

// 核心请求方法
const createRequest = (method) => (url, data = null, config = {}) => {
    const requestConfig = {
        method,
        url,
        ...getCommonConfig(config)
    };

    // 处理请求数据
    if (data) {
        if (method.toLowerCase() === 'get') {
            requestConfig.params = data;
        } else {
            requestConfig.data = config.transformRequest === false ? data : transformRequestData(data);

            if (config.transformRequest !== false) {
                requestConfig.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
        }
    }

    return service(requestConfig);
};

// 导出各种请求方法
export const getRequest = (url, params = {}, config = {}) =>
    createRequest('get')(url, params, config);

export const postRequest = (url, data = {}, config = {}) =>
    createRequest('post')(url, data, config);

export const putRequest = (url, data = {}, config = {}) =>
    createRequest('put')(url, data, config);

export const deleteRequest = (url, params = {}, config = {}) =>
    createRequest('delete')(url, params, config);

// 专用请求方法
export const postRequestWithNoForm = (url, data = {}) =>
    postRequest(url, data, {transformRequest: false});

export const putRequestWithNoForm = (url, data = {}) =>
    putRequest(url, data, {transformRequest: false});

export const importRequest = (url, data = {}) =>
    postRequest(url, data, {transformRequest: false});

export const uploadFileRequest = (url, formData) =>
    postRequest(url, formData, {
        transformRequest: false,
        headers: {'Content-Type': 'multipart/form-data'}
    });

// 无需 token 的请求
export const getRequestWithNoToken = (url, params = {}) =>
    getRequest(url, params, {needsToken: false});

export const postRequestWithNoToken = (url, data = {}) =>
    postRequest(url, data, {needsToken: false});

export const postRequestWithNoTokenData = (url, data = {}) =>
    postRequest(url, data, {
        needsToken: false,
        transformRequest: true
    });

// 导出 service 实例供特殊需求使用
export {service as axiosInstance};