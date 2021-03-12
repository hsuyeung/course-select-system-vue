import { request } from "./request";
import { getCookie } from "common/cookie";

/**
 * 分页获取学院列表
 * @param currentPage 第几页
 * @param pageSize 每页多少条数据
 */
export function getAcademyPage(currentPage, pageSize) {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/academy/list/' + currentPage + '/' + pageSize,
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
    url: 'http://localhost:9978/api/v1/client/secure/school/list',
    headers: {
      token: getCookie('token')
    }
  });
}

/**
 * 添加一个学院
 */
export function addAcademy(academy) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/academy/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: academy
  });
}


/**
 * 更新学院
 */
export function updateAcademy(academy) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/academy/update',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: academy
  });
}
