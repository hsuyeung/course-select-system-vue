<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-button type="primary" @click="openAddPanel">添加轮播</a-button>
      <a-button type="primary" style="margin-left: 10px" @click="()=>this.getData()">刷新数据</a-button>
    </div>

    <swiper-table
      :data="data"
      :roleFilters="roleFilters"
      @actionClick="openEditPanel"
      @deleteClick="deleteClick"
      :current-page="currentPage"
      :total-page="total"
      @change="handleTableChange"
      :loading="loading"
    />

    <!--    编辑管理员的组件-->
    <edit-swiper
      :visible="editPanelVisible"
      @cancel="cancelEdit"
      :roles="roles"
      :data="currentData"
      @success="saveSuccess"
    />
    <!--    添加管理员的组件-->
    <add-swiper
      :visible="addPanelVisible"
      @cancel="cancelAdd"
      :roles="roles"
      @success="addSuccess"
    />
  </div>
</template>
<script>

  import responseCode from "network/responseCode";
  import EditSwiper from "./components/EditSwiper";//编辑管理员组件
  import AddSwiper from "./components/AddSwiper";//添加管理员组件
  import SwiperTable from "./components/SwiperTable";
  import {getSwiperPage} from "network/swiper";
  import {deleteSwiper} from "../../../network/swiper";
  //管理员展示表格组件


  export default {
    components: {
      EditSwiper,
      SwiperTable,
      AddSwiper
    },
    data() {
      return {
        data: [],//管理员数据
        total: 0,//数据总数
        loading: false,//是否加载
        currentPage: 1,//当前页
        pageSize: 10,//每页数据条数
        editPanelVisible: false,//编辑面板是否可见
        roleFilters: [],//权限过滤列表
        currentData: {},//当前操作的管理员数据（添加或修改）
        roles: [],//所有角色信息
        addPanelVisible: false,//添加管理员的弹窗是否可见
      };
    },
    mounted() {
      // 第一次加载获取数据
      this.getData();
    },
    methods: {
      //删除轮播
      deleteClick(index) {
        deleteSwiper(this.data[index].id).then(res => {
          if (res.code === 20000) {
            this.$message.success({
              content:"删除成功"
            })
            //重新获取数据
            this.getData();
          } else {
            responseCode(res.code, this);
          }
        }).catch(err => {
          responseCode(-1, this);
        })
      },
      //保存成功
      saveSuccess() {
        this.getData();
        this.editPanelVisible = false;
      },
      //添加管理员成功
      addSuccess() {
        this.getData();
        this.addPanelVisible = false;
      },
      // 取消修改
      cancelEdit() {
        this.editPanelVisible = false;
      },
      //打开添加管理员的弹窗
      openAddPanel() {
        // 设置添加弹窗可见
        this.addPanelVisible = true
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
        this.currentData.loginPass = '';
        this.editPanelVisible = true;
      },
      // 取消编辑管理员信息
      editCancel() {
        this.editPanelVisible = false;
      },

      // 获取分页数据
      getData() {
        this.loading = true;
        //调用获取分页数据的方法，传入页码和数据条数
        getSwiperPage(this.currentPage, this.pageSize).then(res => {
          //判断code
          if (res.code === 20000) {//获取成功
            //设置数据
            this.data = res.data.data;
            // 设置分页的数据总条数
            this.total = res.data.count;
          } else {//
            responseCode(res.code, this)
          }
          this.loading = false;

        }).catch(err => {
          responseCode(-1, this);
          this.loading = false;
        })
      },
    },

  };
</script>

<style scoped>

</style>
