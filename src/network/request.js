import axios from "axios";
import network_config from "config/network";

export function request(config) {
  //1.创建axios实例
  const instance = axios.create({
    baseURL: network_config.API_BASE_URL,
    timeout: network_config.TIMEOUT
  })

  //2.请求拦截器
  instance.interceptors.request.use(config => {
    return config
  }, err => {

  })

  //3.响应拦截器
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {

  })

  // 返回promise对象
  return instance(config)
}
