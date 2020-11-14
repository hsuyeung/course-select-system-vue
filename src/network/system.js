import {request} from "./request";
import {getCookie} from "../common/cookie";

/**
 * 分页获取管理员信息
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getAdministratorPage(currentPage,pageSize) {
  return request({
    url:"/admin/page/all",
    headers:{
      "token":getCookie('token'),//传入token
    },
    params:{
      pageIndex:currentPage,//页码
      pageSize:pageSize,//每页的数据条数
    }
  })
}

/**
 * 获取所有的角色信息
 * @returns {AxiosPromise}
 */
export function getAllRoles() {
  return request({
    url: '/role/all',
    headers:{
      "token":getCookie('token'),//传入token
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
    url:"/admin/update",
    method:'post',
    headers:{
      "token":getCookie('token')
    },
    data:adminInfo
  })
}


export function addAdmin(adminInfo) {
  return request({
    url:"/admin/add",
    method:"post",
    headers:{
      "token":getCookie('token')
    },
    data: adminInfo

  })
}
