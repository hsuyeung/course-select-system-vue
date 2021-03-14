import { request } from "./request";
import { getCookie } from "common/cookie";

/**
 * 分页查询教师列表
 */
export function getTeacherPage(currentPage, pageSize) {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/teacher/list/' + currentPage + '/' + pageSize,
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 查询所有的学院数据
 */
export function getAllAcademies() {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/academy/list',
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 添加一个教师
 */
export function addTeacher(teacher) {
  teacher.school = teacher.academy.school;
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/teacher/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: teacher
  });
}

/**
 * 更新教师信息
 */
 export function updateTeacher(teacher) {
  let loginType = getCookie('loginType');
  var url = 'http://localhost:9978/api/v1/system/secure/teacher/update';
  if (loginType === '1') {
    url = 'http://localhost:9978/api/v1/client/secure/teacher/update';
  }
  teacher.school = teacher.academy.school;
  return request({
    url: url,
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: teacher
  });
}
