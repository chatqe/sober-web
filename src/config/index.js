// 配置文件
const config = {
    development: {
        API_BASE: 'http://localhost:8080/api',
        UPLOAD_URL: 'http://localhost:8080/upload',
        WEBSOCKET_URL: 'ws://localhost:8080/ws',
        DEBUG: true
    },
    production: {
        API_BASE: 'https://api.mysite.com/api',
        UPLOAD_URL: 'https://api.mysite.com/upload',
        WEBSOCKET_URL: 'wss://api.mysite.com/ws',
        DEBUG: false
    }
};
//
// const env = process.env.NODE_ENV || 'development';
// export default config[env];

export default  config;