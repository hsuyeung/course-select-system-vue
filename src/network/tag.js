import {request} from "./request";
import {getCookie} from "../common/cookie";

/**
 * 添加标签
 * @param data
 * @returns {AxiosPromise}
 */
export function addTag(data) {
  return request({
    url:"/tag/add",
    method:'post',
    headers:{
      "token":getCookie('token')
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
export function getTagPage(currentPage,pageSize) {
  return request({
    url:"/tag/get/page",
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
 * 更新分类信息
 * @param data
 * @returns {AxiosPromise}
 */
export function updateTag(data) {
  return request({
    url:"/tag/update",
    method:'post',
    headers:{
      "token":getCookie('token')
    },
    data
  })
}

