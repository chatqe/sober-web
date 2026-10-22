import type { AdminDanmakuPageReqDTO } from '../../types/modules/adminDanmakuPageReqDTO';
import type { PageResultAdminDanmakuVO } from '../../types/modules/pageResultAdminDanmakuVO';

import {getDanmaku} from '../generated/danmaku'
import request from '@/utils/request'

const _danmakuApi = getDanmaku()

export const danmakuApi = {
    // 方法名取自 generated/danmaku.ts 实际导出（Orval 重新生成后数字后缀会漂移）
    list: () => _danmakuApi.list5(),
    latest: () => _danmakuApi.latestDanmaku(),
    save: (params: import('../../types/modules/danmaku').Danmaku) => _danmakuApi.save2(params),
    delete: (id: number) => _danmakuApi.del({id}),
    adminList: (params: AdminDanmakuPageReqDTO) =>
        request.post<PageResultAdminDanmakuVO>('/admin/danmaku/list', params, true)
            .then(res => res.data),
}
