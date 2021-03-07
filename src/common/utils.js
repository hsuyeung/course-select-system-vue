import {getCookie} from "./cookie";
import menuConfig from "config/menu"

/**
 * 获取菜单
 */
export function getMenu() {
  let roleStr = getCookie('role');
  let roleArr = roleStr.split(',');
  let menuArr = [];
  if (1 == 1 || roleStr.includes('SUPER_ADMIN')) {
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

  } else {
    let childrenMenu = {};
    roleArr.forEach(value => {
      value = value.split('_');
      if (value[0] in childrenMenu) {
        if (!JSON.stringify(childrenMenu[value[0]]).includes(JSON.stringify(menuConfig[value[0]].childrenMenu[value[2]]))) {
          childrenMenu[value[0]].push(menuConfig[value[0]].childrenMenu[value[2]]);
        }

      } else {
        childrenMenu[value[0]] = [menuConfig[value[0]].childrenMenu[value[2]]];
      }
    })

    roleArr.forEach(value => {
      let end = value.indexOf('_');
      let key = value.substring(0, end);
      let menu = menuConfig[key].main;
      menu.childrenMenu = childrenMenu[key];
      menuArr.push(menu);
    })
    menuArr = new Set(menuArr);
  }
  return menuArr;
}



