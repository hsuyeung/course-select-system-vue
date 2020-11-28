<template>
  <div>
    <div style="margin-bottom: 10px">
      <a-button type="primary" style="margin-left: 10px" @click="()=>this.getData()">刷新数据</a-button>
    </div>

    <article-table
      :data="data"
      @actionClick="openEditPanel"
      :current-page="currentPage"
      :total-page="total"
      @change="handleTableChange"
      :loading="loading"
    />
  </div>
</template>
<script>

  import responseCode from "network/responseCode";
  import ArticleTable from "./components/ArticleTable";
  import {getArticlePage} from "network/article";
  import {getCookie} from "common/cookie";
  //管理员展示表格组件


  export default {
    components: { ArticleTable},
    data() {
      return {
        data: [],//数据
        total: 0,//数据总数
        loading: false,//是否加载
        currentPage: 1,//当前页
        pageSize: 10,//每页数据条数
        currentData: {},//当前操作的数据（添加或修改）
        isSuperAdmin:false,//是否是超级管理员
      };
    },
    created() {
      //获取当前用户的角色
      let roles = getCookie('role');
      this.isSuperAdmin = roles.includes('SUPER_ADMIN')
    },
    mounted() {
      // 第一次加载获取数据
      this.getData();
    },
    methods: {
      // 表格发生变化
      handleTableChange(currentPage) {
        this.currentPage = currentPage;
        this.getData();
      },
      //打开编辑弹窗
      openEditPanel(index) {
        this.currentData = this.data[index]
        this.$EventBus.$emit("editArticle",this.currentData)
      },

      // 获取分页数据
      getData() {
        this.loading = true;
        //调用获取分页数据的方法，传入页码和数据条数
        getArticlePage(this.currentPage, this.pageSize).then(res => {
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
