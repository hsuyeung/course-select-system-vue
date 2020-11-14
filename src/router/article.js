export default [
  {
    path: "article/add",
    name: "AddArticle",
    component: () => import("views/admin/article/Add")
  },
  {
    path: "article/list",
    name: "ArticleList",
    component: () => import("views/admin/article/List"),

  }

]
