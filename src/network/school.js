import { request } from "./request";
import { getCookie } from "common/cookie";

/**
 * 分页获取学校信息
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getSchoolsPage(currentPage, pageSize) {
  return request({
    url:
      "http://localhost:9978/api/v1/client/secure/school/list/" +
      currentPage +
      "/" +
      pageSize,
    headers: {
      token: getCookie("token")
    }
  });
}

/**
 * 添加学校
 * @param school 学校信息
 */
export function addSchool(school) {
  return request({
    url: "http://localhost:9978/api/v1/system/secure/school/add",
    method: 'post',
    headers: {
      token: getCookie("token")
    },
    data: school
  });
}

/**
 * 更新学校
 * @param school 学校信息
 */
export function updateSchool(school) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/school/update',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: school
  });
}
