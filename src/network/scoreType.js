import { request } from "./request";
import { getCookie } from "common/cookie";

/**
 * 分页获取学分类型数据
 */
export function getScoreTypePage(currentPage, pageSize) {
  return request({
    url: 'http://121.43.168.195:9978/api/v1/client/secure/scoreType/list/' + currentPage + '/' + pageSize,
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 获取所有的学校
 */
 export function getAllSchool() {
  return request({
    url: 'http://121.43.168.195:9978/api/v1/client/secure/school/list',
    headers: {
      token: getCookie('token')
    }
  });
}

/**
 * 新增一个学分类型
 */
export function addScoreType(scoreType) {
  return request({
    url: 'http://121.43.168.195:9978/api/v1/system/secure/scoreType/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: scoreType
  });
}

/**
 * 更新学分类型
 */
 export function updateScoreType(scoreType) {
  return request({
    url: 'http://121.43.168.195:9978/api/v1/system/secure/scoreType/update',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: scoreType
  });
}
