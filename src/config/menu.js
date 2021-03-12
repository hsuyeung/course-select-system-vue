export default {
  // TODO：到时候直接在这里配置三种菜单，根据不同的登录展示不同的菜单即可
  SCHOOL: {
    main: {
      title: '学校管理',
      key: 'School',
      icon: 'home',
      childrenMenu: []
    },
    childrenMenu: {
      LIST: {
        title: '学校列表',
        key: 'SchoolList'
      }
    }
  },
  ACADEMY: {
    main: {
      title: '学院管理',
      key: 'academy',
      icon: 'control',
      childrenMenu: []
    },
    childrenMenu: {
      LIST: {
        title: '学院列表',
        key: 'AcademyList'
      }
    }
  },
  MAJOR: {
    main: {
      title: '专业管理',
      key: 'major',
      icon: 'tag',
      childrenMenu: []
    },
    childrenMenu: {
      LIST: {
        title: '专业列表',
        key: 'MajorList'
      }
    }
  },
  STUDENT: {
    main: {
      title: '学生管理',
      key: 'student',
      icon: 'book',
      childrenMenu: []
    },
    childrenMenu: {
      LIST: {
        title: '学生列表',
        key: 'StudentList'
      }
    }
  },
  TEACHER: {
    main : {
      title: '教师管理',
      key: 'teacher',
      icon: 'mail',
      childrenMenu: []
    },
    childrenMenu: {
      LIST: {
        title: '教师列表',
        key: 'TeacherList'
      }
    }
  },
  ARTICLE: {//文章菜单
    main: {
      title: '文章管理',
      key: 'Article',
      icon: 'snippets',
      childrenMenu: []
    },
    childrenMenu: {
      ADD: {
        title: '添加文章',
        key: 'AddArticle'
      },
      EDIT: {
        title: '文章列表',
        key: 'ArticleList'
      },
      DELETE: {
        title: '文章列表',
        key: 'ArticleList'
      }
    }


  },
  SWIPER: {//轮播菜单
    main: {
      title: '轮播管理',
      key: 'Swiper',
      icon: 'retweet',
      childrenMenu: []
    },
    childrenMenu: {
      ADD: {
        title: '轮播列表',
        key: 'SwiperList'
      },
      EDIT: {
        title: '轮播列表',
        key: 'SwiperList'
      },
      DELETE: {
        title: '轮播列表',
        key: 'SwiperList'
      }
    }
  },
  CATEGORY: {//分类
    main: {
      title: '分类管理',
      key: 'Category',
      icon: 'unordered-list',
      childrenMenu: []
    },
    childrenMenu: {
      ADD: {
        title: '分类列表',
        key: 'CategoryList'
      },
      EDIT: {
        title: '分类列表',
        key: 'CategoryList'
      },
      DELETE: {
        title: '分类列表',
        key: 'CategoryList'
      }
    }
  },
  TAG: {//标签
    main: {
      title: '标签管理',
      key: 'Tag',
      icon: 'unordered-list',
      childrenMenu: []
    },
    childrenMenu: {
      ADD: {
        title: '标签列表',
        key: 'TagList'
      },
      EDIT: {
        title: '标签列表',
        key: 'TagList'
      },
      DELETE: {
        title: '标签列表',
        key: 'TagList'
      }
    }
  },
  SUPER:{//超级管理员才显示的菜单
    main:{
      title:'系统管理',
      key:'System',
      icon:'setting',
      childrenMenu:[]
    },
    childrenMenu:{
      ADMIN:{
        title:'管理员管理',
        key:'Administrator'
      },
      ROLE: {
        title: '角色管理',
        key: 'Role'
      },
      AUTHORITY: {
        title: '权限管理',
        key: 'Authority'
      }
    }
  }


}
