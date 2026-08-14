import {defineStore} from 'pinia'
import {ref} from 'vue'

// 定义网站信息接口
interface WebInfo {
  webName: string;
  webTitle: string[];
  notices: any[];
  randomCover: any[];
  footer: string;
  backgroundImage: string;
  avatar: string;
  [key: string]: any;
}

// 定义原始网站信息数据接口
interface WebInfoData {
  webName: string;
  webTitle?: string;
  notices?: string;
  randomCover?: string;
  footer: string;
  backgroundImage: string;
  avatar: string;
  [key: string]: any;
}

// 定义State接口
interface WebInfoState {
  webInfo: WebInfo;
}

export const useWebInfoStore = defineStore<WebInfoState>('webInfo', () => {

        const webInfo = ref<WebInfo>({
            webName: "",
            webTitle: [],
            notices: [],
            randomCover: [],
            footer: "",
            backgroundImage: "",
            avatar: ""
        })

        const loadWebInfo = (webInfoData: WebInfoData): void => {
            const processedWebInfo: WebInfo = {
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