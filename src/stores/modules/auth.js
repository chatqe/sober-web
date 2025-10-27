/**
 *  认证相关
 */
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useAuthStore = defineStore('authorization', () => {
    // 状态定义
    const userToken = ref('');
    const adminToken = ref('');

    // 设置用户令牌
    const setUserToken = (token) => {
        userToken.value = token;
    };

    // 设置管理员令牌
    const setAdminToken = (token) => {
        adminToken.value = token;
    };

    // 同时设置两种令牌
    const setTokens = (user, admin) => {
        userToken.value = user;
        adminToken.value = admin;
    };

    // 清除用户令牌
    const clearUserToken = () => {
        userToken.value = '';
    };

    // 清除管理员令牌
    const clearAdminToken = () => {
        adminToken.value = '';
    };

    // 清除所有令牌
    const clearAllTokens = () => {
        userToken.value = '';
        adminToken.value = '';
    };

    // 检查是否有用户令牌
    const hasUserToken = () => {
        return !!userToken.value;
    };

    // 检查是否有管理员令牌
    const hasAdminToken = () => {
        return !!adminToken.value;
    };

    return {
        userToken,
        adminToken,
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