import {request} from "./request";
import {getCookie} from "common/cookie";

/**
 * 分页获取管理员信息
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
export function getAdministratorPage(currentPage, pageSize) {
  return request({
    url: "http://localhost:9978/api/v1/system/secure/admin/list/" + currentPage + "/" + pageSize,
    headers: {
      "token": getCookie('token')
    }
  })
}

/**
 * 获取所有的角色信息
 * @returns {AxiosPromise}
 */
export function getAllRoles() {
  return request({
    url: "http://localhost:9978/api/v1/system/secure/role/list",
    headers: {
      "token": getCookie('token')
    },
  })
}


/**
 * 更新管理员信息
 * @param id
 * @param data
 * @returns {AxiosPromise}
 */
export function updateAdmin(adminInfo) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/admin/update',
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data: adminInfo
  })
}

/**
 * 添加管理员
 * @param adminInfo
 * @returns {AxiosPromise}
 */
export function addAdmin(adminInfo) {
  console.log(adminInfo);

  return request({
    url: 'http://localhost:9978/api/v1/system/secure/admin/add',
    method: "post",
    headers: {
      "token": getCookie('token')
    },
    data: adminInfo
  })
}

/**
 * 分页获取角色信息
 * @param currentPage
 * @param pageSize
 * @returns {AxiosPromise}
 */
 export function getRolesPage(currentPage, pageSize) {
  return request({
    url: "http://localhost:9978/api/v1/system/secure/role/list/" + currentPage + "/" + pageSize,
    headers: {
      "token": getCookie('token')
    }
  })
}

/**
 * 添加角色
 * @param role 角色信息
 */
export function addRole(role) {
  console.log(role);
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/role/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: role
  });
}


/**
 * 更新角色信息
 * @param role 角色信息
 * @returns {AxiosPromise}
 */
 export function updateRole(role) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/role/update',
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data: role
  })
}

/**
 * 获取所有的权限信息
 * @returns {AxiosPromise}
 */
 export function getAllAuthority() {
  return request({
    url: "http://localhost:9978/api/v1/system/secure/authority/list",
    headers: {
      "token": getCookie('token')
    },
  })
}

/**
 * 分页获取权限列表
 */
export function getAuthoritiesPage(currentPage, pageSize) {
  return request({
    url: "http://localhost:9978/api/v1/system/secure/authority/list/" + currentPage + "/" + pageSize,
    headers: {
      "token": getCookie('token')
    }
  })
}

/**
 * 添加权限
 * @param authority 权限信息
 */
 export function addAuthority(authority) {
  console.log(authority);
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/authority/add',
    method: 'post',
    headers: {
      'token': getCookie('token')
    },
    data: authority
  });
}


/**
 * 更新权限信息
 * @param authority 权限信息
 * @returns {AxiosPromise}
 */
 export function updateAuthority(authority) {
  return request({
    url: 'http://localhost:9978/api/v1/system/secure/authority/update',
    method: 'post',
    headers: {
      "token": getCookie('token')
    },
    data: authority
  })
}
