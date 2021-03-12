<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-button type="primary" @click="openAddPanel">添加专业</a-button>
      <a-button
        type="primary"
        style="margin-left: 10px"
        @click="() => this.getData()"
        >刷新数据</a-button
      >
    </div>

    <major-table
      :data="data"
      :majorFilters="majorFilters"
      @actionClick="openEditPanel"
      :current-page="currentPage"
      :total-page="total"
      @change="handleTableChange"
      :loading="loading"
    />

    <!--    编辑专业的组件-->
    <edit-major
      :visible="editPanelVisible"
      @cancel="cancelEdit"
      :academies="academies"
      :data="currentData"
      @success="saveSuccess"
    />
    <!--    添加专业的组件-->
    <add-major
      :visible="addPanelVisible"
      @cancel="cancelAdd"
      :academies="academies"
      @success="addSuccess"
    />
  </div>
</template>
<script>
import { getMajorPage, getAllAcademySplicingSchool } from "network/major"; //获取API数据和网络请求相关
import responseCode from "network/responseCode";
import EditMajor from "./components/EditMajor"; //编辑专业组件
import AddMajor from "./components/AddMajor"; //添加专业组件
import MajorTable from "./components/MajorTable"; //专业展示表格组件

export default {
  components: { MajorTable, AddMajor, EditMajor },
  data() {
    return {
      data: [], //专业数据
      total: 0, //数据总数
      loading: false, //是否加载
      currentPage: 1, //当前页
      pageSize: 10, //每页数据条数
      editPanelVisible: false, //编辑面板是否可见
      majorFilters: [], //学院过滤列表
      currentData: {}, //当前操作的专业数据（添加或修改）
      academies: [], //所有学院信息
      addPanelVisible: false, //添加专业的弹窗是否可见
    };
  },
  mounted() {
    // 第一次加载获取数据
    this.getData();
    //获取所有学院数据
    this.getAcademies();
  },
  methods: {
    //保存成功
    saveSuccess() {
      this.getData();
      this.editPanelVisible = false;
    },
    //添加专业成功
    addSuccess() {
      this.getData();
      this.addPanelVisible = false;
    },
    // 取消修改
    cancelEdit() {
      this.editPanelVisible = false;
    },
    //打开添加专业的弹窗
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
    // 取消编辑专业信息
    editCancel() {
      this.editPanelVisible = false;
    },

    // 获取分页数据
    getData() {
      this.loading = true;
      //调用获取分页数据的方法，传入页码和数据条数
      getMajorPage(this.currentPage - 1, this.pageSize)
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
      getAllAcademySplicingSchool()
        .then((res) => {
          if (res.code === 20000) {
            res.data.forEach(academy => academy.academyName += '(' + academy.school.schoolName + ')');
            this.academies = res.data;
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
  },
};
</script>

<style scoped>
</style>
