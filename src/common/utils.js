import {getCookie} from "./cookie";
import adminMenuConfig from "config/adminMenu";
import studentMenuConfig from 'config/studentMenu';
import teacherMenuConfig from 'config/teacherMenu';

/**
 * 获取菜单
 */
export function getMenu() {
  let loginType = getCookie('loginType');
  let menuConfig;
  let menuArr = [];
  switch(loginType) {
    case '0': menuConfig = studentMenuConfig; break;
    case '1': menuConfig = teacherMenuConfig; break;
    case '2': menuConfig = adminMenuConfig; break;
  }
  Object.keys(menuConfig).forEach(key => {
    let main = menuConfig[key].main;
    let childrenMenu = menuConfig[key].childrenMenu;
    Object.keys(childrenMenu).forEach(key => {
      if (!JSON.stringify(main.childrenMenu).includes(JSON.stringify(childrenMenu[key]))) {
        main.childrenMenu.push(childrenMenu[key]);
      }
    })
    menuArr.push(main);
  })
  return menuArr;
}



