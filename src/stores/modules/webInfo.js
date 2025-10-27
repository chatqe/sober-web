import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useWebInfoStore = defineStore('webInfo', () => {

        const webInfo = ref({
            webName: "",
            webTitle: [],
            notices: [],
            randomCover: [],
            footer: "",
            backgroundImage: "",
            avatar: ""
        })

        const loadWebInfo = (webInfoData) => {
            const processedWebInfo = {
                ...webInfoData,
                webTitle: webInfoData.webTitle ? webInfoData.webTitle.split('') : [],
                notices: webInfoData.notices ? JSON.parse(webInfoData.notices) : [],
                randomCover: webInfoData.randomCover ? JSON.parse(webInfoData.randomCover) : []
            }
            webInfo.value = processedWebInfo
        }

        return {
            webInfo,
            loadWebInfo
        }
    },

    {
        persist: true
    })