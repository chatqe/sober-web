import {defineStore} from 'pinia'
import {ref} from 'vue'


export const useToolbarStore = defineStore('toolbar', () => {
        const toolbar = ref({visible: false, enter: true})

        const changeToolbarStatus = (toolbarState) => {
            toolbar.value = toolbarState
        }

        return {
            toolbar,
            changeToolbarStatus
        }
    },

    {
        persist: true
    })