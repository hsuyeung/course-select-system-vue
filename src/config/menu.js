export default {
  user: {
    title: "用户管理",//折叠菜单标题
    key: "User",
    icon: "user",//折叠菜单标题图标
    childrenMenu: [
      {
        title: "添加用户",
        key: "AddUser"
      },
      {
        title: "用户列表",
        key: "UserList"
      }
    ]
  },
  article: {
    title: "文章管理",
    key: "Article",
    icon: "snippets",
    childrenMenu: [
      {
        title: "添加文章",
        key: "AddArticle"
      },
      {
        title: "文章列表",
        key: "ArticleList"
      }

    ]
  },
  swiper:{
    title: "轮播管理",
    key: "Swiper",
    icon: "retweet",
    childrenMenu: [
      {
        title: "添加轮播",
        key: "AddSwiper"
      },
      {
        title: "轮播列表",
        key: "SwiperList"
      }
    ]
  }
}
