import Vue from 'vue'
import VueRouter from 'vue-router'
import {checkCookie} from "../common/cookie";
import store from '../store'

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: '/login'
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("views/login/Login")
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("views/admin/Admin"),
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("views/admin/home/Home")
      },

    ]
  },
  {
    path: "/admin",
    name: "Admin",
    component: () => import("views/admin/Admin"),
    children: [
      {
        path: "/admin/article/add",
        name: "AddArticle",
        component: () => import("views/admin/article/Add")
      },
      {
        path: "article/list",
        name: "ArticleList",
        component: () => import("views/admin/article/List"),

      },
      {
        path: "user/list",
        name: "UserList",
        component: () => import("views/admin/user/List"),
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.name == 'Login') {
    next()
  } else {
    if (checkCookie('token')) {
      next();
    } else {
      router.replace({name: "Login"})
    }
  }

});

export default router
