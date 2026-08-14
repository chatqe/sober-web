import {defineStore} from 'pinia'
import {ref} from 'vue'

// 定义用户接口
interface User {
  id?: number;
  username?: string;
  email?: string;
  avatar?: string;
  nickname?: string;
  [key: string]: any;
}

// 定义管理员接口
interface Admin {
  id?: number;
  username?: string;
  email?: string;
  avatar: string;
  isBoss: boolean;
  [key: string]: any;
}

// 定义State接口
interface UserState {
  currentUser: User;
  currentAdmin: Admin;
}

export const useUserStore = defineStore<UserState>('user', () => {

        const currentUser = ref<User>({})
        const currentAdmin = ref<Admin>({
            avatar: '',
            isBoss: false,
        })

        const loadCurrentUser = (user: User): void => {
            currentUser.value = user
        }

        // 初始化当前登录用户
        const loadCurrentAdmin = (user: Admin): void => {
            currentAdmin.value = user
        }

        const clearUserData = (): void => {
            currentUser.value = {}
            currentAdmin.value = { avatar: '', isBoss: false }
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