/**
 * 常量定义
 *
 * @author sjq
 * @since 2025-10-27 22:20
 */

export const API_CODES = {
    SUCCESS: 200,
    CLIENT_REDIRECT_LOGIN: 300,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
} as const;

export const TIMEOUT = {
    DEFAULT: 10000,
    UPLOAD: 60000,
} as const;

export const EmailBizType = {
    REGISTER: 'REGISTER',
    LOGIN: 'LOGIN',
    RESET_PWD: 'RESET_PWD',
} as const;

// 类型定义
export type ApiCode = typeof API_CODES[keyof typeof API_CODES];
export type TimeoutKey = keyof typeof TIMEOUT;
export type EmailBizTypeValue = typeof EmailBizType[keyof typeof EmailBizType];