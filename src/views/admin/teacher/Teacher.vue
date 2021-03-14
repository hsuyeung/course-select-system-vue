<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-button v-if="isAdmin()" type="primary" @click="openAddPanel">添加教师</a-button>
      <a-button
        type="primary"
        style="margin-left: 10px"
        @click="() => this.getData()"
        >刷新数据</a-button
      >
    </div>

    <teacher-table
      :data="data"
      :academyFilters="academyFilters"
      @actionClick="openEditPanel"
      :current-page="currentPage"
      :total-page="total"
      @change="handleTableChange"
      :loading="loading"
    />

    <!--    编辑教师的组件-->
    <edit-teacher
      :visible="editPanelVisible"
      @cancel="cancelEdit"
      :academies="academies"
      :data="currentData"
      @success="saveSuccess"
    />
    <!--    添加教师的组件-->
    <add-teacher
      :visible="addPanelVisible"
      @cancel="cancelAdd"
      :academies="academies"
      @success="addSuccess"
    />
  </div>
</template>
<script>
import { getTeacherPage, getAllAcademies } from "network/teacher";
import responseCode from "network/responseCode";
import EditTeacher from "./components/EditTeacher"; //编辑教师组件
import AddTeacher from "./components/AddTeacher"; //添加教师组件
import TeacherTable from "./components/TeacherTable"; //教师展示表格组件
import { getCookie } from 'common/cookie';

export default {
  components: { TeacherTable, AddTeacher, EditTeacher },
  data() {
    return {
      data: [], //教师数据
      total: 0, //数据总数
      loading: false, //是否加载
      currentPage: 1, //当前页
      pageSize: 10, //每页数据条数
      editPanelVisible: false, //编辑面板是否可见
      academyFilters: [], //学院过滤列表
      currentData: {}, //当前操作的教师数据（添加或修改）
      academies: [], //所有学院信息
      addPanelVisible: false, //添加教师的弹窗是否可见
    };
  },
  mounted() {
    // 第一次加载获取数据
    this.getData();
    //获取所有学院数据
    this.getAcademies();
  },
  methods: {
    isAdmin() {
      return getCookie('loginType') === '2';
    },
    isTeacher() {
      return getCookie('loginType') === '1';
    },
    //保存成功
    saveSuccess() {
      this.getData();
      this.editPanelVisible = false;
    },
    //添加教师成功
    addSuccess() {
      this.getData();
      this.addPanelVisible = false;
    },
    // 取消修改
    cancelEdit() {
      this.editPanelVisible = false;
    },
    //打开添加教师的弹窗
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
    // 取消编辑教师信息
    editCancel() {
      this.editPanelVisible = false;
    },

    // 获取分页数据
    getData() {
      this.loading = true;
      //调用获取分页数据的方法，传入页码和数据条数
      getTeacherPage(this.currentPage - 1, this.pageSize)
        .then((res) => {
          //判断code
          if (res.code === 20000) {
            // 如果是教师登录，则只显示当前登录的教师数据s
          if (this.isTeacher()) {
            res.data.content = res.data.content.filter(teacher => teacher.account === getCookie('account'));
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
    //获取所有的学院信息
    getAcademies() {
      getAllAcademies()
        .then((res) => {
          if (res.code === 20000) {
            res.data.forEach(academy => academy.academyName += '(' + academy.school.schoolName + ')');
            this.academies = res.data;
            res.data.forEach((value) => {
              this.academyFilters.push({
                text: value.academyName,
                value: value.academyName,
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
  },
};
</script>

<style scoped>
</style>
