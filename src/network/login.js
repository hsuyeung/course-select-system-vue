import {request} from "./request";
import {getCookie} from "common/cookie";

/**
 * 登录
 * @returns {AxiosPromise}
 */
export function login(name, password) {
  return request({
    url: "/login",
    method: "post",
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    transformRequest: [function (data, headers) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    data: {
      username: name,
      loginPass: password
    }
  })
}

/**
 * 退出登录
 * @returns {AxiosPromise}
 */
export function logout() {
  return request({
    url: "/logout",
    method: "post",
    headers: {
      "token":getCookie('token')
    }
  })
}
