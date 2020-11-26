import {request} from "./request";
import {getCookie} from "common/cookie";
import {BASE_URL, METHOD_URL} from "config/network";

/**
 * 分页获取管理员信息
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getAdministratorPage(currentPage, pageSize) {
  return request({
    url: BASE_URL.ADMIN.ADMIN + METHOD_URL.GET_PAGE,
    headers: {
      "token": getCookie('token'),//传入token
    },
    params: {
      pageIndex: currentPage,//页码
      pageSize: pageSize,//每页的数据条数
    }
  })
}

/**
 * 获取所有的角色信息
 * @returns {AxiosPromise}
 */
export function getAllRoles() {
  return request({
    url: BASE_URL.ADMIN.ROLE + METHOD_URL.GET_ALL,
    headers: {
      "token": getCookie('token'),//传入token
    },
  })
}


/**
 * 更新管理员信息
 * @param id
 * @param data
 * @returns {AxiosPromise}
 */
export function updateAdmin(adminInfo) {
  return request({
    url: BASE_URL.ADMIN.ADMIN + METHOD_URL.UPDATE,
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data: adminInfo
  })
}

/**
 * 添加管理员
 * @param adminInfo
 * @returns {AxiosPromise}
 */
export function addAdmin(adminInfo) {
  return request({
    url: BASE_URL.ADMIN.ADMIN + METHOD_URL.ADD,
    method: "post",
    headers: {
      "token": getCookie('token')
    },
    data: adminInfo

  })
}

/**
 * 发送邮件
 * @param formData
 * @returns {AxiosPromise}
 */
export function sendEmail(formData) {
  return request({
    url: BASE_URL.ADMIN.MAIL + METHOD_URL.SEND,
    method: "post",
    headers: {
      'Content-Type': 'multipart/form-data',
      'token': getCookie('token')
    },
    data: formData
  })
}
