import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useUserStore = defineStore('user', () => {

        const currentUser = ref( {})
        const currentAdmin = ref( {})

        const loadCurrentUser = (user) => {
            currentUser.value = user
        }

        // 初始化当前登录用户
        const loadCurrentAdmin = (user) => {
            currentAdmin.value = user
        }

        const clearUserData = () => {
            currentUser.value = {}
            currentAdmin.value = {}
        }



        return {
            currentUser,
            currentAdmin,
            loadCurrentUser,
            loadCurrentAdmin,
            clearUserData,
        }
    },

    {
        persist: true // 持久化
    })