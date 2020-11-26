import {request} from "./request";
import {getCookie} from "common/cookie";
import {BASE_URL, METHOD_URL} from "config/network";

/**
 * 添加标签
 * @param data
 * @returns {AxiosPromise}
 */
export function addTag(data) {
  return request({
    url: BASE_URL.ADMIN.TAG + METHOD_URL.ADD,
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data
  })
}

/**
 * 分页获取标签数据
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getTagPage(currentPage, pageSize) {
  return request({
    url: BASE_URL.ADMIN.TAG + METHOD_URL.GET_PAGE,
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
 * 更新标签信息
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTag(data) {
  return request({
    url: BASE_URL.ADMIN.TAG + METHOD_URL.UPDATE,
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data
  })
}

