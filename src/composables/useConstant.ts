/**
 * useConstant 组合式函数
 * 封装应用常量，替代全局 app.provide('$constant', ...)
 *
 * @author Joy
 * @since 2025-12-25
 */

import {APP_CONSTANTS} from '@/utils/constant'

/** 类型安全的常量类型（去掉内部结构，扁平导出） */
type AppConstant = typeof APP_CONSTANTS

/**
 * 获取全局常量
 *
 * 用法:
 *   const { beforeColor1, emojiList, baseURL } = useConstant()
 *
 * 模板中也可使用:
 *   :before="$constant.beforeColor1"  →  :before="useConstant().beforeColor1"
 */
export function useConstant(): AppConstant {
  return APP_CONSTANTS
}
