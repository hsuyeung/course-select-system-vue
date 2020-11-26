export const API_URL = "http://47.103.62.145:8848";//API接口的域名


export const BASE_URL = {
  ADMIN: {//管理员相关
    MAIN: "/api/v3/admin",//MAIN表示BASE_URL的根url
    TAG: "/api/v3/admin/tag",
    CATEGORY: "/api/v3/admin/category",
    ADMIN: "/api/v3/admin/admin",
    ROLE: "/api/v3/admin/role",
    MAIL:"/api/v3/admin/mail"
  },
  COMMON: {//公共接口
    MAIN: "/api/v3",
    UPLOAD: "/api/v3/upload",
  },
  USER: {//用户相关
    MAIN: "/api/v3/user"
  }
};


export const METHOD_URL = {
  ADD: "/add",
  UPDATE: "/update",
  GET_PAGE: "/get/page",
  LOGIN: "/login",
  LOGOUT: "/logout",
  GET_ALL:"/get/all",
  SEND:"/send",
  IMG:"/img"
};



export default {
  TIMEOUT: 10000,//请求超时时间
}

