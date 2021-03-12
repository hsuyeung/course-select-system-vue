import { request } from "./request";
import { getCookie } from "common/cookie";


/**
 * 分页查询学生列表
 */
 export function getStudentPage(currentPage, pageSize) {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/student/list/' + currentPage + '/' + pageSize,
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 查询所有的专业列表
 */
export function getAllMajors() {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/major/list',
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 添加学生
 */
export function addStudent(student) {
  student.academy = student.major.academy;
  student.school = student.major.school;
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/student/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: student
  });
}

/**
 * 添加学生
 */
 export function updateStudent(student) {
  student.academy = student.major.academy;
  student.school = student.major.school;
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/student/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: student
  });
}
