/**
 * 设置cookie
 * @param key
 * @param value
 * @param time（cookie的有效时间，默认2小时）
 */
export function setCookie(key, value, time = 2) {
  let d = new Date();
  d.setTime(d.getTime() + (time * 60 * 60 * 1000));
  let expires = "expires=" + d.toGMTString();
  document.cookie = key + "=" + value + "; " + expires;
}

/**
 * 获取cookie
 * @param key
 * @returns {string}
 */
export function getCookie(key) {
  let name = key + "=";
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

/**
 * 检测cookie
 * @param key
 * @returns {boolean}
 */
export function checkCookie(key) {
  let value = getCookie(key);
  if (value != "") {
    return true;
  } else {
    return false;
  }
}
