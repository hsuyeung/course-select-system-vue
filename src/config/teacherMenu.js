export default {
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
      }
    }
  }
}
