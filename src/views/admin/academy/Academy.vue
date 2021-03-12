<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-button type="primary" @click="openAddPanel">添加学院</a-button>
      <a-button
        type="primary"
        style="margin-left: 10px"
        @click="() => this.getData()"
        >刷新数据</a-button
      >
    </div>

    <academy-table
      :data="data"
      :schoolFilters="schoolFilters"
      @actionClick="openEditPanel"
      :current-page="currentPage"
      :total-page="total"
      @change="handleTableChange"
      :loading="loading"
    />

    <!--    编辑学院的组件-->
    <edit-academy
      :visible="editPanelVisible"
      @cancel="cancelEdit"
      :schools="schools"
      :data="currentData"
      @success="saveSuccess"
    />
    <!--    添加学院的组件-->
    <add-academy
      :visible="addPanelVisible"
      @cancel="cancelAdd"
      :schools="schools"
      @success="addSuccess"
    />
  </div>
</template>
<script>
import { getAcademyPage, getAllSchool } from "network/academy"; //获取API数据和网络请求相关
import responseCode from "network/responseCode";
import EditAcademy from "./components/EditAcademy"; //编辑学院组件
import AddAcademy from "./components/AddAcademy"; //添加学院组件
import AcademyTable from "./components/AcademyTable"; //学院展示表格组件

export default {
  components: { AcademyTable, AddAcademy, EditAcademy },
  data() {
    return {
      data: [], //学院数据
      total: 0, //数据总数
      loading: false, //是否加载
      currentPage: 1, //当前页
      pageSize: 10, //每页数据条数
      editPanelVisible: false, //编辑面板是否可见
      schoolFilters: [], //学校过滤列表
      currentData: {}, //当前操作的学院数据（添加或修改）
      schools: [], //所有学校信息
      addPanelVisible: false, //添加学院的弹窗是否可见
    };
  },
  mounted() {
    // 第一次加载获取数据
    this.getData();
    //获取所有学校数据
    this.getSchools();
  },
  methods: {
    //保存成功
    saveSuccess() {
      this.getData();
      this.editPanelVisible = false;
    },
    //添加学院成功
    addSuccess() {
      this.getData();
      this.addPanelVisible = false;
    },
    // 取消修改
    cancelEdit() {
      this.editPanelVisible = false;
    },
    //打开添加学院的弹窗
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
    // 取消编辑学院信息
    editCancel() {
      this.editPanelVisible = false;
    },

    // 获取分页数据
    getData() {
      this.loading = true;
      //调用获取分页数据的方法，传入页码和数据条数
      getAcademyPage(this.currentPage - 1, this.pageSize)
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
    //获取所有的学校信息
    getSchools() {
      getAllSchool()
        .then((res) => {
          if (res.code === 20000) {
            this.schools = res.data;
            res.data.forEach((value) => {
              this.schoolFilters.push({
                text: value.schoolName,
                value: value.schoolName,
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
