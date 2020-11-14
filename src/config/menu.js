export default {
  USER: {//用户菜单
    main: {
      title: "用户管理",//折叠菜单标题
      key: "User",
      icon: "user",//折叠菜单标题图标
      childrenMenu: []
    },
    childrenMenu: {

      ADD: {
        title: "用户列表",
        key: "UserList"
      },
      EDIT: {
        title: "用户列表",
        key: "UserList"
      },
      DELETE: {
        title: "用户列表",
        key: "UserList"
      }
    }

  },
  ARTICLE: {//文章菜单
    main: {
      title: "文章管理",
      key: "Article",
      icon: "snippets",
      childrenMenu: []
    },
    childrenMenu: {
      ADD: {
        title: "添加文章",
        key: "AddArticle"
      },
      EDIT: {
        title: "文章列表",
        key: "ArticleList"
      },
      DELETE: {
        title: "文章列表",
        key: "ArticleList"
      }
    }


  },
  SWIPER: {//轮播菜单
    main: {
      title: "轮播管理",
      key: "Swiper",
      icon: "retweet",
      childrenMenu: []
    },
    childrenMenu: {
      ADD: {
        title: "添加轮播",
        key: "AddSwiper"
      },
      EDIT: {
        title: "轮播列表",
        key: "SwiperList"
      },
      DELETE: {
        title: "轮播列表",
        key: "SwiperList"
      }
    }
  },
  SUPER:{
    main:{
      title:"系统管理",
      key:"System",
      icon:"setting",
      childrenMenu:[]
    },
    childrenMenu:{
      ADMIN:{
        title:"管理员管理",
        key:"Administrator"
      }
    }
  }


}
