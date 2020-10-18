<template>
  <a-layout style="height: 100vh;width: 100vw;display: flex">

    <!--    侧边导航开始-->
    <a-layout-sider v-model="collapsed" collapsible
                    :style="{ overflow: 'auto', height: '100vh' }">
      <div class="logo"/>
      <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
        <a-sub-menu :key="sub.key" v-for="sub in menu">
          <span slot="title"><a-icon :type="sub.icon"/><span>{{sub.title}}</span></span>
          <a-menu-item :key="item.key" v-for="item in sub.childrenMenu">
            {{item.title}}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <!--    侧边导航结束-->

    <a-layout style="height:100vh;flex:1">

      <!--      顶部开始-->
      <a-layout-header style="position: fixed;width: 100%;z-index: 1">
        <a-menu
          theme="dark"
          mode="horizontal"
          :default-selected-keys="['2']"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1">
            nav 1
          </a-menu-item>
          <a-menu-item key="2">
            nav 2
          </a-menu-item>
          <a-menu-item key="3">
            nav 3
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <!--      顶部结束-->
      <a-layout-content class="content" style="background: white;margin-top: 64px">
        <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit" style="width: 100%;height: 50px"
                @prevClick="callback"
                @nextClick="callback" @change="tabChange">
          <a-tab-pane v-for="(item,index) in panes" :key="index" :tab="item.title" :closable="item.closable"
                      forceRender>

          </a-tab-pane>
        </a-tabs>
        <div class="content-box" style="width: 100%;padding: 5px">
          <keep-alive :exclude="exclude">
            <router-view class="content-view"/>
          </keep-alive>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import menu from "config/menu";

  export default {
    name: "Admin",
    data() {
      return {
        collapsed: false,
        panes: [
          {title: "控制台", pathName: "", closable: false},
          {title: 'Tab 1', pathName: "UserList"},
          {title: '文章列表', pathName: "ArticleList"},
          {title: '添加文章', pathName: "AddArticle"},
        ],
        activeKey: 0,
        newTabIndex: 0,
        exclude: "",
        menu: [menu.user, menu.article]
      };
    },
    methods: {
      callback(val) {
        console.log(val);
      },
      onEdit(targetKey, action) {
        this[action](targetKey);
      },
      tabChange(key) {
        console.log(key);
        this.$router.replace({name: this.panes[key].pathName});
      },
      remove(targetKey) {
        let activeKey = this.activeKey;
        this.exclude = this.panes[targetKey].pathName
        this.panes.splice(targetKey, 1);
        if (activeKey == targetKey) {
          this.activeKey = this.panes.length - 1;
          this.$router.replace({name: this.panes[this.activeKey].pathName});

        }
      },
    },
    created() {

    }
  };
</script>

<style scoped>
  .content-box {
    height: calc(100% - 50px);
  }

  .content-view {
    height: calc(100%);
    overflow: auto;
  }

  .content >>> .ant-tabs-tabpane {
    display: block;
    overflow: auto;
  }

  .content >>> .ant-tabs-content {
    height: 100%;
    display: none;
  }

  .content-view::-webkit-scrollbar { /*滚动条整体样式*/

    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/

    height: 2px;

  }

  .content-view::-webkit-scrollbar-thumb { /*滚动条里面小方块*/

    border-radius: 10px;

    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

    background: #001529;

  }

  .content-view::-webkit-scrollbar-track { /*滚动条里面轨道*/

    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

    border-radius: 10px;

    background: #FFFFFF;

  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
  }
</style>
