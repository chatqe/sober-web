import {createApp} from 'vue'
import pinia from './stores/index'
import './style.css'
import './assets/css/color.css'
import './assets/css/index.css'
import './assets/css/animation.css'
import App from './App.vue'
import router from "./router/index"
// import { provide } from 'vue'

// 入口或公共父组件提供（可选，若已在 main.ts 挂到 globalProperties，则组件内可直接 inject）
import common from '@/utils/common'
import constant from '@/utils/constant'

const app =createApp(App)

app.provide('$common', common)
app.provide('$constant', constant)
app.use(pinia)
    .use(router)
    .mount('#app')
