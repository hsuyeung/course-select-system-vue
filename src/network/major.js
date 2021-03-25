import { request } from "./request";
import { getCookie } from "common/cookie";

/**
 * 分页获取专业数据
 */
export function getMajorPage(currentPage, pageSize) {
  return request({
    url: 'http://121.43.168.195:9978/api/v1/client/secure/major/list/' + currentPage + '/' + pageSize,
    headers: {
      'token': getCookie('token')
    }
  });
}


/**
 * 获取所有的学院数据
 * 因为多个学校可能由多个学院，学院名字可能重名，所以需要在这里将学院名字后面拼上学校名字用于区分
 */
export function getAllAcademy() {
  return request({
    url: 'http://121.43.168.195:9978/api/v1/client/secure/academy/list',
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 添加专业
 * @param major 专业数据
 */
export function addMajor(major) {
  major.school = major.academy.school;
  return request({
    url: 'http://121.43.168.195:9978/api/v1/system/secure/major/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: major
  });
}

/**
 * 编辑专业
 * @param major 专业数据
 */
 export function updateMajor(major) {
  major.school = major.academy.school;
  return request({
    url: 'http://121.43.168.195:9978/api/v1/system/secure/major/update',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: major
  });
}
