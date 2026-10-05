import type { AdminDanmakuPageReqDTO } from '../../types/modules/adminDanmakuPageReqDTO';
import type { PageResultAdminDanmakuVO } from '../../types/modules/pageResultAdminDanmakuVO';

import {getDanmaku} from '../generated/danmaku'
import request from '@/utils/request'

const _danmakuApi = getDanmaku()

export const danmakuApi = {
    list: () => _danmakuApi.list3(),
    latest: () => _danmakuApi.latestDanmaku(),
    save: (params: import('../../types/modules/danmaku').Danmaku) => _danmakuApi.save1(params),
    delete: (id: number) => _danmakuApi.del({id}),
    adminList: (params: AdminDanmakuPageReqDTO) =>
        request.post<PageResultAdminDanmakuVO>('/admin/danmaku/list', params, true)
            .then(res => res.data),
}
