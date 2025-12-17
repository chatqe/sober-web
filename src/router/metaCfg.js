/**
 * router配置
 *
 * @author sjq
 * @since 2025-12-14 16:28
 */
const baseGradDir = 'to bottom'
const gradDir = 'to top'
export const routeMeta = {
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