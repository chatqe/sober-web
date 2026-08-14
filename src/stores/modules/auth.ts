/**
 *  认证相关
 */
import {defineStore} from 'pinia'
import {ref} from 'vue'

// 定义State接口
interface AuthState {
  userToken: string;
  adminToken: string;
  isAdmin: boolean;
}

export const useAuthStore = defineStore<AuthState>('authorization', () => {
    // 状态定义
    const userToken = ref<string>('');
    const adminToken = ref<string>('');
    const isAdmin = ref<boolean>(false);
    // 设置用户令牌
    const setUserToken = (token: string) => {
        userToken.value = token;
    };

    // 设置管理员令牌
    const setAdminToken = (token: string) => {
        adminToken.value = token;
    };

    const setIsAdmin = (value: boolean) => {
        isAdmin.value = value;
    };

    // 同时设置两种令牌
    const setTokens = (user: string, admin: string) => {
        userToken.value = user;
        adminToken.value = admin;
    };

    // 清除用户令牌
    const clearUserToken = (): void => {
        userToken.value = '';
    };

    // 清除管理员令牌
    const clearAdminToken = (): void => {
        adminToken.value = '';
    };

    // 清除所有令牌
    const clearAllTokens = (): void => {
        userToken.value = '';
        adminToken.value = '';
    };

    // 检查是否有用户令牌
    const hasUserToken = (): boolean => {
        return !!userToken.value;
    };

    // 检查是否有管理员令牌
    const hasAdminToken = (): boolean => {
        return !!adminToken.value;
    };

    return {
        userToken,
        adminToken,
        isAdmin,
        setIsAdmin,
        setUserToken,
        setAdminToken,
        setTokens,
        clearUserToken,
        clearAdminToken,
        clearAllTokens,
        hasUserToken,
        hasAdminToken
    };
}, {
    // 持久化配置
    persist: true
});