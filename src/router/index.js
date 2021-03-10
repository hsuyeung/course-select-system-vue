import Vue from 'vue'
import VueRouter from 'vue-router'
import {checkCookie} from "../common/cookie";

//导入子路由
import systemRouter from "./system";//系统相关
import schoolRouter from "./school";//学校
import articleRouter from "./article";//文章相关
import categoryRouter from "./category";//分类
import tagRouter from './tag'//标签
import swiperRouter from './swiper'//轮播

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
      ...articleRouter
      ,
      ...schoolRouter
      ,
      ...systemRouter
      ,
      ...categoryRouter
      ,
      ...tagRouter
      ,
      ...swiperRouter
    ]
  },
];

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
