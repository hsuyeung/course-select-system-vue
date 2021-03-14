import Vue from "vue";
import VueRouter from "vue-router";
import { checkCookie } from "../common/cookie";

//导入子路由
import systemRouter from "./system"; //系统相关
import schoolRouter from "./school"; //学校
import academyRouter from "./academy"; // 学院相关
import majorRouter from "./major"; // 专业相关
import studentRouter from "./student"; // 学生相关
import teacherRouter from "./teacher"; // 教师相关
import scoreTypeRouter from './scoreType';  // 学分类型相关
import courseRouter from './course'; // 课程相关

Vue.use(VueRouter);

const routes = [
  {
    path: "",
    redirect: "/login"
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
      ...schoolRouter,
      ...academyRouter,
      ...majorRouter,
      ...studentRouter,
      ...teacherRouter,
      ...scoreTypeRouter,
      ...courseRouter,
      ...systemRouter
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name == "Login") {
    next();
  } else {
    if (checkCookie("token")) {
      next();
    } else {
      router.replace({ name: "Login" });
    }
  }
});

export default router;
