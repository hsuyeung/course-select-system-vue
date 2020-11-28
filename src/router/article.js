export default [
  {
    path: "article/add",
    name: "AddArticle",
    component: () => import("views/admin/article/add/Add")
  },
  {
    path: "article/list",
    name: "ArticleList",
    component: () => import("views/admin/article/list/List"),
  },
  {
    path: "article/edit",
    name: "EditArticle",
    component: () => import("views/admin/article/edit/Edit"),
  }

]
