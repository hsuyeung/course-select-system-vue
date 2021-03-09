export const API_URL = "http://127.0.0.1:9978/api/v1";

// export const BASE_URL1 =

export const BASE_URL = {
  // 管理员相关
  ADMIN: {
    MAIN: "/api/v3/admin",//MAIN表示BASE_URL的根url
    TAG: "/api/v3/admin/tag",
    ARTICLE: "/api/v3/admin/article",
    CATEGORY: "/api/v3/admin/category",
    ADMIN: "/api/v3/admin/admin",
    ROLE: "/api/v3/admin/role",
    MAIL: "/api/v3/admin/mail",
    SWIPER: "/api/v3/admin/swiper"
  },
  COMMON: {//公共接口
    MAIN: "/api/v3",
    FILE: "/api/v3/file"
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
  GET_ALL: "/get/all",
  SEND: "/send",
  ADD_IMG: "/add/img",
  BATCH_DELETE: "/delete/batchDelete",
  DELETE: "/delete"
};


export default {
  TIMEOUT: 30 * 1000,//请求超时时间
}
