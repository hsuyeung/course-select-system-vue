import {request} from "./request";
import {getCookie} from "common/cookie";
import {BASE_URL, METHOD_URL} from "config/network";

/**
 * 添加分类
 * @param data
 * @returns {AxiosPromise}
 */
export function addCategory(data) {
  return request({
    url: BASE_URL.ADMIN.CATEGORY + METHOD_URL.ADD,
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data
  })
}

/**
 * 分页获取分类数据
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getCategoryPage(currentPage, pageSize) {
  return request({
    url: BASE_URL.ADMIN.CATEGORY + METHOD_URL.GET_PAGE,
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
 * 更新分类信息
 * @param data
 * @returns {AxiosPromise}
 */
export function updateCategory(data) {
  return request({
    url: BASE_URL.ADMIN.CATEGORY + METHOD_URL.UPDATE,
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data
  })
}

