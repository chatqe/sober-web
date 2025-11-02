import request from '@/utils/request';

/**
 * 保存友情链接
 * @param {Object} friend - 友情链接信息
 * @returns {Promise}
 */
export function saveFriend(friend) {
  return request.post('/webInfo/saveFriend', friend);
}

/**
 * 获取友情链接列表
 * @returns {Promise}
 */
export function listFriend() {
  return request.get('/webInfo/listFriend');
}

/**
 * 获取网站信息
 * @returns {Promise}
 */
export function getWebInfo() {
  return request.get('/webInfo/getWebInfo');
}

/**
 * 获取分类信息
 * @returns {Promise}
 */
export function getSortInfo() {
  return request.get('/webInfo/getSortInfo');
}