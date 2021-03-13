import { request } from "./request";
import { getCookie } from "common/cookie";

/**
 * 分页获取课程分类数据
 */
export function getCourseCategoriesPage(currentPage, pageSize) {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/courseCategory/list/' + currentPage + '/' + pageSize,
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 新增一个课程分类
 */
export function addCourseCategory(courseCategory) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/courseCategory/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: courseCategory
  });
}

/**
 * 更新课程分类信息
 */
 export function updateCourseCategory(courseCategory) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/courseCategory/update',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: courseCategory
  });
}
