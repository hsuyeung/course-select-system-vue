export default [
  {
    path: "sys/admin",
    name: "Administrator",
    component: () => import("views/admin/system/administrator/Administrator")
  },
  {
    path: 'sys/role',
    name: 'Role',
    component:  () => import('views/admin/system/role/Role')
  },
  {
    path: "sys/email",
    name: "Email",
    component: () => import("views/admin/system/email/Email")
  }
];



