<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-button type="primary" @click="openAddPanel">添加课程</a-button>
      <a-button
        type="primary"
        style="margin-left: 10px"
        @click="() => this.getData()"
        >刷新数据</a-button
      >
    </div>

    <course-table
      :data="data"
      :courseFilters="courseFilters"
      :teacherFilters='teacherFilters'
      :scoreTypeFilters='scoreTypeFilters'
      :courseCategoryFilters='courseCategoryFilters'
      @actionClick="openEditPanel"
      :current-page="currentPage"
      :total-page="total"
      @change="handleTableChange"
      :loading="loading"
    />

    <!--    编辑课程的组件-->
    <edit-course
      :visible="editPanelVisible"
      @cancel="cancelEdit"
      :academies="academies"
      :teachers='teachers'
      :scoreTypes='scoreTypes'
      :courseCategories='courseCategories'
      :data="currentData"
      @success="saveSuccess"
    />
    <!--    添加课程的组件-->
    <add-course
      :visible="addPanelVisible"
      @cancel="cancelAdd"
      :academies="academies"
      :teachers='teachers'
      :scoreTypes='scoreTypes'
      @success="addSuccess"
    />
  </div>
</template>
<script>
import { getCoursePage, getAllAcademy, getAllTeacher, getAllScoreType, getAllCourseCategory } from "network/course"; //获取API数据和网络请求相关
import responseCode from "network/responseCode";
import EditCourse from "./components/EditCourse"; //编辑课程组件
import AddCourse from "./components/AddCourse"; //添加课程组件
import CourseTable from "./components/CourseTable"; //课程展示表格组件

export default {
  components: { CourseTable, AddCourse, EditCourse },
  data() {
    return {
      data: [], //课程数据
      total: 0, //数据总数
      loading: false, //是否加载
      currentPage: 1, //当前页
      pageSize: 10, //每页数据条数
      editPanelVisible: false, //编辑面板是否可见
      courseFilters: [], //学院过滤列表
      teacherFilters:[],  // 教师过滤列表
      scoreTypeFilters: [], // 学分类型过滤列表
      courseCategoryFilters: [], // 课程分类过滤列表
      currentData: {}, //当前操作的课程数据（添加或修改）
      academies: [], //所有学院信息
      teachers: [], // 所有教师信息
      scoreTypes: [], // 所有的学分类型信息
      courseCategories: [],  // 所有的课程分类信息
      addPanelVisible: false, //添加课程的弹窗是否可见
    };
  },
  mounted() {
    // 第一次加载获取数据
    this.getData();
    //获取所有学院数据
    this.getAcademies();
    // 获取所有教师数据
    this.getTeachers();
    // 获取所有学分类型数据
    this.getScoreTypes();
    // 获取所有课程分类数据
    this.getCourseCategories();
  },
  methods: {
    //保存成功
    saveSuccess() {
      this.getData();
      this.editPanelVisible = false;
    },
    //添加课程成功
    addSuccess() {
      this.getData();
      this.addPanelVisible = false;
    },
    // 取消修改
    cancelEdit() {
      this.editPanelVisible = false;
    },
    //打开添加课程的弹窗
    openAddPanel() {
      // 设置添加弹窗可见
      this.addPanelVisible = true;
    },
    //取消添加
    cancelAdd() {
      // 设置弹窗不可见
      this.addPanelVisible = false;
    },
    // 表格发生变化
    handleTableChange(currentPage) {
      this.currentPage = currentPage;
      this.getData();
    },
    //打开编辑弹窗
    openEditPanel(index) {
      this.currentData = JSON.parse(JSON.stringify(this.data[index]));
      this.editPanelVisible = true;
    },
    // 取消编辑课程信息
    editCancel() {
      this.editPanelVisible = false;
    },

    // 获取分页数据
    getData() {
      this.loading = true;
      //调用获取分页数据的方法，传入页码和数据条数
      getCoursePage(this.currentPage - 1, this.pageSize)
        .then((res) => {
          //判断code
          if (res.code === 20000) {
            //获取成功
            //设置数据
            this.data = res.data.content;
            // 设置分页的数据总条数
            this.total = res.data.totalElements;
          } else {
            responseCode(res.code, this);
          }
          this.loading = false;
        })
        .catch((err) => {
          responseCode(-1, this);
          this.loading = false;
        });
    },
    //获取所有的学院信息
    getAcademies() {
      getAllAcademy()
        .then((res) => {
          if (res.code === 20000) {
            res.data.forEach(academy => academy.academyName += '(' + academy.school.schoolName + ')');
            this.academies = res.data;
            res.data.forEach((value) => {
              this.courseFilters.push({
                text: value.courseName,
                value: value.courseName,
              });
            });
          } else {
            responseCode(res.code, this);
          }
        })
        .catch((err) => {
          responseCode(-1, this);
        });
    },
    // 获取所有的教师信息
    getTeachers() {
      getAllTeacher()
      .then((res) => {
          if (res.code === 20000) {
            this.teachers = res.data;
            res.data.forEach((value) => {
              this.courseFilters.push({
                text: value.teacherName,
                value: value.teacherName,
              });
            });
          } else {
            responseCode(res.code, this);
          }
        })
        .catch((err) => {
          responseCode(-1, this);
        });
    },
    // 获取所有的学分类型信息
    getScoreTypes() {
      getAllScoreType()
      .then((res) => {
          if (res.code === 20000) {
            this.scoreTypes = res.data;
            res.data.forEach((value) => {
              this.courseFilters.push({
                text: value.scoreTypeName,
                value: value.scoreTypeName,
              });
            });
          } else {
            responseCode(res.code, this);
          }
        })
        .catch((err) => {
          responseCode(-1, this);
        });
    },
    // 获取所有的课程分类信息
    getCourseCategories() {
      getAllCourseCategory()
      .then((res) => {
          if (res.code === 20000) {
            this.courseCategories = res.data;
            res.data.forEach((value) => {
              this.courseFilters.push({
                text: value.courseCategoryName,
                value: value.courseCategoryName,
              });
            });
          } else {
            responseCode(res.code, this);
          }
        })
        .catch((err) => {
          responseCode(-1, this);
        });
    }
  },
};
</script>

<style scoped>
</style>
