/**
 * 网络请求相关配置
 * @type {{API_BASE_URL: string, TIMEOUT: number}}
 */
const network_config = {
  API_BASE_URL: "http://47.103.62.145:8848/api/v3/admin",//api接口根地址
  // API_BASE_URL: "http://whej7j.natappfree.cc/api/v3/admin",//api接口根地址
  TIMEOUT: 10000,//请求超时时间
}

export default network_config;
