import { request } from "./request";
import { getCookie } from "common/cookie";

/**
 * 登录
 * @param account 学号/工号/手机号/邮箱/用户名
 * @param password 密码
 * @param loginType 登录类型
 * @returns {AxiosPromise}
 */
export function login(account, password, loginType) {
  switch (loginType) {
    case "0":
    case "1":
      return request({
        url: "http://121.43.168.195:9978/api/v1/client/common/user/login",
        method: "post",
        data: {
          account: account,
          password: password,
          loginType: loginType
        }
      });
    case "2":
      return request({
        url: "http://121.43.168.195:9978/api/v1/system/common/admin/login",
        method: "post",
        data: {
          username: account,
          password: password
        }
      });
    default:
      break;
  }
}

/**
 * 退出登录
 * @returns {AxiosPromise}
 */
export function logout() {
  console.log(getCookie("loginType"));
  var url = "http://121.43.168.195:9978/api/v1/system/common/admin/logout";
  if (getCookie("loginType") !== '2') {
    url = "http://121.43.168.195:9978/api/v1/client/common/user/logout";
  }
  console.log(url)
  return request({
    url: url,
    method: "post",
    headers: {
      token: getCookie("token")
    }
  });
}
