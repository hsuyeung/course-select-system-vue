import {getCookie} from "./cookie";
import routerConfig from "config/router";
import router from "../router";

/**
 * 获取菜单
 */
export function getMenuAndRouter() {
  let roleStr = getCookie('role');
  let roleArr = roleStr.split(',');
  if (roleStr.includes('SUPER_ADMIN')){

  }else {

  }
  roleArr.forEach(value => {
    console.log(value)
  });
  return [
    {
      path: "/admin",
      name: "Admin",
      component: () => import("views/admin/Admin"),
      children: [
        routerConfig.ARTICLE_ADMIN_ADD,
        routerConfig.ARTICLE_ADMIN_EDIT,
        routerConfig.ARTICLE_ADMIN_DELETE
      ]
    }
  ]
}
