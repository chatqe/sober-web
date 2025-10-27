/**
 * 配置文件
 * @type {{thirdParty: {amap: any, sentry: any}, features: {analytics: boolean, debug: boolean}, appName: any, api: {baseURL: any, uploadURL: any, prefix: (any|string), timeout: (number|number)}, version: any}}
 */
const config = {
    // 应用信息
    appName: import.meta.env.VITE_APP_NAME,
    version: import.meta.env.VITE_VERSION,

    // API 配置
    api: {
        baseURL: import.meta.env.VITE_API_URL,
        prefix: import.meta.env.VITE_API_PREFIX || '',
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 60000,
        uploadURL: import.meta.env.VITE_UPLOAD_URL,
    },

    // 功能开关
    features: {
        debug: import.meta.env.VITE_DEBUG === 'true',
        analytics: import.meta.env.VITE_ANALYTICS === 'true',
    },

    // 第三方服务
    thirdParty: {
        sentry: import.meta.env.VITE_SENTRY_DSN,
        amap: import.meta.env.VITE_AMAP_KEY,
    }
};

// 计算完整的 baseUrl
config.api.fullBaseURL = `${config.api.baseURL}${config.api.prefix}`;

export default config;