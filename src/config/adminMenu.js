export default {
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
  SCORETYPE: {
      main: {
        title: '学分类型管理',
        key: 'scoreType',
        icon: 'number',
        childrenMenu: []
      },
      childrenMenu: {
        LIST: {
          title: '学分类型',
          key: 'ScoreTypeList'
        }
      }
  },
  COURSEMANAGE: {
    main: {
      title: '课程管理',
      key: 'CourseManage',
      icon: 'book',
      childrenMenu: []
    },
    childrenMenu: {
      COURSE: {
        title: '课程列表',
        key: 'Course'
      },
      COURSECATEGORY: {
        title: '课程分类列表',
        key: 'CourseCategory'
      }
    }
  },
  SYSTEM:{//超级管理员才显示的菜单
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
