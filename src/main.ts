import {createApp} from 'vue'
import pinia from './stores/index'
// import './style.css1'
import './assets/css/color.css'
import './assets/css/animation.css'
import './assets/css/index.css'
import 'element-plus/dist/index.css'
import '@/style/el-custom.scss'
import App from './App.vue'
import router from "./router/index"
import {commonUtils} from './utils/common'
import {APP_CONSTANTS} from './utils/constant'

const app = createApp(App)

// 注入全局属性 $common 和 $constant，供组件模板和 inject 使用
app.config.globalProperties.$common = commonUtils
app.config.globalProperties.$constant = APP_CONSTANTS
app.provide('$common', commonUtils)
app.provide('$constant', APP_CONSTANTS)

app.use(pinia)
    .use(router)
    .mount('#app')
