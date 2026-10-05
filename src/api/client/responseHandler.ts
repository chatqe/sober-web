import axios from 'axios';
import type { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CODES } from '@/constant/index.js';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const baseURL = (import.meta as any).env.VITE_BASE_URL;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const webUrl = (import.meta as any).env.VITE_WEB_URL;

// 创建独立axios实例，避免循环依赖
const http = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true
});

// 自动注入认证头
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.adminToken) {
        config.headers.Authorization = authStore.adminToken;
    } else if (authStore.userToken) {
        config.headers.Authorization = authStore.userToken;
    }
    return config;
}, (error: AxiosError) => {
    return Promise.reject(error);
});

http.interceptors.response.use((resp) => {
    const { data } = resp;
    if (data && typeof data === 'object' && data.code === API_CODES.SUCCESS && data.hasOwnProperty('code')) {
        return resp;
    }
    const msg = data?.msg || `请求失败[${data?.code || 'unknown'}]`;
    if (data?.code === API_CODES.CLIENT_REDIRECT_LOGIN) {
        window.location.href = `${webUrl}/verify`;
    } else {
        console.error('[API Error]', msg);
        ElMessage.error(msg);
    }
    return Promise.reject(new Error(msg));
}, (error: AxiosError) => {
    let msg = '网络异常，请稍后重试';
    if (error.response) {
        const status = error.response.status;
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
 * 条件类型：从 R<T> 中提取 data 字段的实际类型。
 * 要求同时存在 code 和 data 才剥壳，防止误伤有 data 字段的业务类型。
 */
type UnwrapR<T> = T extends { code?: number; data?: infer U } ? NonNullable<U> : T

/**
 * Orval mutator
 * - 运行时：剥掉 R 信封，返回业务数据
 * - 类型上：UnwrapR<T> 把 R<T> 自动推导为 T
 */
export const handleResponse = <T>(config: AxiosRequestConfig): Promise<UnwrapR<T>> => {
    return http.request(config).then(({ data }) => {
        return (data as { code?: number; data?: UnwrapR<T> })?.data as UnwrapR<T>;
    });
};

/**
 * 错误类型导出
 * 供 orval 生成的代码使用
 */
export type ErrorType<Error> = AxiosError<Error>;

/**
 * 请求体类型导出
 * 供 orval 生成的代码使用
 */
export type BodyType<BodyData> = BodyData;

/**
 * API错误处理函数
 * 统一处理API错误，格式化错误信息
 * @param error - 错误对象
 */
export function handleError(error: unknown): never {
    if (error instanceof Error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
            const { status, data, config } = axiosError.response;
            console.error(`[API Error] ${status}`, {
                url: config?.url,
                method: config?.method,
                data,
            });
        } else if (axiosError.request) {
            console.error('[API Error] 无响应', {
                url: axiosError.config?.url,
                method: axiosError.config?.method,
            });
        } else {
            console.error('[API Error] 请求配置错误:', axiosError.message);
        }
    } else {
        console.error('[API Error] 未知错误:', error);
    }

    throw error;
}
