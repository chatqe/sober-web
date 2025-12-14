import {createPinia} from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia().use(persist)

export default pinia

export { useSystemStore } from './modules/system'
export {useToolbarStore} from './modules/toolbar'
export {useAuthStore} from './modules/auth'
export {useSortInfoStore} from './modules/sortInfo'
export {useUserStore} from './modules/user'
export {useWebInfoStore} from './modules/webInfo'
export {useSysConfigStore} from './modules/sysConfig'
export {useFooterStore} from './modules/footer'