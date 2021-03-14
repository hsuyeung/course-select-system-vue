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

/**
 * 分页获取课程数据
 */
export function getCoursePage(currentPage, pageSize) {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/course/list/' + currentPage + '/' + pageSize,
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 获取所有的学院
 */
export function getAllAcademy() {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/academy/list',
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 获取所有教师
 */
export function getAllTeacher() {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/teacher/list',
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 获取所有学分类型
 */
 export function getAllScoreType() {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/scoreType/list',
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 获取所有课程分类
 */
 export function getAllCourseCategory() {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/courseCategory/list',
    headers: {
      'token': getCookie('token')
    }
  });
}

/**
 * 新增一门课程
 */
export function addCourse(course) {
  console.log(course)
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/course/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: course
  });
}

/**
 * 编辑课程信息
 */
 export function updateCourse(course) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/course/update',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: course
  });
}

/**
 * 选课
 */
export function selectCourse(studentId, courseId) {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/student/select/course',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    params: {
      studentId: studentId,
      courseIdsStr: courseId
    }
  });
}

/**
 * 退选
 */
 export function unselectCourse(studentId, courseId) {
  return request({
    url: 'http://localhost:9978/api/v1/client/secure/student/unselect/course',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    params: {
      studentId: studentId,
      courseIdsStr: courseId
    }
  });
}
