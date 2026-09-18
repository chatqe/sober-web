import {getDanmaku} from '../generated/danmaku'
import request from '@/utils/request'

const _danmakuApi = getDanmaku()

export const danmakuApi = {
    list: () => _danmakuApi.list2(),
    latest: () => _danmakuApi.latestDanmaku(),
    save: (params: import('../../types/modules/danmaku').Danmaku) => _danmakuApi.save1(params),
    delete: (id: number) => _danmakuApi.del({id}),
    adminList: (params: import('../../types/modules/baseReqVO').BaseReqVO) =>
        request.post<any>('/admin/danmaku/boss/list', params, true),
}
