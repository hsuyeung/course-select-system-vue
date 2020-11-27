import {request} from "./request";
import {getCookie} from "common/cookie";
import {BASE_URL, METHOD_URL} from "../config/network";


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
      status: "0"
    }
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
      status: "0"
    }
  })
}

/**
 * 上传图片
 * @param formData
 * @returns {AxiosPromise}
 */
export function uploadImg(formData) {
  return request({
    url: BASE_URL.COMMON.FILE + METHOD_URL.ADD_IMG,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      "token": getCookie('token'),//传入token
    },
    data: formData
  })
}


/**
 * 发布文章
 * @param article
 * @returns {AxiosPromise}
 */
export function publishArticle(article) {
  return request({
    url:BASE_URL.ADMIN.ARTICLE+METHOD_URL.ADD,
    method: "post",
    headers:{
      "token":getCookie('token'),
    },
    data: article

  })
}


/**
 * 分页获取文章数据
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getArticlePage(currentPage, pageSize) {
  return request({
    url: BASE_URL.ADMIN.ARTICLE + METHOD_URL.GET_PAGE,
    headers: {
      "token": getCookie('token'),//传入token
    },
    params: {
      pageIndex: currentPage,//页码
      pageSize: pageSize,//每页的数据条数
    }
  })
}
