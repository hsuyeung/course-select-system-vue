<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-button type="primary" @click="openAddPanel">添加角色</a-button>
      <a-button
        type="primary"
        style="margin-left: 10px"
        @click="() => this.getData()"
        >刷新数据</a-button
      >
    </div>

    <role-table
      :data="data"
      :authorityFilters="authorityFilters"
      @actionClick="openEditPanel"
      :current-page="currentPage"
      :total-page="total"
      @change="handleTableChange"
      :loading="loading"
    />

    <!--    编辑角色的组件-->
    <edit-role
      :visible="editPanelVisible"
      @cancel="cancelEdit"
      :authorities="authorities"
      :data="currentData"
      @success="saveSuccess"
    />
    <!--    添加角色的组件-->
    <add-role
      :visible="addPanelVisible"
      @cancel="cancelAdd"
      :authorities="authorities"
      @success="addSuccess"
    />
  </div>
</template>
<script>
import { getRolesPage, getAllAuthority } from "network/system";
// import { getAdministratorPage, getAllRoles } from "network/system"; //获取API数据和网络请求相关
import responseCode from "network/responseCode";
import EditRole from "./components/EditRole";
import AddRole from "./components/AddRole";
import RoleTable from "./components/RoleTable";

export default {
  components: { RoleTable, AddRole, EditRole },
  data() {
    return {
      data: [], // 角色数据
      total: 0, // 数据总数
      loading: false, // 是否加载
      currentPage: 1, // 当前页
      pageSize: 10, // 每页数据条数
      editPanelVisible: false, // 编辑面板是否可见
      authorityFilters: [], // 权限过滤列表
      currentData: {}, // 当前操作的角色数据（添加或修改）
      authorities: [], // 所有权限信息
      addPanelVisible: false, // 添加管理员的弹窗是否可见
    };
  },
  mounted() {
    // 第一次加载获取数据
    this.getData();
    //获取所有权限数据
    this.getAuthorities();
  },
  methods: {
    //保存成功
    saveSuccess() {
      this.getData();
      this.editPanelVisible = false;
    },
    //添加角色成功
    addSuccess() {
      this.getData();
      this.addPanelVisible = false;
    },
    // 取消修改
    cancelEdit() {
      this.editPanelVisible = false;
    },
    //打开添加角色的弹窗
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
    // 取消编辑角色信息
    editCancel() {
      this.editPanelVisible = false;
    },

    // 获取分页数据
    getData() {
      this.loading = true;
      // 调用获取分页数据的方法，传入页码和数据条数
      getRolesPage(this.currentPage - 1, this.pageSize)
        .then((res) => {
          // 判断code
          if (res.code === 20000) {
            // 获取成功
            // 设置数据
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
    // 获取所有的权限信息
    getAuthorities() {
      getAllAuthority()
        .then((res) => {
          if (res.code === 20000) {
            this.authorities = res.data;
            res.data.forEach((value) => {
              this.authorityFilters.push({
                text: value.name,
                value: value.name,
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
