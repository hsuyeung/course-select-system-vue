<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-button v-if="isAdmin()" type="primary" @click="openAddPanel">添加学生</a-button>
      <a-button
        type="primary"
        style="margin-left: 10px"
        @click="() => this.getData()"
        >刷新数据</a-button
      >
    </div>

    <student-table
      :data="data"
      :majorFilters="majorFilters"
      @actionClick="openEditPanel"
      :current-page="currentPage"
      :total-page="total"
      @change="handleTableChange"
      :loading="loading"
    />

    <!--    编辑学生的组件-->
    <edit-student
      :visible="editPanelVisible"
      @cancel="cancelEdit"
      :majors="majors"
      :courses='courses'
      :data="currentData"
      @success="saveSuccess"
    />
    <!--    添加学生的组件-->
    <add-student
      :visible="addPanelVisible"
      @cancel="cancelAdd"
      :majors="majors"
      @success="addSuccess"
    />
  </div>
</template>
<script>
import { getStudentPage, getAllMajors, getAllCourses } from "network/student";
import responseCode from "network/responseCode";
import EditStudent from "./components/EditStudent"; //编辑学生组件
import AddStudent from "./components/AddStudent"; //添加学生组件
import StudentTable from "./components/StudentTable"; //学生展示表格组件
import {getCookie} from "common/cookie";

export default {
  components: { StudentTable, AddStudent, EditStudent },
  data() {
    return {
      data: [], //学生数据
      total: 0, //数据总数
      loading: false, //是否加载
      currentPage: 1, //当前页
      pageSize: 10, //每页数据条数
      editPanelVisible: false, //编辑面板是否可见
      majorFilters: [], //专业过滤列表
      currentData: {}, //当前操作的学生数据（添加或修改）
      majors: [], // 所有专业信息
      courses:[], // 所有课程信息
      addPanelVisible: false, //添加学生的弹窗是否可见
    };
  },
  mounted() {
    // 第一次加载获取数据
    this.getData();
    //获取所有学院数据
    this.getMajors();
    // 获取所有课程数据
    this.getCourses();
  },
  methods: {
    isStudent() {
      return getCookie('loginType') === '0';
    },
    isAdmin() {
      return getCookie('loginType') === '2';
    },
    //保存成功
    saveSuccess() {
      this.getData();
      this.editPanelVisible = false;
    },
    //添加学生成功
    addSuccess() {
      this.getData();
      this.addPanelVisible = false;
    },
    // 取消修改
    cancelEdit() {
      this.editPanelVisible = false;
    },
    //打开添加学生的弹窗
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
    // 取消编辑学生信息
    editCancel() {
      this.editPanelVisible = false;
    },

    // 获取分页数据
    getData() {
      this.loading = true;
      //调用获取分页数据的方法，传入页码和数据条数
      getStudentPage(this.currentPage - 1, this.pageSize)
        .then((res) => {
          //判断code
          if (res.code === 20000) {
            if (this.isStudent()) {
              res.data.content = res.data.content.filter(student => student.account === getCookie('account'));
            }
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
    //获取所有的专业信息
    getMajors() {
      getAllMajors()
        .then((res) => {
          if (res.code === 20000) {
            res.data.forEach(major => major.majorName += '(' + major.school.schoolName + ')');
            this.majors = res.data;
            res.data.forEach((value) => {
              this.majorFilters.push({
                text: value.majorName,
                value: value.majorName,
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
    // 获取所有课程信息
    getCourses() {
      getAllCourses()
        .then((res) => {
          if (res.code === 20000) {
            res.data = res.data.filter(course => course.isDelete === 'UNDELETED');
            this.courses = res.data;
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
