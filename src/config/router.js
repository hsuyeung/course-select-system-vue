export default {
  ARTICLE_ADMIN_ADD: {
    path: "article/add",
    name: "AddArticle",
    component: () => import("views/admin/article/Add")
  },
  ARTICLE_ADMIN_EDIT:{
    path: "article/list",
    name: "ArticleList",
    component: () => import("views/admin/article/List"),
    meta:{

    }
  },
  ARTICLE_ADMIN_DELETE: {
    path: "article/list",
    name: "ArticleList",
    component: () => import("views/admin/article/List"),
    meta:{

    }
  },
}
