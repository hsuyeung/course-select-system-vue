import {request} from "./request";
import {getCookie} from "common/cookie";


/**
 * 分页获取分类数据
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getCategoryPage(currentPage,pageSize) {
  return request({
    url:"/category/page",
    headers:{
      "token":getCookie('token'),//传入token
    },
    params:{
      pageIndex:currentPage,//页码
      pageSize:pageSize,//每页的数据条数
      status:"0"
    }
  })
}

