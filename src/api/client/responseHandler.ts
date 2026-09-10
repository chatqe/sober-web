import type { AxiosRequestConfig, AxiosError } from 'axios';
import { axiosInstance } from './axios';

/**
 * 自定义请求函数
 * 作为 orval 的 mutator 使用，统一处理 API 请求和响应
 *
 * @param config - Axios 请求配置对象
 * @returns 响应数据
 */
export const handleResponse = <T>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance.request(config).then(({ data }) => data as T);
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
