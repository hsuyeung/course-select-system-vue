export default [
  {
    path: "course/course",
    name: "Course",
    component: () => import("views/admin/course/course/Course")
  },
  {
    path: 'course/courseCategory',
    name: 'CourseCategory',
    component:  () => import('views/admin/course/courseCategory/CourseCategory')
  }
];
