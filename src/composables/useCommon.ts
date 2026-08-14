/**
 * useCommon 组合式函数
 * 封装通用工具函数，替代全局 app.provide('$common', ...)
 *
 * @author Joy
 * @since 2025-12-25
 */

import {commonUtils, type CommonUtils} from '@/utils/common'

/**
 * 获取全局 common 工具实例
 *
 * 用法:
 *   const { isEmpty, encrypt, getDateDiff } = useCommon()
 */
export function useCommon(): CommonUtils {
  return commonUtils
}
