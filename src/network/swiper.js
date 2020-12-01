import {request} from "./request";
import {getCookie} from "common/cookie";
import {BASE_URL, METHOD_URL} from "config/network";


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
      status: "0"
    }
  })
}


/**
 * 添加轮播
 * @param data
 * @returns {AxiosPromise}
 */
export function addSwiper(data) {
  return request({
    url: BASE_URL.ADMIN.SWIPER + METHOD_URL.ADD,
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data
  })
}

/**
 * 分页获取轮播数据
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getSwiperPage(currentPage, pageSize) {
  return request({
    url: BASE_URL.ADMIN.SWIPER + METHOD_URL.GET_PAGE,
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
 * 更新轮播信息
 * @param data
 * @returns {AxiosPromise}
 */
export function updateSwiper(data) {
  return request({
    url: BASE_URL.ADMIN.SWIPER + METHOD_URL.UPDATE,
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data
  })
}


/**
 * 删除单个轮播
 * @param id
 * @returns {AxiosPromise}
 */
export function deleteSwiper(id) {
  return request({
    url: BASE_URL.ADMIN.SWIPER + METHOD_URL.DELETE+"/"+id,
    method: 'delete',
    headers: {
      "token": getCookie('token')
    }
  })
}


