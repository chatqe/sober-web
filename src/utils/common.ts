/**
 * 通用工具函数
 *
 * @author Joy
 * @since 2025-12-25
 */

import CryptoJS from 'crypto-js'
import {APP_CONSTANTS} from './constant'

export interface CommonUtils {
  /** 检测是否为移动端 */
  mobile(): boolean

  /** 判断值是否为空（undefined / null / 空字符串 / 空数组 / 空对象） */
  isEmpty(value: unknown): boolean

  /** AES-ECB 加密 */
  encrypt(plainText: string): string

  /** AES-ECB 解密 */
  decrypt(encryptedBase64Str: string): string

  /** 表情包标签转为 <img> 标签 */
  faceReg(content: string): string

  /** 图片标签转为 <img> 标签 */
  pictureReg(content: string): string

  /** 图片点击放大（通过 DOM 选择器绑定点击事件） */
  imgShow(selector: string): void

  /** 字符串转时间戳（毫秒） */
  getDateTimeStamp(dateStr: string): number

  /** 相对时间字符串（"X秒前"/"X小时前"/"X天前"/"YYYY-M-D HH:mm"） */
  getDateDiff(dateStr: string): string | undefined

  /** 倒计时（返回天/时/分/秒） */
  countdown(targetTime: string): { d: number; h: number; m: number; s: number }
}

/** AES-ECB 加密 */
function encrypt(plainText: string): string {
  const options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }
  const key = CryptoJS.enc.Utf8.parse(APP_CONSTANTS.cryptojs_key)
  const encryptedData = CryptoJS.AES.encrypt(plainText, key, options)
  return encryptedData.toString().replace(/\//g, '_').replace(/\+/g, '-')
}

/** AES-ECB 解密 */
function decrypt(encryptedBase64Str: string): string {
  const val = encryptedBase64Str.replace(/-/g, '+').replace(/_/g, '/')
  const options = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }
  const key = CryptoJS.enc.Utf8.parse(APP_CONSTANTS.cryptojs_key)
  const decryptedData = CryptoJS.AES.decrypt(val, key, options)
  return CryptoJS.enc.Utf8.stringify(decryptedData)
}

/** 表情包标签转为 <img> 标签 */
function faceReg(content: string): string {
  return content.replace(/\[[^\[\]]+\]/g, (word) => {
    const emojiName = word.replace('[', '').replace(']', '')
    const index = APP_CONSTANTS.emojiList.indexOf(emojiName)
    if (index > -1) {
      const url = APP_CONSTANTS.fileEmojiUrl + 'emoji/q' + (index + 1) + '.gif'
      return `<img style="vertical-align: middle;width: 32px;height: 32px" src="${url}" title="${word}"/>`
    }
    return word
  })
}

/** 图片标签转为 <img> 标签 */
function pictureReg(content: string): string {
  return content.replace(/\[[^\[\]]+\]/g, (word) => {
    const index = word.indexOf(',')
    if (index > -1) {
      const arr = word.replace('[', '').replace(']', '').split(',')
      return `<img class="pictureReg" style="border-radius: 5px;width: 100%;max-width: 250px;display: block" src="${arr[1]}" title="${arr[0]}"/>`
    }
    return word
  })
}

/** 图片点击放大 */
function imgShow(selector: string): void {
  const imgElements = document.querySelectorAll<HTMLImageElement>(selector)
  imgElements.forEach((img) => {
    img.addEventListener('click', function () {
      const src = this.getAttribute('src')
      if (!src) return
      const bigImg = document.getElementById('bigImg')
      const outerImg = document.getElementById('outerImg')
      const innerImg = document.getElementById('innerImg')

      if (!bigImg || !outerImg || !innerImg) {
        console.warn('Image viewer elements not found in DOM')
        return
      }

      bigImg.setAttribute('src', src)

      const tempImg = new Image()
      tempImg.onload = function () {
        const windowW = window.innerWidth
        const windowH = window.innerHeight
        const realWidth = this.width
        const realHeight = this.height
        let imgWidth: number
        let imgHeight: number
        const scale = 0.8

        if (realHeight > windowH * scale) {
          imgHeight = windowH * scale
          imgWidth = (imgHeight / realHeight) * realWidth
          if (imgWidth > windowW * scale) {
            imgWidth = windowW * scale
          }
        } else if (realWidth > windowW * scale) {
          imgWidth = windowW * scale
          imgHeight = (imgWidth / realWidth) * realHeight
        } else {
          imgWidth = realWidth
          imgHeight = realHeight
        }

        bigImg.style.width = imgWidth + 'px'
        const w = (windowW - imgWidth) / 2
        const h = (windowH - imgHeight) / 2
        innerImg.style.top = h + 'px'
        innerImg.style.left = w + 'px'
        outerImg.style.display = 'block'
      }
      tempImg.src = src
    })
  })

  const outerImg = document.getElementById('outerImg')
  if (outerImg) {
    outerImg.addEventListener('click', function () {
      this.style.display = 'none'
    })
  }
}

/** 字符串转时间戳（毫秒） */
function getDateTimeStamp(dateStr: string): number {
  return Date.parse(dateStr.replace(/-/gi, '/'))
}

/** 相对时间字符串 */
function getDateDiff(dateStr: string): string | undefined {
  const publishTime =
    isNaN(Date.parse(dateStr.replace(/-/gi, '/')) / 1000)
      ? Date.parse(dateStr) / 1000
      : Date.parse(dateStr.replace(/-/gi, '/')) / 1000

  const pad = (n: number) => (n < 10 ? '0' + n : String(n))

  const timeNow = Math.floor(Date.now() / 1000)
  const d = timeNow - publishTime
  const dDays = Math.floor(d / 86400)
  const dHours = Math.floor(d / 3600)
  const dMinutes = Math.floor(d / 60)
  const dSeconds = d

  if (dDays > 0 && dDays < 3) return dDays + '天前'
  if (dDays <= 0 && dHours > 0) return dHours + '小时前'
  if (dHours <= 0 && dMinutes > 0) return dMinutes + '分钟前'

  if (dSeconds < 60) {
    if (dSeconds <= 0) return '刚刚发表'
    return dSeconds + '秒前'
  }

  if (dDays >= 3) {
    const date = new Date(publishTime * 1000)
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  return undefined
}

/** 倒计时 */
function countdown(targetTime: string): { d: number; h: number; m: number; s: number } {
  const time = new Date(targetTime.replace(new RegExp('-', 'gm'), '/'))
  const nowTime = new Date()
  const seconds = Math.floor((time.getTime() - nowTime.getTime()) / 1000)
  return {
    d: Math.floor(seconds / 3600 / 24),
    h: Math.floor(seconds / 3600) % 24,
    m: Math.floor(seconds / 60) % 60,
    s: seconds % 60,
  }
}

/** 判断值是否为空 */
function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string' && value.trim() === '') return true
  if (Array.isArray(value) && value.length === 0) return true
  if (typeof value === 'object' && Object.keys(value).length === 0) return true
  return false
}

/** 检测移动端 */
function mobile(): boolean {
  const flag = navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  )
  return !!(flag && flag.length && flag.length > 0)
}

/** 工具函数集合（导出为对象，兼容旧版 inject('$common') 调用方式） */
export const commonUtils: CommonUtils = {
  mobile,
  isEmpty,
  encrypt,
  decrypt,
  faceReg,
  pictureReg,
  imgShow,
  getDateTimeStamp,
  getDateDiff,
  countdown,
}
