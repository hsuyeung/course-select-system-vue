import {request} from "./request";

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
