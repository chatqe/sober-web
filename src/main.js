import {createApp} from 'vue'
import pinia from './stores/index'
import './style.css'
import App from './App.vue'
import router from "./router/index"

createApp(App).use(pinia)
    .use(router)
    .mount('#app')
