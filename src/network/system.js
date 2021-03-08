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
    url: "http://localhost:9978/api/v1/system/secure/admin/list/" + currentPage + "/" + pageSize,
    headers: {
      "token": getCookie('token'),//传入token
    }
  })
}

/**
 * 获取所有的角色信息
 * @returns {AxiosPromise}
 */
export function getAllRoles() {
  return request({
    url: "http://localhost:9978/api/v1/system/secure/role/list/",
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
    url: 'http://localhost:9978/api/v1/system/secure/admin/update',
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
  console.log(adminInfo);

  return request({
    url: 'http://localhost:9978/api/v1/system/secure/admin/add',
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
