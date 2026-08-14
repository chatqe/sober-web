/**
 * router配置
 *
 * @author sjq
 * @since 2025-12-14 16:28
 */

// 定义渐变方向类型
type GradDir = 'to top' | 'to bottom'

// 定义路由元信息接口
interface RouteMetaConfig {
  gradDir?: GradDir
  visible?: boolean
}

// 定义路由元信息映射接口
interface RouteMetaMap {
  [key: string]: RouteMetaConfig
}

const baseGradDir: GradDir = 'to bottom'
const gradDir: GradDir = 'to top'

export const routeMeta: RouteMetaMap = {
    index: {
        gradDir: baseGradDir, // footer 渐变方向
    },
    weiYan: {
        gradDir,
    },
    travel: {
        gradDir,
    },
    sort: {
        // gradDir: baseGradDir,
        gradDir,
    },
    love: {
        gradDir: baseGradDir,
    },
    favorite: {
        gradDir,
    },
    article: {
        gradDir,
    },
    message: {
        gradDir,
    },
    user: {
        visible: false,
    }
}